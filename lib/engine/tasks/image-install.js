'use strict';

const path          = require('path');
const fs            = require('fs-extra');
const vfs           = require('../vfs');
const utils         = require('../tasks-utils');
const { SSHClient } = require('../ssh');

exports.metadata = {
  description : 'install the current root fs to the target host using SSH',
  parameters  : [
    { name : 'host', description : 'Target host', type: 'string' },
    { name : 'user', description : 'User to use on target host', type: 'string' },
    { name : 'keyFile', description : 'SSH key to log in', type: 'string' }
  ]
};

const pad = number => ((number < 10) ? ('0' + number) : number);

const printDate = date =>
  date.getFullYear() +
  pad(date.getMonth() + 1) +
  pad(date.getDate()) +
  '-' +
  pad(date.getHours()) +
  pad(date.getMinutes()) +
  pad(date.getSeconds());

async function uploadDirectory(client, log, sourceDirectory, destPath) {
  for(const node of sourceDirectory.list()) {

    const nodePath = path.join(destPath, node.name);

    if(node instanceof vfs.Directory) {
      log.debug(`create directory '${nodePath}'`);
      await client.sftp.mkdir(nodePath);
      await uploadDirectory(client, log, node, nodePath);
      continue;
    }

    if(node instanceof vfs.File) {
      log.debug(`upload file '${nodePath}' (size=${node.content.length})`);
      await client.sftp.writeFile(nodePath, node.content);
      continue;
    }

    throw new Error('Unhandled node type');
  }
}

exports.execute = async (context, parameters) => {
  const { host, user, keyFile } = parameters;
  const fullKeyFile = utils.absolutePath(keyFile);
  const log = utils.createLogger(context, 'image:install');
  const [ hostname, sport ] = host.split(':');
  const port = parseInt(sport) || 22;
  log.info(`install on '${hostname}:${port}' with user '${user}' using key file '${fullKeyFile}'`);

  const rootPath     = '/media/mmcblk0p1';
  const backupPath   = path.join(rootPath, `backup-${printDate(new Date())}`);
  const tmpDirectory = 'tmp-deploy';
  const tmpPath      = path.join(rootPath, tmpDirectory);
  const client     = new SSHClient();

  await client.connect({ host : hostname, port, username : user, privateKey : await fs.readFile(fullKeyFile) });

  const list = await client.sftp.readdir(rootPath);
  if(list.find(item => item.filename === tmpDirectory)) {
    throw new Error(`${tmpPath} already exists!`);
  }

  // remount rw
  await client.exec(`mount -o remount,rw ${rootPath}`);

  // upload files to /tmp-deploy
  await client.sftp.mkdir(tmpPath);
  await uploadDirectory(client, log, context.root, tmpPath);

  // move existing root to backup-{date}
  log.debug(`create directory '${backupPath}'`);
  await client.sftp.mkdir(backupPath);
  for(const item of list) {
    if(item.filename.startsWith('backup-')) {
      continue;
    }

    const oldPath = path.join(rootPath, item.filename);
    const newPath = path.join(backupPath, item.filename);
    log.debug(`move '${oldPath}' to '${newPath}'`);
    await client.sftp.rename(oldPath, newPath);
  }

  // move /tmp-deploy to new root
  for(const item of context.root.list()) {
    const oldPath = path.join(tmpPath, item.name);
    const newPath = path.join(rootPath, item.name);
    log.debug(`move '${oldPath}' to '${newPath}'`);
    await client.sftp.rename(oldPath, newPath);
  }
  await client.sftp.rmdir(tmpPath);

  // reboot
  //await client.exec('reboot');
};