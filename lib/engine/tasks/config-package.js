'use strict';

const vfs = require('../vfs');

exports.metadata = {
  description : 'add a package to be installed',
  parameters  : [
    { name : 'name', description: 'package name', type: 'string' }
  ]
};

exports.execute = async (context, config) => {
  const { name } = config;
  let content = vfs.readText(context.config, [ 'etc', 'apk', 'world' ]);
  if(!content.endsWith('\n')) {
    content += '\n';
  }
  content += name + '\n';
  vfs.writeText(context.config, [ 'etc', 'apk', 'world' ], content);
}
