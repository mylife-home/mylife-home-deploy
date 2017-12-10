'use strict';

const vfs     = require('../vfs');
const archive = require('../archive');

exports.metadata = [
];

exports.execute = async (context, config) => {
  const configFile   = context.vfs.list().find(node => node.name.endsWith('.apkovl.tar.gz'));
  configFile.content = await archive.pack(context.config);
  context.image      = await archive.pack(context.vfs);
}