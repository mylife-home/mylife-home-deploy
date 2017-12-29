'use strict';

const config = require('../conf/config');
const server = require('../lib/server');

const dev = process.argv.includes('--dev');

server.start(config, dev);

async function terminate() {
  await server.stop();
  process.exit();
}

process.on('SIGINT', terminate);
process.on('SIGTERM', terminate);
