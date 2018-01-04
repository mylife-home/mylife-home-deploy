'use strict';

const server = require('../server');

exports.init = io => {

  const manager = server.getManager();

  const getRun = (...args) => {
    const { err, ... run } = manager.getRun(...args);
    if(err) {
      // wrap it so it call properly cross socket.io
      run.err = {};
      Object.getOwnPropertyNames(err).map(key => { run.err[key] = err[key]; });
    }
    return run;
  };

  manager.on('run-created', id       => io.emit('run:created', getRun(id, false)));
  manager.on('run-begin',   id       => io.emit('run:begin',   getRun(id, false)));
  manager.on('run-end',     id       => io.emit('run:end',     getRun(id, false)));
  manager.on('run-deleted', id       => io.emit('run:deleted', { id }));
  manager.on('run-log',    (id, log) => io.emit('run:log',     { id, log }));

  const newSession = socket => {

    for(const id of manager.listRuns()) {
      const { logs, ... run } = getRun(id);

      // TODO: 'run-created' event but not with created status
      socket.emit('run:created', run);

      for(const log of logs) {
        socket.emit('run:log', { id, log });
      }
    }
  };

  io.on('connection', newSession);
};

exports.close = () => {};
