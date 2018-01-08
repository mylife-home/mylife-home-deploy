'use strict';

const path        = require('path');
const vfs         = require('./vfs');
const directories = require('../directories');

exports.singleRowFileUpdate = (root, nodes, updater) => {
  let content = '';
  if(vfs.path(root, nodes, true)) {
    content = vfs.readText(root, nodes);
  }

  const endNewline = content.endsWith('\n');
  if(endNewline) {
    content = content.substring(0, content.length - 1);
  }

  content = updater(content);

  if(endNewline) {
    content += '\n';
  }

  vfs.writeText(root, nodes, content);
};

function fileAppendLine(root, nodes, line) {
  let content = '';
  if(vfs.path(root, nodes, true)) {
    content = vfs.readText(root, nodes);
    if(!content.endsWith('\n')) {
      content += '\n';
    }
  }
  content += line + '\n';
  vfs.writeText(root, nodes, content);
}

exports.fileAppendLine = fileAppendLine;

// used by several tasks
exports.configAddPackage = (log, context, name) => {
  fileAppendLine(context.config, [ 'etc', 'apk', 'world' ], name);
  log.debug(`config: add '${name}' to '/etc/apk/world'`);
};

exports.createLogger = (context, category) => {
  return {
    debug   : msg => context.logger(category, 'debug',   msg),
    info    : msg => context.logger(category, 'info',    msg),
    warning : msg => context.logger(category, 'warning', msg),
    error   : msg => context.logger(category, 'error',   msg)
  };
};

exports.absolutePath = p => path.join(directories.files(), p);