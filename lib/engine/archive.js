'use strict';

const tar = require('tar-stream');
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
    buffers.push(chunk);
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

function apipe(source, dest) {
  return new Promise((resolve, reject) => {
    const ended = once(err => (err ? reject(err) : resolve()));
    source.once('error', ended);
    dest.once('error', ended);
    dest.once('finish', ended);

    source.pipe(dest);
  });
}

// extract buffer into directory
exports.extract = async (buffer, directory) => {
  const extract = tar.extract();

  extract.on('entry', function(header, stream, next) {
    console.log(header);
    // header is the tar header
    // stream is the content body (might be an empty stream)
    // call next when you are done with this entry

    stream.on('end', function() {
      next(); // ready for next entry
    })

    stream.resume(); // just auto drain the stream
  });

  await apipe(new BufferReader(buffer), extract);
};

// pack directory and returns buffer
exports.pack = async (directory) => {

};
