'use strict';

const { expect } = require('chai');
const fs         = require('fs-extra');
const archive    = require('../../lib/engine/archive');
const vfs        = require('../../lib/engine/vfs');

const source = '/Users/vincent/Downloads/alpine-rpi-3.7.0-armhf.tar.gz';

describe('Archive', () => {

  it('Should extract ', async () => {
    const buffer = await fs.readFile(source);
    const target = new vfs.Directory();
    await archive.extract(buffer, target);
    console.log(target.list());
    //expect(null).to.equal(null);
  });
});
