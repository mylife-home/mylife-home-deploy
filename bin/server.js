'use strict';

const config = require('../conf/config');
const Server = require('../lib/server');

const dev = process.argv.includes('--dev');

Server.start(config, dev);

async function terminate() {
  await Server.stop();
  process.exit();
}

process.on('SIGINT', terminate);
process.on('SIGTERM', terminate);
