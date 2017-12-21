'use strict';

exports.ConfigInit           = require('./config-init');
exports.ConfigHostname       = require('./config-hostname');
exports.ConfigWifi           = require('./config-wifi');
exports.ConfigPackage        = require('./config-package');
exports.ConfigDaemon         = require('./config-daemon');
exports.ConfigCoreComponents = require('./config-core-components');

exports.ImageImport          = require('./image-import');
exports.ImageRemove          = require('./image-remove');
exports.ImageCache           = require('./image-cache');
exports.ImagePack            = require('./image-pack');
exports.ImageInstall         = require('./image-install');
exports.ImageExport          = require('./image-export');
exports.ImageReset           = require('./image-reset');

exports.VariablesSet         = require('./variables-set');
exports.VariablesReset       = require('./variables-reset');
