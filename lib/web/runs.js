'use strict';

const server = require('../server');

exports.init = io => {

  const manager = server.getManager();

  manager.on('run-created', id       => io.emit('run:created', manager.getRun(id, false)));
  manager.on('run-begin',   id       => io.emit('run:begin',   manager.getRun(id, false)));
  manager.on('run-end',     id       => io.emit('run:end',     manager.getRun(id, false)));
  manager.on('run-deleted', id       => io.emit('run:deleted', { id }));
  manager.on('run-log',    (id, log) => io.emit('run:log',     { id, log }));

  const newSession = socket => {

    for(const id of manager.listRuns()) {
      const { logs, ... run } = manager.getRun(id);

      // TODO: 'run-created' event but not with created status
      socket.emit('run:created', run);

      for(const log of logs) {
        socket.emit('run:log', { id, log });
      }
    }
  };

  io.on('connection', newSession);
};


