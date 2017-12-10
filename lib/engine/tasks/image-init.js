'use strict';

const fs      = require('fs-extra');
const vfs     = require('../vfs');
const archive = require('../archive');

exports.metadata = [
  { name : 'baseImage', description: 'base image name', type: 'string', default: 'rpi-devel-base.tar.gz' },
  { name : 'rootPath', description: 'path of the root fs inside the base image', type: 'string', default: 'mmcblk0p1' }
];

exports.execute = async (context, config) => {
  const { baseImage, rootPath } = config;

  const buffer = await fs.readFile(baseImage);

  context.vfs = new vfs.Directory({ missing: true });
  await archive.extract(buffer, context.vfs, { baseDirectory: rootPath });

  const configFile = context.vfs.list().find(node => node.name.endsWith('.apkovl.tar.gz'));
  context.config   = new vfs.Directory({ missing: true });
  await archive.extract(configFile.content, context.config);
}