'use strict';

const server = require('../server');

exports.init = io => {

  const manager = server.getManager();

  manager.on('recipe-created', name => io.emit('recipe:created', { name, ... manager.getRecipe(name) }));
  manager.on('recipe-updated', name => io.emit('recipe:updated', { name, ... manager.getRecipe(name) }));
  manager.on('recipe-deleted', name => io.emit('recipe:deleted', { name }));

  const newSession = socket => {

    socket.on('recipe:create', ({ name, ... recipe }) => manager.createRecipe(name, recipe));
    socket.on('recipe:delete', ({ name             }) => manager.deleteRecipe(name));
    socket.on('recipe:start',  ({ name             }) => manager.startRecipe(name));

    for(const name of manager.listRecipes()) {
      socket.emit('recipe:created', { name, ... manager.getRecipe(name) });
    }
  };

  io.on('connection', newSession);
};

