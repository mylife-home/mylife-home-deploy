'use strict';

const utils = require('../tasks-utils');

exports.metadata = {
  description : 'reset variables',
  parameters  : []
};

exports.execute = async (context/*, parameters*/) => {
  const log = utils.createLogger(context, 'variables:reset');
  log.info('image reset');
  context.variables = null;
};