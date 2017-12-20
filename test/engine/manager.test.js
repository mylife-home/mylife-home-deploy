'use strict';

const { expect } = require('chai');
const fs         = require('fs-extra');
const Manager    = require('../../lib/engine/manager');

class ManagerEvents {

  constructor(manager) {
    this.manager   = manager;
    this.listeners = {};
    this.events    = [];

    [
      'recipe-updated',
      'recipe-created',
      'recipe-deleted',
      'run-log',
      'run-created',
      'run-begin',
      'run-end',
      'run-delete'
    ].forEach(name => this.createListener(name));
  }

  close() {
    for(const [name, listener] of Object.entries(this.listeners)) {
      this.manager.removeListener(name, listener);
    }
  }

  createListener(name) {
    const listener = (...args) => this.events.push({ name, args });
    this.listeners[name] = listener;
    this.manager.on(name, listener);
  }
}

async function eventsScope(manager, cb) {
  const me = new ManagerEvents(manager);
  await cb();
  me.close();
  return me.events;
}

describe('Manager', () => {

  beforeEach(dataDirInit);
  afterEach(dataDirDestroy);

  it('Should create and retrieve a simple recipe', async () => {
    const manager = new Manager('recipe');
    const events = await eventsScope(manager, async () => {
      manager.createRecipe('recipe', [{ type: 'task', name: 'variables-set', parameters: { name: 'variable1', value: 'value1' } }]);
    });

    expect(manager.getRecipe('recipe')).to.deep.equal([{ type: 'task', name: 'variables-set', parameters: { name: 'variable1', value: 'value1' } }]);
    expect(events).to.deep.equal([ { name: 'recipe-created', args: [ 'recipe' ] } ]);
  });

  it('Should delete a simple recipe', async () => {
    const manager = new Manager('recipe');
    manager.createRecipe('recipe', [{ type: 'task', name: 'variables-set', parameters: { name: 'variable1', value: 'value1' } }]);
    manager.deleteRecipe('recipe');

    expect(manager.listRecipes()).to.deep.equal([]);
  });

  it('Should update a simple recipe', async () => {
    const manager = new Manager('recipe');
    manager.createRecipe('recipe', [{ type: 'task', name: 'variables-set', parameters: { name: 'variable1', value: 'value1' } }]);
    manager.createRecipe('recipe', [{ type: 'task', name: 'variables-set', parameters: { name: 'variable2', value: 'value2' } }]);

    expect(manager.getRecipe('recipe')).to.deep.equal([{ type: 'task', name: 'variables-set', parameters: { name: 'variable2', value: 'value2' } }]);
  });

  it('Should list recipes', async () => {
    const manager = new Manager('recipe');
    manager.createRecipe('recipe1', [{ type: 'task', name: 'variables-set', parameters: { name: 'variable1', value: 'value1' } }]);
    manager.createRecipe('recipe2', [{ type: 'task', name: 'variables-set', parameters: { name: 'variable2', value: 'value2' } }]);

    expect(manager.listRecipes()).to.deep.equal([ 'recipe1', 'recipe2' ]);
  });

  it('Should execute a simple recipe', async () => {
    const manager = new Manager('recipe');
    manager.createRecipe('recipe', [
      { type: 'task', name: 'variables-set', parameters: { name: 'variable1', value: 'value1' } },
      { type: 'task', name: 'variables-set', parameters: { name: 'variable2', value: 'value2' } }
    ]);

    manager.startRecipe('recipe');
    // wait for end, then show run
    // TODO
  });
});

const dataDir = '/tmp/mylife-home-deploy-test-recipe';

async function dataDirInit() {
  await fs.ensureDir(dataDir);
  Manager.setDataDirectory(dataDir);
}

async function dataDirDestroy() {
  await fs.remove(dataDir);
}
