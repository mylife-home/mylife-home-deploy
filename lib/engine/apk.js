'use strict';

const http    = require('http');
const vfs     = require('./vfs');
const archive = require('./archive');
const {
  BufferWriter,
  apipe
} = require('./buffers');

const arch = 'armhf';

const indexHeaders = {
  // https://wiki.alpinelinux.org/wiki/Apk_spec
  //A Architecture
  C: 'csum', // Pull Checksum
  D: 'dependencies', //Pull Dependencies
  //I Package Installed Size
  //L License
  P: 'name', // Package Name
  S: 'size', // Package Size
  //T Package Description
  //U Package URL
  V: 'version', // Package Version
  //c Git commit of aport
  //i Automatic Install Condition (aka Install IF)
  //m Maintainer
  //o Package Origin
  p: 'provides', // Package Provides
  //t Build Timestamp (epoch)
};

function aget(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, resolve);
    req.once('error', reject);
  });
}

async function download(url) {
  const stream = await aget(url);
  const writer = new BufferWriter();
  await apipe(stream, writer);
  return writer.getBuffer();
}

function valideProvideDependency(key) {
  const [ prefix, name ] = key.split(':');
  if(!name) { return true; } // no prefix
  return ['so', 'pc'].includes(prefix);
}

exports.index = async options => {

  const { repo } = options;
  let url = repo;
  if(!url.endsWith('/')) {
    url += '/';
  }
  url += `${arch}/APKINDEX.tar.gz`;

  const buffer = await download(url);

  const content = new vfs.Directory();
  await archive.extract(buffer, content);

  const raw = vfs.readText(content, [ 'APKINDEX' ]);
  const parts = raw.split('\n\n');
  const index = [];

  for(const raw of parts) {
    const lines = raw.split('\n').filter(it => it);
    if(!lines.length) {
      continue;
    }

    const output = {
      raw : lines.join('\n') + '\n\n'
    };

    const items = {};

    for(const line of lines) {
      const prefix = line.substring(0, 1);
      const value  = line.substring(2);
      const key    = indexHeaders[prefix];
      if(!key) {
        continue;
      }
      items[key] = value;
    }

    [ 'name', 'version' ].forEach(key => {
      const val = items[key];
      if(!val) {
        throw new Error(`Missing field ${key} for package ${items.name}`);
      }
      output[key] = val;
    });

    const { csum, dependencies, provides, size } = items;

    if(!csum || !csum.startsWith('Q1')) {
      throw new Error(`Unrecognized checksum for package ${items.name}`);
    }
    output.csum = Buffer.from(csum.substring(2), 'base64');

    output.dependencies = {};
    for(const dep of (dependencies || '').split(' ')) {
      if(!dep) { continue; }
      const [ key, version ] = dep.split('=');
      if(!valideProvideDependency(key)) {
        throw new Error(`Unsupported dependency : ${key} for package ${items.name}`);
      }
      output.dependencies[key] = version || '*';
    }

    output.provides = {
      [output.name] : output.version
    };

    for(const prov of (provides || '').split(' ')) {
      if(!prov) { continue; }
      const [ key, version ] = prov.split('=');
      if(!valideProvideDependency(key)) {
        continue;
      }
      output.provides[key] = version || '*';
    }

    output.size = parseInt(size);

    index.push(output);
  }

  const map = new Map();
  for(const item of index) {
    for(const prov of Object.keys(item.provides)) {
      let list = map.get(prov);
      if(!list) {
        map.set(prov, (list = []));
      }
      list.push(item);
    }
  }

  return { index, map };
};

exports.installList = (index, name) => {
  const mapList = index.map.get(name);
  if(!mapList) {
    throw new Error(`Package not found : ${name}`);
  }
  const item = mapList[0];
  const list = [ item ];
  const map = new Map();
  map.set(item.name, item.version);
  listDependencies(list, map, index, item);
  return list;
}

function findDependency(index, name, version) {
  const list = index.map.get(name);
  if(!list) {
    throw new Error(`Dependency not found : ${name}`);
  }

  if(version === '*') {
    return list[0];
  }

  const item = list.find(it => it.version === version);
  if(!item) {
    throw new Error(`Dependency not found : ${name}-${version} (available are : ${list.map(it => it.name + '-' + it.version)}`);
  }

  return item;
}

function addDependency(list, map, dep) {
  const existing = map.get(dep.name);
  if(!existing) {
    map.set(dep.name, dep.version);
    list.push(dep);
    return true;
  }

  if(existing === dep.version) {
    return false;
  }

  throw new Error(`version mismatch for dependency ${dep.name} : ${dep.version} vs ${existing}`);
}

function listDependencies(list, map, index, item) {
  for(const name of Object.keys(item.dependencies)) {
    const version = item.dependencies[name];
    const dep = findDependency(index, name, version);
    if(addDependency(list, map, dep)) {
      listDependencies(list, map, index, dep);
    }
  }
}