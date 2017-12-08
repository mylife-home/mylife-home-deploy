'use strict';

const { expect } = require('chai');
const fs         = require('fs-extra');
const archive    = require('../../lib/engine/archive');
const vfs        = require('../../lib/engine/vfs');

//const source = '/Users/vincent/Downloads/alpine-rpi-3.7.0-armhf.tar.gz';
const source = '/Users/vincent/Downloads/rpi-devel-base.tar.gz';

describe('Archive', () => {

  it('Should extract ', async () => {
    const buffer = await fs.readFile(source);
    const target = new vfs.Directory();
    await archive.extract(buffer, target, { baseDirectory: 'mmcblk0p1' });
    printDir(target, 0);
    //expect(null).to.equal(null);
  });
});

function printDir(vdir, indent) {
  for(const vnode of vdir.list()) {
    const prefix = new Array(indent * 2 + 1).join(' ');
    if(vnode instanceof vfs.File) {
      console.log(prefix, vnode.name, vnode.content.length);
    } else if(vnode instanceof vfs.Symlink) {
      console.log(prefix, vnode.name, vnode.target);
    } else if(vnode instanceof vfs.Directory) {
      console.log(prefix, vnode.name, ('dir'));
      printDir(vnode, indent + 1);
    } else {
      console.log(prefix, vnode.name, ('<unknown>'));
    }
  }
}