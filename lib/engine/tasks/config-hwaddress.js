'use strict';

const vfs   = require('../vfs');
const utils = require('../tasks-utils');

exports.metadata = {
  description : 'set the hostname',
  parameters  : [
    { name : 'iface',   description: 'host name',          type: 'string' },
    { name : 'address', description: 'mac address to set', type: 'string' }
  ]
};

exports.execute = async (context, parameters) => {
  const { iface, address } = parameters;
  const log = utils.createLogger(context, 'config:hwaddress');
  log.info(`set address to '${address}' for interface '${iface}'`);
  const lines = vfs.readText(context.config, [ 'etc', 'network', 'interfaces' ]).split('\n');

  const index = lines.findIndex(row => row.trim().startsWith(`iface ${iface}`));
  if(index === -1) {
    throw new Error(`Interface ${iface} not found in configuration`);
  }
  lines.splice(index + 1, 0, `\thwaddress ether ${address}`);

  vfs.writeText(context.config, [ 'etc', 'network', 'interfaces' ], lines.join('\n'));
};