'use strict';

const WebServer = require('./web/server');

module.exports = class {

  constructor(config, dev) {
    this._web = new WebServer(config, dev);
  }

  close(done) {
    this._web.close(done);
  }
};
