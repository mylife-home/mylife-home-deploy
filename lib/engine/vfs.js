'use strict';

const validation = {
  positiveOrZeroInteger : val => (Number.isInteger(val) && val >= 0),
  string                : val => (typeof val === 'string'),
  dateOrNull            : val => (val === null || (val instanceof Date && !isNaN(val))),
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
    defineProperty(this, 'atime', null, validation.dateOrNull);
    defineProperty(this, 'mtime', null, validation.dateOrNull);
    defineProperty(this, 'ctime', null, validation.dateOrNull);
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

    const nodes = new Map();

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