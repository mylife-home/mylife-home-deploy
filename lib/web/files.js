'use strict';

// use http api for upload/download else use socket

const fs          = require('fs');
const path        = require('path');
const directories = require('../directories');

let watcher;
const list = new Map();

function fileInfo(name) {
  const fullname = path.join(directories.files(), name);
  let stats;

  try {
    stats = fs.statSync(fullname);
  } catch(err) {
    if(err.code === 'ENOENT') {
      return null; // no file
    }
    throw err;
  }

  // only handle regular files
  if(!stats.isFile()) {
    return null;
  }

  return {
    size      : stats.size,
    atime     : stats.atime,
    mtime     : stats.mtime,
    ctime     : stats.ctime,
    birthtime : stats.birthtime
  };
}

exports.init = io => {
  const dir = directories.files();

  // initial list
  for(const name of fs.readdirSync(dir)) {
    const info = fileInfo(name);
    if(!info) { continue; }
    list.set(name, info);
  }

  watcher = fs.watch(dir);

  watcher.on('change', (type, name) => {

    // type :
    // - rename = file deleted or created (or moved)
    // - change = file content updated

    const info = fileInfo(name);
    if(!info) {
      list.delete(name);
      io.emit('file:deleted', { name });
      return;
    }

    const existing = !!list.get(name);
    list.set(name, info);
    io.emit(existing ? 'file:updated' : 'file:created', { name, ...info });
  });

  const newSession = socket => {

    // TODO
    // file-upload
    // file-download

    socket.on('file:delete', ({ name }) => fs.unlinkSync(path.join(dir, name)));

    for(const [ name, info ] of list) {
      socket.emit('file:created', { name, ...info });
    }
  };

  io.on('connection', newSession);
};

exports.close = () => {
  watcher && watcher.close();
};