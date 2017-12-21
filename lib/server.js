'use strict';

const WebServer = require('./web/server');
const directories = require('./directories');

module.exports = class {

  constructor(config, dev) {
    directories.configure(config.data.directory);

    this._web = new WebServer(config, dev);
  }

  async close() {
    await this._web.close();
  }
};
