'use strict';

const zlib = require('zlib');
const path = require('path');
const tar  = require('tar-stream');
const vfs  = require('./vfs');
const { Readable, Writable } = require('stream');

class BufferReader extends Readable {
  constructor(buffer) {
    super();
    this.buffer = buffer;
  }

  _read() {
    this.push(this.buffer);
    this.push(null);
  }
}

class BufferWriter extends Writable {
  constructor() {
    super();
    this.buffers = [];
  }

  _write(chunk, encoding, callback) {
    this.buffers.push(chunk);
    callback();
  }

  _final(callback) {
    this.buffer = Buffer.concat(this.buffers);
    this.buffers = null;
    callback();
  }

  getBuffer() {
    return this.buffer;
  }
}

function once(fn) {
  const newFn = (...args) => {
    if (newFn.called) { return; }
    newFn.called = true;
    return fn(...args);
  };
  return newFn;
};

function apipe(...streams) {
  return new Promise((resolve, reject) => {
    const ended = once(err => (err ? reject(err) : resolve()));

    streams[streams.length - 1].once('finish', ended);
    for(let i=0; i<streams.length; ++i) {
      streams[i].once('error', ended);
      if(i > 0) {
        streams[i - 1].pipe(streams[i]);
      }
    }
  });
}

// extract buffer into directory
exports.extract = async (buffer, directory, options = {}) => {
  const extract = tar.extract();
  const { baseDirectory } = options;

  extract.on('entry', (header, stream, next) => {
    let name = header.name;
    // find directory this item belongs to and its name
    name = path.relative(baseDirectory || '', name);
    const { dir, base } = path.parse(name);
    let vdir = directory;
    dir && dir.split('/').forEach(node => vdir = vdir.get(node));

    switch(header.type) {

      case 'directory':
        extractDirectory(vdir, base, header);
        // empty stream
        stream.on('end', next);
        stream.resume();
        break;

      case 'file':
        extractFile(vdir, base, header, stream, next);
        break;

      default:
        return next(new Error(`Unknown entry type : ${header.type}`))
    }
  });

  await apipe(new BufferReader(buffer), zlib.createGunzip(), extract);
};

function headerToNode(header, node) {
  node.mode  = header.mode;
  node.uid   = header.uid;
  node.gid   = header.gid;
  node.mtime = typeof header.mtime === 'undefined' ? null : header.mtime;
  node.atime = typeof header.atime === 'undefined' ? null : header.atime;
  node.ctime = typeof header.ctime === 'undefined' ? null : header.ctime;
}

function extractDirectory(vdir, name, header) {
  const directory = new vfs.Directory();
  directory.name = name;
  headerToNode(header, directory);
  vdir.add(directory);
}

function extractFile(vdir, name, header, stream, next) {

  const file = new vfs.File();
  file.name = name;
  headerToNode(header, file);
  vdir.add(file);

  const bw = new BufferWriter();
  bw.once('finish', () => {
    file.content = bw.getBuffer();
    next();
  });
  stream.pipe(bw);
}

// pack directory and returns buffer
exports.pack = async (directory, options = {}) => {

};
