'use strict';

const vfs = require('../vfs');

exports.metadata = {
  description : 'set the hostname',
  parameters  : [
    { name : 'hostname', description: 'host name', type: 'string', default: 'rpi-devel' }
  ]
};

function replaceHost(context, path, oldHost, newHost) {
  let content = vfs.readText(context.config, path);
  content = content.replace(new RegExp(oldHost, 'g'), newHost);
  vfs.writeText(context.config, path, content);
}

exports.execute = async (context, config) => {
  const { hostname } = config;
  let oldHostname  = vfs.readText(context.config, [ 'etc', 'hostname' ]);
  oldHostname = oldHostname.trimRight();

  replaceHost(context, [ 'etc', 'hostname' ], oldHostname, hostname);
  replaceHost(context, [ 'etc', 'network', 'interfaces' ], oldHostname, hostname);
  replaceHost(context, [ 'etc', 'hosts' ], oldHostname, hostname);
}