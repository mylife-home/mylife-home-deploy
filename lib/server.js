'use strict';

const WebServer = require('./web/server');
const Manager = require('./engine/manager');
const directories = require('./directories');

module.exports = class {

  constructor(config, dev) {
    directories.configure(config.data.directory);

    this._manager = new Manager();
    this._web     = new WebServer(config, dev);
  }

  async close() {
    await Promise.all([
      this._web.close(),
      this._manager.close()
    ]);
  }
};
