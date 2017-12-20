'use strict';

const fs           = require('fs-extra');
const path         = require('path');
const EventEmitter = require('events');
const Recipe       = require('./recipe');

let directory;

const runDeleteTimeout = 10 * 60 * 1000; // 10 mins

class Manager extends EventEmitter {

  static setDataDirectory(dir) {
    Recipe.setDataDirectory(dir);
    directory = dir;
  }

  constructor() {
    super();
    this._runIdCounter = 0;
    this._runs = new Map();
    this._closing = false;
  }

  createRecipe(name, content) {
    fs.ensureDirSync(directory);

    const fullname = path.join(directory, name + '.json');
    const exists = fs.existsSync(fullname);
    fs.writeFileSync(fullname, JSON.stringify(content));

    this.emit(exists ? 'recipe-updated' : 'recipe-created', name);
  }

  deleteRecipe(name) {
    fs.ensureDirSync(directory);

    const fullname = path.join(directory, name + '.json');
    if(!fs.existsSync(fullname)) {
      return;
    }

    fs.unlinkSync(fullname);
    this.emit('recipe-deleted', name);
  }

  listRecipes() {
    fs.ensureDirSync(directory);

    return fs.readdirSync(directory).map(file => path.parse(file).name);
  }

  getRecipe(name) {
    fs.ensureDirSync(directory);

    const fullname = path.join(directory, name + '.json');
    if(!fs.existsSync(fullname)) {
      return;
    }

    return JSON.parse(fs.readFileSync(fullname, 'utf8'));
  }

  startRecipe(name) {
    if(this._closing) {
      throw new Error('Cannot start recipe while closing manager');
    }

    let runId;
    this.once('run-begin', id => { runId = id; });
    this.runPromise(name);
    return runId;
  }

  async close() {
    this._closing = true;

    // wait pending runs
    let pendings = Array.from(this._runs.values()).filter(run => run.status === 'running').length;
    if(pendings) {
      await new Promise(resolve => this.on('run-end', () => (!--pendings && resolve())));
    }

    // do not wait delete timeout
    for(const run of Array.from(this._runs.values())) {
      clearTimeout(run._deleteTimeout);
      this._runs.delete(run.id);
    }
  }

  async runRecipe(name) {
    if(this._closing) {
      throw new Error('Cannot start recipe while closing manager');
    }

    const run = {
      id         : ++this._runIdCounter,
      recipeName : name,
      logs       : [],
      status     : 'created'
    };

    const logger = (category, severity, message) => {
      const log = { category, severity, message };
      run.logs.push(log);
      this.emit('run-log', run.id, log);
    };

    this._runs.set(run.id, run);
    this.emit('run-created', run.id, run.recipeName);

    run.status = 'running';
    this.emit('run-begin', run.id);

    try {

      const recipe = new Recipe(name);
      const context = { logger };

      await recipe.execute(context);

    } catch(err) {
      run.err = err;
    }

    run.status = 'ended';
    this.emit('run-end', run.id, run.err);

    run._deleteTimeout = setTimeout(() => {
      this.emit('run-delete', run.id);
      this._runs.delete(run.id);
    }, runDeleteTimeout);
  }

  listRuns() {
    return Array.from(this._runs.values());
  }

  getRun(runId) {
    return this._runs.get(runId);
  }
}

module.exports = Manager;