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

async function waitTaskEnd(manager, runId) {
  if(manager.getRun(runId).status === 'ended') {
    return;
  }

  return new Promise(resolve => {
    const listener = endRunId => {
      if(endRunId !== runId) {
        return;
      }

      manager.removeListener('run-end', listener);
      return resolve();
    };
    manager.on('run-end', listener);
  });
}

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
    const { result, events } = await managerScope(async manager => {
      manager.createRecipe('recipe', [
        { type: 'task', name: 'variables-set', parameters: { name: 'variable1', value: 'value1' } },
        { type: 'task', name: 'variables-set', parameters: { name: 'variable2', value: 'value2' } }
      ]);

      const runId = manager.startRecipe('recipe');

      await waitTaskEnd(manager, runId);

      return {
        runs : manager.listRuns(),
        run  : manager.getRun(runId)
      };
    });

    expect(result).to.deep.equal({
      runs : [ 1 ],
      run  : {
        id         : 1,
        recipeName : 'recipe',
        status     : 'ended',
        logs       : [
          { severity : 'info', category : 'recipe',        message : 'begin \'recipe\''   },
          { severity : 'info', category : 'variables:set', message : 'variable1 = value1' },
          { severity : 'info', category : 'variables:set', message : 'variable2 = value2' },
          { severity : 'info', category : 'recipe',        message : 'end \'recipe\''     }
        ]
      }
    });

    expect(events).to.deep.equal([
      { name: 'recipe-created', args: [ 'recipe' ] },
      { name: 'run-created',    args: [ 1, 'recipe' ] },
      { name: 'run-begin',      args: [ 1 ] },
      { name: 'run-log',        args: [ 1, { severity: 'info', category: 'recipe',        message: 'begin \'recipe\''   } ] },
      { name: 'run-log',        args: [ 1, { severity: 'info', category: 'variables:set', message: 'variable1 = value1' } ] },
      { name: 'run-log',        args: [ 1, { severity: 'info', category: 'variables:set', message: 'variable2 = value2' } ] },
      { name: 'run-log',        args: [ 1, { severity: 'info', category: 'recipe',        message: 'end \'recipe\''     } ] },
      { name: 'run-end',        args: [ 1 ] }
    ]);
  });

  it('Should execute a recipe with real async tasks', async () => {
    const { result } = await managerScope(async manager => {
      const source = '/Users/vincent/Downloads/rpi-devel-base.tar.gz';
      manager.createRecipe('recipe', [
        { type: 'task', name: 'image-import', parameters: { archiveName : source, rootPath : 'mmcblk0p1' } },
        { type: 'task', name: 'config-init', parameters: { } },
        { type: 'task', name: 'image-cache', parameters: { } }
      ]);

      const runId = manager.startRecipe('recipe');

      await waitTaskEnd(manager, runId);

      return manager.getRun(runId);
    });

    result.logs = result.logs.filter(it => it.severity !== 'debug');

    expect(result).to.deep.equal({
      id         : 1,
      recipeName : 'recipe',
      status     : 'ended',
      logs       : [
        { severity : 'info', category : 'recipe',       message: 'begin \'recipe\''                                                                                   },
        { severity : 'info', category : 'image:import', message: 'import \'/Users/vincent/Downloads/rpi-devel-base.tar.gz\' using root path \'mmcblk0p1\' into image' },
        { severity : 'info', category : 'config:init',  message: 'extract config from image file \'rpi-devel.apkovl.tar.gz\''                                         },
        { severity : 'info', category : 'image:cache',  message: 'setup image cache'                                                                                  },
        { severity : 'info', category : 'recipe',       message: 'end \'recipe\''                                                                                     }
      ]
    });
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
