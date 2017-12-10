'use strict';

const { expect } = require('chai');
const fs         = require('fs-extra');
const archive    = require('../../lib/engine/archive');
const vfs        = require('../../lib/engine/vfs');

//const source = '/Users/vincent/Downloads/alpine-rpi-3.7.0-armhf.tar.gz';
const source = '/Users/vincent/Downloads/rpi-devel-base.tar.gz';

let cachedBase;

async function extractBase() {
  if(cachedBase) {
    return cachedBase;
  }

  const buffer = await fs.readFile(source);
  const target = new vfs.Directory({ missing: true });
  await archive.extract(buffer, target, { baseDirectory: 'mmcblk0p1' });
  cachedBase = target;
  return target;
}

let cachedConfig;

async function extractConfig() {
  if(cachedConfig) {
    return cachedConfig;
  }

  const base = await extractBase();

  const target = new vfs.Directory({ missing: true });
  await archive.extract(base.get('rpi-devel.apkovl.tar.gz').content, target);
  cachedConfig = target;
  return target;
}

describe('Archive', () => {

  it('Should extract base', async () => {
    const target = await extractBase();

    expect(formatStructure(target)).to.deep.equal(require('./archive-content-base'));
  });

  it('Should extract config', async () => {
    const target = await extractConfig();

    expect(formatStructure(target)).to.deep.equal(require('./archive-content-config'));
  });

  it('Should pack then extract folder', async () => {
    const source = await extractConfig();

    const buffer = await archive.pack(source);
    const target = new vfs.Directory();
    await archive.extract(buffer, target);

    expect(formatStructure(target)).to.deep.equal(require('./archive-content-config'));
  });
});

function printDate(date) {
  return date ? `new Date(${date.valueOf()})` : 'null';
}

function printLines(lines) {
  lines.forEach(l => {
    let line = `  { indent: ${l.indent}, name: '${l.name}', `;
    line = line.padEnd(70);
    line += `uid: ${l.uid}, gid: ${l.gid}, mode: 0o${l.mode.toString(8)}, atime: ${printDate(l.atime)}, mtime: ${printDate(l.mtime)}, ctime: ${printDate(l.ctime)}`;
    if(l.hasOwnProperty('dir')) {
      line += ', dir: true';
    }
    if(l.hasOwnProperty('length')) {
      line += `, length: ${l.length}`;
    }
    if(l.hasOwnProperty('target')) {
      line += `, target: '${l.target}'`;
    }
    if(l.hasOwnProperty('missing')) {
      line += `, missing: ${l.missing}`;
    }
    line += ' },';

    console.log(line);
  });
}

function formatStructure(root) {
  const lines = [];
  formatDirectory(lines, root, 0);
  return lines;
}

function formatDirectory(lines, vdir, indent) {
  for(const vnode of vdir.list()) {
    const output = {
      indent,
      name  : vnode.name,
      uid   : vnode.uid,
      gid   : vnode.gid,
      mode  : vnode.mode,
      atime : vnode.atime,
      mtime : vnode.mtime,
      ctime : vnode.ctime
    };

    if(vnode instanceof vfs.Directory) {
      if(vnode.missing) { output.missing = true; }
      output.dir = true;
      lines.push(output);
      formatDirectory(lines, vnode, indent + 1);
      continue;
    }

    if(vnode instanceof vfs.File) {
      output.length = vnode.content.length;
    } else if(vnode instanceof vfs.Symlink) {
      output.target = vnode.target;
    }
    lines.push(output);
  }
}
