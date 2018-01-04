'use strict';

const util              = require('util');
const path              = require('path');
const http              = require('http');
const express           = require('express');
const enableDestroy     = require('server-destroy');
const bodyParser        = require('body-parser');
const io                = require('socket.io');
const webpack           = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackConfig     = require('../../webpack.config.dev.js');

const services = [
  require('./tasks'),
  require('./files'),
  require('./recipes'),
  require('./runs')
];

module.exports = class {

  constructor(config, dev) {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: '100mb' }));

    const publicDirectory = path.resolve(path.join(__dirname, '../../public'));

    if(dev) {
      console.log('setup webpack dev middleware'); // eslint-disable-line no-console
      app.use(webpackMiddleware(webpack(webpackConfig), { publicPath: webpackConfig.output.publicPath }));
    }

    //app.use('/api', createApi());
    app.use(express.static(publicDirectory));

    this._server = http.Server(app);
    enableDestroy(this._server);

    const ioServer = io(this._server);

    for(const service of services) {
      service.init(app, ioServer);
    }

    this._server.listen(config.port);
  }

  async close() {
    await util.promisify(done => this._server.close(done));

    for(const service of services) {
      service.close();
    }

    this._server.destroy();
  }
};
