'use strict';

const server = require('../server');

exports.init = (app, io) => {

  const manager = server.getManager();
  const meta    = manager.listTasksMeta();

  const newSession = socket => {
    for(const item of meta) {
      socket.emit('task:created', item);
    }
  };

  io.on('connection', newSession);
};

exports.close = () => {};