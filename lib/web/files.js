'use strict';

// use http api for upload/download else use socket

const fs          = require('fs');
const path        = require('path');
const multer      = require('multer');
const directories = require('../directories');

let watcher;
const list = new Map();

function fullname(name) {
  return path.join(directories.files(), name);
}

function fileInfo(name) {
  let stats;
  try {
    stats = fs.statSync(fullname(name));
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

exports.init = (app, io) => {

  // initial list
  for(const name of fs.readdirSync(directories.files())) {
    const info = fileInfo(name);
    if(!info) { continue; }
    list.set(name, info);
  }

  watcher = fs.watch(directories.files());

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

    socket.on('file:delete', ({ name }) => fs.unlinkSync(fullname(name)));

    for(const [ name, info ] of list) {
      socket.emit('file:created', { name, ...info });
    }
  };

  io.on('connection', newSession);

  app.get('/files/:name', (req, res) => {
    const { name } = req.params;
    res.download(fullname(name));
  });

  const uploader = multer({ storage: multer.diskStorage({
    destination : directories.files(),
    filename    : (req, file, cb) => cb(null, file.originalname)
  }) });

  app.post('/files', uploader.single('file'), (req, res) => {
    res.json({});
  });
};

exports.close = () => {
  watcher && watcher.close();
};