'use strict';

const fs  = require('fs-extra');
const vfs = require('../vfs');
const apk = require('../apk');

exports.metadata = {
  description : 'setup package cache of the image, from /etc/apk/repositories and /etc/apk/world in config (equivalent of apk cache sync in some way)',
  parameters  : []
};

function readConfigFileLines(context, nodes) {
  const content = vfs.readText(context.config, nodes);
  return content.split('\n').filter(line => line).map(line => line.trim());
}

exports.execute = async (context, config) => {
  let repositories = readConfigFileLines(context, [ 'etc', 'apk', 'repositories' ]);
  let packages     = readConfigFileLines(context, [ 'etc', 'apk', 'world' ]);

  // filter out comments and local path (might cause to add packages that already exists in the local apk repo :/ )
  repositories = repositories.filter(rep => rep[0] !== '#' );

  // filter out meta packages
  packages = packages.filter(pack => pack[0] !== '.');

  const database = new apk.Database();
  for(const repo of repositories) {

    const localPrefix = '/media/mmcblk0p1';
    if(repo.startsWith(localPrefix)) {
      // local repo
      await database.addLocalRepository(context.root, repo.substring(localPrefix.length));
      continue;
    }

    await database.addRepository(repo);
  }

  database.index();

  const installList = new apk.InstallList(database);
  for(const pack of packages) {
    installList.addPackage(pack);
  }

  const cacheDirectory = vfs.path(context.root, [ 'cache' ]);
  cacheDirectory.clear();

  await installList.download(cacheDirectory);
  installList.dumpIndexes(cacheDirectory);
  // hash = sha1 of line in /etc/apk/repososiry, eg: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main'
  // TODO: APKINDEX
};
