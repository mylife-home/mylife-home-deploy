'use strict';

const fs      = require('fs-extra');
const vfs     = require('../vfs');
const archive = require('../archive');

exports.metadata = {
  description : 'remove a node (file/directory/symlink) from the root fs',
  parameters  : [
    { name : 'path', description: 'path to remove name', type: 'string' }
  ]
};

exports.execute = async (context, config) => {
  const { path } = config;

  const nodes = path.split('/');
  const dir = vfs.path(context.vfs, nodes.slice(0, nodes.length - 1));
  dir.delete(node[node.length - 1]);
}