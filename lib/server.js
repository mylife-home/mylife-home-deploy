'use strict';

const WebServer = require('./web/server');
const Manager = require('./engine/manager');
const directories = require('./directories');

let running = false;
let manager;
let web;

exports.start = (config, dev) => {
  if(running) {
    throw new Error('already running');
  }

  directories.configure(config.data.directory);

  manager = new Manager();
  web     = new WebServer(config, dev);

  running = true;
};

exports.stop = async() => {
  await Promise.all([
    web.close(),
    manager.close()
  ]);

  web     = null;
  manager = null;

  running = false;
};

exports.getManager = () => manager;
exports.getWeb     = () => web;
exports.isRunning  = () => running;