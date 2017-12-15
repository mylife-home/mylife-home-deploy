'use strict';

const vfs = require('./vfs');

// used by several tasks
exports.configAddPackage = (context, name) => {
  let content = vfs.readText(context.config, [ 'etc', 'apk', 'world' ]);
  if(!content.endsWith('\n')) {
    content += '\n';
  }
  content += name + '\n';
  vfs.writeText(context.config, [ 'etc', 'apk', 'world' ], content);
};