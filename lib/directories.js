'use strict';

const path = require('path');

let files;
let recipes;

exports.configure = dataDirectory => {

  const baseDirectory = path.resolve(__dirname, '..', dataDirectory);

  files   = path.join(baseDirectory, 'files');
  recipes = path.join(baseDirectory, 'recipes');
};

exports.files = () => files;
exports.recipes = () => recipes;
