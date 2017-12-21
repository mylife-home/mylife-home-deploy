'use strict';

const fs    = require('fs-extra');
const utils = require('../tasks-utils');

exports.metadata = {
  description : 'import the specified archive into the root fs of the image',
  parameters  : [
    { name : 'archiveName', description: 'archive name', type: 'string' }
  ]
};

exports.execute = async (context, parameters) => {
  const { archiveName } = parameters;
  const fullArchiveName = utils.absolutePath(archiveName);
  const log = utils.createLogger(context, 'image:export');
  log.info(`export '${fullArchiveName}'`);

  await fs.writeFile(fullArchiveName, context.image);
};