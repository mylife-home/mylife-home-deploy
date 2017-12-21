'use strict';

const path        = require('path');
const vfs         = require('./vfs');
const directories = require('../directories');

// used by several tasks
exports.configAddPackage = (log, context, name) => {
  let content = vfs.readText(context.config, [ 'etc', 'apk', 'world' ]);
  if(!content.endsWith('\n')) {
    content += '\n';
  }
  content += name + '\n';
  vfs.writeText(context.config, [ 'etc', 'apk', 'world' ], content);
  log.debug(`config: add '${name}' to '/etc/apk/world'`);
};

exports.createLogger = (context, category) => {
  return {
    debug   : msg => context.logger(category, 'debug', msg),
    info    : msg => context.logger(category, 'info', msg),
    warning : msg => context.logger(category, 'warning', msg)
  };
};

exports.absolutePath = p => path.join(directories.files(), p);