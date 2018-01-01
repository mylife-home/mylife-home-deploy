'use strict';

const path = require('path');

let base;
let files;
let recipes;

exports.configure = dataDirectory => {

  base    = path.resolve(__dirname, '..', dataDirectory);
  files   = path.join(base, 'files');
  recipes = path.join(base, 'recipes');
};

exports.base    = () => base;
exports.files   = () => files;
exports.recipes = () => recipes;
