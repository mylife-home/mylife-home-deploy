'use strict';

const fs          = require('fs');
const path        = require('path');
const directories = require('../directories');
const server      = require('../server');

exports.init = (app, io) => {

  const manager = server.getManager();
  const pinList = createPinList(manager.listRecipes());

  manager.on('recipe-created', name => io.emit('recipe:created', { name, ... manager.getRecipe(name) }));
  manager.on('recipe-updated', name => io.emit('recipe:updated', { name, ... manager.getRecipe(name) }));
  manager.on('recipe-deleted', name => io.emit('recipe:deleted', { name }));

  const pinRecipe = name => {
    if(!pinList.pin(name)) {
      return;
    }

    io.emit('recipe:pinned', ({ name }));
  };

  const unpinRecipe = name => {
    if(!pinList.unpin(name)) {
      return;
    }

    io.emit('recipe:unpinned', ({ name }));
  };

  const newSession = socket => {

    socket.on('recipe:create', ({ name, ... recipe }) => manager.createRecipe(name, recipe));
    socket.on('recipe:delete', ({ name             }) => { manager.deleteRecipe(name); pinList.unpin(name); });
    socket.on('recipe:start',  ({ name             }) => manager.startRecipe(name));
    socket.on('recipe:pin',    ({ name             }) => pinRecipe(name));
    socket.on('recipe:unpin',  ({ name             }) => unpinRecipe(name));

    for(const name of manager.listRecipes()) {
      socket.emit('recipe:created', { name, ... manager.getRecipe(name) });
      pinList.isPinned(name) && socket.emit('recipe:pinned', { name });
    }
  };

  io.on('connection', newSession);
};

exports.close = () => {};

function createPinList(recipes) {

  const file = path.join(directories.base(), 'pinned-recipes.json');

  const list = new Set();
  if(fs.existsSync(file)) {
    const arr = JSON.parse(fs.readFileSync(file, 'utf8'));
    const recipesSet = new Set(recipes);
    for(const name of arr) {
      if(recipesSet.has(name)) {
        list.add(name);
      }
    }
  }

  const save = () => fs.writeFileSync(file, JSON.stringify(Array.from(list)));

  return {
    list : () => Array.from(list),

    isPinned : name => list.has(name),

    pin : name => {
      if(list.has(name)) {
        return false;
      }
      list.add(name);
      save();
      return true;
    },

    unpin : name => {
      if(!list.has(name)) {
        return false;
      }
      list.delete(name);
      save();
      return true;
    }
  };
}

