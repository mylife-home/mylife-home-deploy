'use strict';

const vfs = require('../vfs');

exports.metadata = [
  { name : 'name', description: 'daemon name', type: 'string' },
  { name : 'runlevel', description: 'runlevel', type: 'string', default: 'default' }
];

exports.execute = async (context, config) => {
  const { name, runlevel } = config;
  const dir = vfs.path(context.config, [ 'etc', 'runlevels', runlevel ]);
  const symlink = new vfs.Symlink({ name, target : `/etc/init.d/${name}` });
  dir.add(symlink);
}
