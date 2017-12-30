'use strict';

const server = require('../server');

exports.init = io => {

  const manager = server.getManager();

  const runData = id => ({ id, content: manager.getRun(id, false) });

  manager.on('run-created', id           => io.emit('run:created', runData(id)));
  manager.on('run-begin',   id           => io.emit('run:begin',   runData(id)));
  manager.on('run-end',     id           => io.emit('run:end',     runData(id)));
  manager.on('run-deleted', id           => io.emit('run:deleted', { id }));
  manager.on('run-log',    (id, content) => io.emit('run:log',     { id, content }));

  const newSession = socket => {

    for(const id of manager.listRuns()) {
      const { logs, ... run } = manager.getRun(name);

      // TODO: 'run-created' event but not with created status
      socket.emit('run:created', { id, content : run });

      for(const log of logs) {
        socket.emit('run:log', { id, content : log });
      }
    }
  };

  io.on('connection', newSession);
};


