'use strict';

exports.metadata = [
  { name : baseImage, description: 'base image name', type: 'string', default: 'rpi-devel-base.tar.gz' },
  { name : rootPath, description: 'path of the root fs inside the base image', type: 'string', default: 'mmcblk0p1' }
];

exports.execute = async (context, config) => {
  // set context.vfs
  // set context.config (= extract apkovl, and set its content to Buffer.alloc(0))
}