'use strict';

const utils = require('../tasks-utils')

exports.metadata = {
  description : 'add a package to be installed',
  parameters  : [
    { name : 'name', description: 'package name', type: 'string' }
  ]
};

exports.execute = async (context, config) => {
  const { name } = config;
  utils.configAddPackage(context, name);
}
