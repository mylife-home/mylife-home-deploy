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

async function managerScope(cb) {
  const manager = new Manager();
  const me = new ManagerEvents(manager);
  const result = await cb(manager);
  me.close();
  await manager.close();
  return { result, events : me.events };
}

// TODO: scope manager ops and construction/close

describe('Manager', () => {

  beforeEach(dataDirInit);
  afterEach(dataDirDestroy);

  it('Should create and retrieve a simple recipe', async () => {
    const { result, events } = await managerScope(async manager => {
      manager.createRecipe('recipe', [{ type: 'task', name: 'variables-set', parameters: { name: 'variable1', value: 'value1' } }]);
      return manager.getRecipe('recipe');
    });

    expect(result).to.deep.equal([{ type: 'task', name: 'variables-set', parameters: { name: 'variable1', value: 'value1' } }]);
    expect(events).to.deep.equal([
      { name: 'recipe-created', args: [ 'recipe' ] }
    ]);
  });

  it('Should delete a simple recipe', async () => {
    const { result, events } = await managerScope(async manager => {
      manager.createRecipe('recipe', [{ type: 'task', name: 'variables-set', parameters: { name: 'variable1', value: 'value1' } }]);
      manager.deleteRecipe('recipe');
      return manager.listRecipes();
    });

    expect(result).to.deep.equal([]);
    expect(events).to.deep.equal([
      { name: 'recipe-created', args: [ 'recipe' ] },
      { name: 'recipe-deleted', args: [ 'recipe' ] }
    ]);
  });

  it('Should update a simple recipe', async () => {
    const { result, events } = await managerScope(async manager => {
      manager.createRecipe('recipe', [{ type: 'task', name: 'variables-set', parameters: { name: 'variable1', value: 'value1' } }]);
      manager.createRecipe('recipe', [{ type: 'task', name: 'variables-set', parameters: { name: 'variable2', value: 'value2' } }]);
      return manager.getRecipe('recipe');
    });

    expect(result).to.deep.equal([{ type: 'task', name: 'variables-set', parameters: { name: 'variable2', value: 'value2' } }]);
    expect(events).to.deep.equal([
      { name: 'recipe-created', args: [ 'recipe' ] },
      { name: 'recipe-updated', args: [ 'recipe' ] }
    ]);
  });

  it('Should list recipes', async () => {
    const { result, events } = await managerScope(async manager => {
      manager.createRecipe('recipe1', [{ type: 'task', name: 'variables-set', parameters: { name: 'variable1', value: 'value1' } }]);
      manager.createRecipe('recipe2', [{ type: 'task', name: 'variables-set', parameters: { name: 'variable2', value: 'value2' } }]);
      return manager.listRecipes();
    });

    expect(result).to.deep.equal([ 'recipe1', 'recipe2' ]);
    expect(events).to.deep.equal([
      { name: 'recipe-created', args: [ 'recipe1' ] },
      { name: 'recipe-created', args: [ 'recipe2' ] }
    ]);
  });

  it('Should execute a simple recipe', async () => {
    const manager = new Manager();
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
