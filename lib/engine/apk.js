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
  // src/package.c
  P: 'name',
  V: 'version',
  T: 'description',
  U: 'url',
  L: 'license',
  A: 'arch',
  D: 'lob_pull_deps',
  C: 'lob_pull_csum',
  S: 'size',
  I: 'installed_size',
  p: 'lob_pull_deps',
  i: 'lob_pull_deps',
  o: 'origin',
  m: 'maintainer',
  t: 'build_time',
  c: 'commit',
  k: 'provider_priority',
  // src/database.c
  // F perms ?
  // a ?
  // M acl ?
  // R ?
  Z: 'csum',
  // r replace deps ?
  // a replace priority ?
  // s repository tag ?
  // f ?
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

  return parts.map(raw => {
    const items = raw.split('\n');
    const output = {};

    for(const item of items) {
      if(!item) {
        continue;
      }
      const prefix = item.substring(0, 1);
      const value  = item.substring(2);
      const key    = indexHeaders[prefix];
      if(!key) {
        console.log('WARNING: unhandle index key : ', item);
        continue;
      }
      output[key] = value;
    }

    return output;
  });
};
