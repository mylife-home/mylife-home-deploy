'use strict';

const validation = {
  positiveOrZeroInteger : val => (Number.isInteger(val) && val >= 0),
  string                : val => (typeof val === 'string'),
  dateOrNull            : val => (val === null || (val instanceof Date && !isNaN(val))),
  buffer                : val => (val instanceof Buffer),
  boolean               : val => (typeof val === 'boolean')
};

const defineProperty = (object, name, initialValue, validator) => {

  let propertyValue = initialValue;

  Object.defineProperty(object, name, {
    enumerable: true,
    get : () => propertyValue,
    set : value => {
      if(validator && !validator(value)) {
        throw new Error(`Cannot set '${value}' into '${name}'`);
      }
      return propertyValue = value;
    }
  });
}

function finalize(object, options) {
  Object.freeze(object);

  if(!options) { return; }
  for(let key of Object.keys(object)) {
    if(options.hasOwnProperty(key)) {
      object[key] = options[key];
    }
  }
}

class Node {

  constructor() {
    if (this.constructor === Node) {
      throw new Error('Cannot instantiate Node');
    }

    defineProperty(this, 'uid',  0, validation.positiveOrZeroInteger);
    defineProperty(this, 'gid',  0, validation.positiveOrZeroInteger);
    defineProperty(this, 'mode', 0, validation.positiveOrZeroInteger);
    defineProperty(this, 'name', '', validation.string);
    defineProperty(this, 'atime', null, validation.dateOrNull);
    defineProperty(this, 'mtime', null, validation.dateOrNull);
    defineProperty(this, 'ctime', null, validation.dateOrNull);
  }
};

class Symlink extends Node {

  constructor(options) {
    super();

    defineProperty(this, 'target', '', validation.string);

    this.mode = 0o777;

    finalize(this, options);
  }
}

class Directory extends Node {

  constructor(options) {
    super();

    const nodes = new Map();

    defineProperty(this, 'missing', false, validation.boolean);

    this.add = node => {
      if(!(node instanceof Node)) {
        throw new Error(`cannot add node '${node}'`);
      }
      nodes.set(node.name, node);
    }

    this.delete = node => nodes.delete(node.name);
    this.list   = () => Array.from(nodes.values());
    this.clear  = () => nodes.clear();
    this.get    = name => nodes.get(name);

    this.mode = 0o755;

    finalize(this, options);
  }
};

class File extends Node {

  constructor(options) {
    super();

    defineProperty(this, 'content', Buffer.alloc(0), validation.buffer);

    this.mode = 0o644;

    finalize(this, options);
  }
};

exports.Symlink   = Symlink;
exports.Directory = Directory;
exports.File      = File;