'use strict';

const { expect }          = require('chai');
const tasks               = require('../../lib/engine/tasks');
const vfs                 = require('../../lib/engine/vfs');
const {
  formatStructure,
  expectConfigContent
} = require('./utils');

const source = '/Users/vincent/Downloads/rpi-devel-base.tar.gz';

let cachedContext;

async function initContext() {
  if(cachedContext) {
    return cachedContext;
  }

  const context = {};
  await tasks.ImageInit.execute(context, {
    baseImage : source,
    rootPath  :'mmcblk0p1'
  });
  cachedContext = context;
  return context;
}

describe('Tasks', () => {

  describe('ImageInit', () => {
    it('Should execute properly', async () => {
      const context = await initContext();

      expect(formatStructure(context.vfs)).to.deep.equal(require('./content/archive-base'));
      expect(formatStructure(context.config)).to.deep.equal(require('./content/archive-config'));
    });
  });

  describe('ImagePack', () => {
    it('Should execute properly', async () => {
      const context = await initContext();

      await tasks.ImagePack.execute(context, {});

      expect(context.image).to.be.an.instanceof(Buffer);
      expect(context.image.length).to.equal(74553888);
    });
  });

  describe('ConfigHostname', () => {
    it('Should execute properly', async () => {
      const context  = await initContext();
      const hostname = 'test-host';

      await tasks.ConfigHostname.execute(context, {
        hostname
      });

      expectConfigContent(context, [ 'etc', 'hostname' ]);
      expectConfigContent(context, [ 'etc', 'network', 'interfaces' ]);
      expectConfigContent(context, [ 'etc', 'hosts' ]);
    });
  })
});
