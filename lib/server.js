'use strict';

const WebServer = require('./web/server');

module.exports = class {

  constructor(config, dev) {
    this._web = new WebServer(config, dev);
  }

  async close() {
    await this._web.close();
  }
};
