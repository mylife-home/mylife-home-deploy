'use strict';

const fs      = require('fs-extra');
const vfs     = require('../vfs');
const utils   = require('../tasks-utils');

exports.metadata = {
  description : 'setup core components file',
  parameters  : [
    { name : 'file', description: 'file name to import', type: 'string' }
  ]
};

exports.execute = async (context, parameters) => {
  const { file } = parameters;
  const log      = utils.createLogger(context, 'image:core-components');
  const fullName = utils.absolutePath(file);
  log.info(`import '${fullName}' as image core components`);

  const content = await fs.readFile(fullName, 'utf8');
  vfs.mkdirp(context.root, [ 'mylife-home' ]);
  vfs.writeText(context.root, [ 'mylife-home', 'mylife-home-core-components.json' ], content);
};