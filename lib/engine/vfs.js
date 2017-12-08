'use strict';

const validation = {
  positiveOrZeroInteger : val => (Integer.isInteger(val) && val >= 0),
  string                : val => (typeof val === 'string'),
  date                  : val => (val instanceof Date && !IsNaN(val)),
  buffer                : val => (val instanceof Buffer)
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

class Node {

  constructor() {
    if (this.constructor === Node) {
      throw new Error('Cannot instantiate Node');
    }

    defineProperty(this, 'uid',  0, validation.positiveOrZeroInteger);
    defineProperty(this, 'gid',  0, validation.positiveOrZeroInteger);
    defineProperty(this, 'mode', 0, validation.positiveOrZeroInteger);
    defineProperty(this, 'name', '', validation.string);
    defineProperty(this, 'atime', new Date(), validation.date);
    defineProperty(this, 'mtime', new Date(), validation.date);
    defineProperty(this, 'ctime', new Date(), validation.date);
  }
};

class Symlink extends Node {

  constructor() {
    super();

    defineProperty(this, 'target', '', validation.string);

    Object.freeze(this);
  }
}

class Directory extends Node {

  constructor() {
    super();

    const nodes = new Set();

    this.add = node => {
      if(!(node instanceof Node)) {
        throw new Error(`cannot add node '${node}'`);
      }
      nodes.add(node);
    }

    this.delete = node => nodes.delete(node);
    this.list   = () => Array.from(nodes);
    this.clear  = () => nodes.clear();

    Object.freeze(this);
  }
};

class File extends Node {

  constructor() {
    super();

    defineProperty(this, 'content', Buffer.alloc(0), validation.buffer);

    Object.freeze(this);
  }
};

exports.Symlink   = Symlink;
exports.Directory = Directory;
exports.File      = File;