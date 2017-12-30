'use strict';

const server = require('../server');

exports.init = io => {

  const manager = server.getManager();

  const recipeData = name => ({ name, content : manager.getRecipe(name) });

  manager.on('recipe-created', name => io.emit('recipe:created', recipeData(name)));
  manager.on('recipe-updated', name => io.emit('recipe:updated', recipeData(name)));
  manager.on('recipe-deleted', name => io.emit('recipe:deleted', { name }));

  const newSession = socket => {

    socket.on('recipe:create', ({ name, content }) => manager.createRecipe(name, content));
    socket.on('recipe:delete', ({ name          }) => manager.deleteRecipe(name));
    socket.on('recipe:start',  ({ name          }) => manager.startRecipe(name));

    for(const name of manager.listRecipes()) {
      socket.emit('recipe:created', recipeData(name));
    }
  };

  io.on('connection', newSession);
};

