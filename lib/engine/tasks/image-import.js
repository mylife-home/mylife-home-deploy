'use strict';

const fs      = require('fs-extra');
const vfs     = require('../vfs');
const archive = require('../archive');

exports.metadata = [
  { name : 'archiveName', description: 'archive name', type: 'string', default: 'rpi-devel-base.tar.gz' },
  { name : 'rootPath', description: 'path of the root fs inside the archive', type: 'string', default: 'mmcblk0p1' }
];

exports.execute = async (context, config) => {
  const { archiveName, rootPath } = config;

  const buffer = await fs.readFile(archiveName);

  context.root = context.root || new vfs.Directory({ missing: true });
  await archive.extract(buffer, context.root, { baseDirectory: rootPath });
}