'use strict';

const { expect } = require('chai');
const fs         = require('fs-extra');
const archive    = require('../../lib/engine/archive');
const vfs        = require('../../lib/engine/vfs');

//const source = '/Users/vincent/Downloads/alpine-rpi-3.7.0-armhf.tar.gz';
const source = '/Users/vincent/Downloads/rpi-devel-base.tar.gz';

const archiveContent = require('./archive-content');

describe('Archive', () => {

  it('Should extract', async () => {
    const buffer = await fs.readFile(source);
    const target = new vfs.Directory();
    await archive.extract(buffer, target, { baseDirectory: 'mmcblk0p1' });
    const lines = [];
    formatDirectory(lines, target, 0);

    expect(lines).to.deep.equal(archiveContent);
  });
});

function printDate(date) {
  return date ? `new Date(${date.valueOf()})` : 'null';
}

function printLines(lines) {
  lines.forEach(l => {
    let line = `  { indent: ${l.indent}, name: '${l.name}', `;
    line = line.padEnd(70);
    line += `uid: ${l.uid}, gid: ${l.gid}, mode: ${l.mode}, atime: ${printDate(l.atime)}, mtime: ${printDate(l.mtime)}, ctime: ${printDate(l.ctime)}`;
    if(l.hasOwnProperty('dir')) {
      line += ', dir: true';
    }
    if(l.hasOwnProperty('length')) {
      line += `, length: ${l.length}`;
    }
    line += ' },';

    console.log(line);
  });
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
