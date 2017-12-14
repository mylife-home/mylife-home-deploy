'use strict';

const { expect }          = require('chai');
const tasks               = require('../../lib/engine/tasks');
const vfs                 = require('../../lib/engine/vfs');
const {
  formatStructure,
  expectConfigContent,
  expectConfigSymlink
} = require('./utils');

const source = '/Users/vincent/Downloads/rpi-devel-base.tar.gz';

let cachedRoot;

async function initContext() {
  if(cachedRoot) {
    return { root: cachedRoot };
  }

  const context = {};
  await tasks.ImageImport.execute(context, {
    archiveName : source,
    rootPath    : 'mmcblk0p1'
  });
  cachedRoot = context.root;
  return context;
}

describe('Tasks', () => {

  describe('ImageImport', () => {
    it('Should execute properly', async () => {
      const context = await initContext();

      expect(formatStructure(context.root)).to.deep.equal(require('./content/archive-base'));
    });
  });

  describe('ImagePack', () => {
    it('Should execute properly', async () => {
      const context = await initContext();
      await tasks.ConfigInit.execute(context, {});
      await tasks.ImagePack.execute(context, {});

      expect(context.image).to.be.an.instanceof(Buffer);
      expect(context.image.length).to.equal(74553888);
    });
  });

  describe('ImageRemove', () => {
    it('Should execute properly', async () => {
      const context = await initContext();
      await tasks.ImageRemove.execute(context, { path: '/apks/armhf/APKINDEX.tar.gz' });

      expect(formatStructure(context.root)).to.deep.equal(require('./content/archive-base'));
    });
  });

  // ImageCache

  // ImageInstall

  describe('ConfigInit', () => {
    it('Should execute properly', async () => {
      const context = await initContext();
      await tasks.ConfigInit.execute(context, {});

      expect(formatStructure(context.root)).to.deep.equal(require('./content/archive-base'));
      expect(formatStructure(context.config)).to.deep.equal(require('./content/archive-config'));
    });
  });

  describe('ConfigHostname', () => {
    it('Should execute properly', async () => {
      const hostname = 'test-host';
      const context  = await initContext();
      await tasks.ConfigInit.execute(context, {});

      await tasks.ConfigHostname.execute(context, {
        hostname
      });

      expectConfigContent(context, [ 'etc', 'hostname' ]);
      expectConfigContent(context, [ 'etc', 'network', 'interfaces' ]);
      expectConfigContent(context, [ 'etc', 'hosts' ]);
    });
  });

  // ConfigWifi

  describe('ConfigDaemon', () => {
    it('Should execute properly', async () => {
      const runlevel = 'default';
      const name = 'test-daemon';
      const context  = await initContext();
      await tasks.ConfigInit.execute(context, {});

      await tasks.ConfigDaemon.execute(context, {
        name, runlevel
      });

      expectConfigSymlink(context, [ 'etc', 'runlevels', runlevel, name ], `/etc/init.d/${name}`);
    });
  });

  // ConfigPackage

  // ConfigCoreComponents
});
