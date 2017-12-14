'use strict';

const fs      = require('fs-extra');
const vfs     = require('../vfs');
const archive = require('../archive');

exports.metadata = {
  description : 'Extract the config (.apkovl.tar.gz) from the image to context.config',
  parameters  : []
};

exports.execute = async (context, config) => {
  const configFile = context.root.list().find(node => node.name.endsWith('.apkovl.tar.gz'));
  context.config   = new vfs.Directory({ missing: true });
  await archive.extract(configFile.content, context.config);
}