'use strict';

const path        = require('path');
const fs          = require('fs-extra');
const { expect }  = require('chai');
const express     = require('express');
const tasks       = require('../../lib/engine/tasks');
const vfs         = require('../../lib/engine/vfs');
const directories = require('../../lib/directories');
const {
  formatStructure,
  expectConfigContent,
  expectConfigSymlink,
  //printLines
} = require('./utils');

let cachedRoot;

const logger = (category, severity, message) => {
  process.env.VERBOSE === '1' && console.log(`${severity} : [${category}] ${message}`); // eslint-disable-line no-console
};

async function initContext(options = {}) {
  if(options.noload) {
    return { logger };
  }

  if(!options.nocache && cachedRoot) {
    return { logger, root: cachedRoot };
  }

  const context = { logger };
  await tasks.ImageImport.execute(context, {
    archiveName : 'rpi-devel-base.tar.gz',
    rootPath    : 'mmcblk0p1'
  });
  !options.nocache && (cachedRoot = context.root);
  return context;
}

describe('Tasks', () => {

  beforeEach(() => {
    directories.configure(path.resolve(__dirname, '../resources'));
  });

  describe('ImageImport', () => {
    it('Should execute properly', async () => {
      const context = await initContext();

      expect(formatStructure(context.root)).to.deep.equal(require('./content/archive-base'));
    });
  });

  describe('ImagePack', () => {
    it('Should execute properly', async () => {
      const context = await initContext({ nocache : true });
      await tasks.ConfigInit.execute(context, {});
      await tasks.ImagePack.execute(context, {});

      expect(context.image).to.be.an.instanceof(Buffer);
      expect(context.image.length).to.equal(74553888);
    });
  });

  describe('ImageRemove', () => {
    it('Should execute properly', async () => {
      const context = await initContext({ nocache : true });
      await tasks.ImageRemove.execute(context, { path: '/apks/armhf/APKINDEX.tar.gz' });

      const content = require('./content/archive-base').filter(c => c.name !== 'APKINDEX.tar.gz');
      expect(formatStructure(context.root)).to.deep.equal(content);
    });
  });

  describe('ImageCache', () => {
    let server;

    beforeEach(() => {
      const app = express();
      app.use(express.static(path.resolve(__dirname, '../resources/repository')));
      server = app.listen(4242);
    });

    afterEach(done => server.close(done));

    it('Should execute properly', async () => {
      const context = await initContext({ nocache : true });
      await tasks.ConfigInit.execute(context, {});
      await tasks.ConfigPackage.execute(context, { name : 'nodejs' });

      // use fake repo
      vfs.writeText(context.config, [ 'etc', 'apk', 'repositories' ], '/media/mmcblk0p1/apks\nhttp://localhost:4242');

      await tasks.ImageCache.execute(context, {});

      const cache = vfs.path(context.root, [ 'cache' ]);
      const list  = cache.list().map(f => ({ name : f.name, size : f.content.length }));

      expect(list).to.deep.equal(require('./content/cache'));
    });

    it('Should execute properly without cache directory', async () => {
      const context = await initContext({ nocache : true });
      await tasks.ConfigInit.execute(context, {});
      await tasks.ConfigPackage.execute(context, { name : 'nodejs' });
      await tasks.ImageRemove.execute(context, { path : '/cache' });

      // use fake repo
      vfs.writeText(context.config, [ 'etc', 'apk', 'repositories' ], '/media/mmcblk0p1/apks\nhttp://localhost:4242');

      await tasks.ImageCache.execute(context, {});

      const cache = vfs.path(context.root, [ 'cache' ]);
      const list  = cache.list().map(f => ({ name : f.name, size : f.content.length }));

      expect(list).to.deep.equal(require('./content/cache'));
    });
  });

  describe('ImageDeviceTreeOverlay', () => {
    it('Should execute properly', async () => {
      const context = await initContext({ nocache : true });
      await tasks.ImageDeviceTreeOverlay.execute(context, { content: 'test-overlay1' });
      await tasks.ImageDeviceTreeOverlay.execute(context, { content: 'test-overlay2' });

      const usercfg  = vfs.readText(context.root, [ 'usercfg.txt' ]);
      const expected = [ 'dtoverlay=test-overlay1', 'dtoverlay=test-overlay2' ].join('\n') + '\n';
      expect(usercfg).to.equal(expected);
    });
  });

  describe('ImageDeviceTreeParam', () => {
    it('Should execute properly', async () => {
      const context = await initContext({ nocache : true });
      await tasks.ImageDeviceTreeParam.execute(context, { content: 'test-param1' });
      await tasks.ImageDeviceTreeParam.execute(context, { content: 'test-param2' });

      const usercfg  = vfs.readText(context.root, [ 'usercfg.txt' ]);
      const expected = [ 'dtparam=test-param1', 'dtparam=test-param2' ].join('\n') + '\n';
      expect(usercfg).to.equal(expected);
    });
  });

  describe('ImageCmdlineAdd', () => {
    it('Should execute properly', async () => {
      const context = await initContext({ nocache : true });
      await tasks.ImageCmdlineAdd.execute(context, { content: 'test-param1' });

      expect(vfs.readText(context.root, [ 'cmdline.txt' ])).to.equal('modules=loop,squashfs,sd-mod,usb-storage quiet dwc_otg.lpm_enable=0 console=ttyAMA0,115200 console=tty1 test-param1\n');
    });
  });

  describe('ImageCmdlineRemove', () => {
    it('Should execute properly', async () => {
      const context = await initContext({ nocache : true });
      await tasks.ImageCmdlineAdd.execute(context, { content: 'test-param1' });
      await tasks.ImageCmdlineAdd.execute(context, { content: 'test-param2' });
      await tasks.ImageCmdlineAdd.execute(context, { content: 'test-param3' });
      await tasks.ImageCmdlineRemove.execute(context, { content: 'test-param1' });
      await tasks.ImageCmdlineRemove.execute(context, { content: 'test-param3' });

      expect(vfs.readText(context.root, [ 'cmdline.txt' ])).to.equal('modules=loop,squashfs,sd-mod,usb-storage quiet dwc_otg.lpm_enable=0 console=ttyAMA0,115200 console=tty1 test-param2\n');
    });
  });

  describe('ImageLs', () => {
    it('Should execute properly', async () => {
      const context = await initContext();
      await tasks.ImageLs.execute(context, { path: '/' });

      // TODO: expect logs ?
    });
  });

  // ImageInstall

  describe('ImageExport', () => {
    it('Should execute properly', async () => {
      const context = await initContext({ noload : true });
      const sourceContent = await fs.readFile(path.resolve(__dirname, '../resources/files/rpi-devel-base.tar.gz'));
      let destContent;
      context.image = sourceContent;

      const tmpDir = '/tmp/mylife-home-deploy-test-task-export';
      directories.configure(tmpDir);
      await fs.ensureDir(directories.files());
      try {
        await tasks.ImageExport.execute(context, { archiveName : 'image-export.tar.gz' });
        destContent = await fs.readFile(path.join(tmpDir, 'files/image-export.tar.gz'));
      } finally {
        await fs.remove(tmpDir);
      }
      expect(destContent).to.deep.equal(sourceContent);
    });
  });

  describe('ImageReset', () => {
    it('Should execute properly', async () => {
      const context = await initContext({ nocache : true });
      await tasks.ConfigInit.execute(context, {});
      await tasks.ImagePack.execute(context, {});
      await tasks.VariablesSet.execute(context, { name: 'variable', value: 'value' });
      await tasks.ImageReset.execute(context, {});

      expect(context.variables).to.deep.equal({ variable : 'value' });
      expect(context.root).to.be.null;
      expect(context.config).to.be.null;
      expect(context.image).to.be.null;
    });
  });

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

  describe('ConfigPackage', () => {
    it('Should execute properly', async () => {
      const name = 'test-package';
      const context  = await initContext();
      await tasks.ConfigInit.execute(context, {});

      await tasks.ConfigPackage.execute(context, {
        name
      });

      expectConfigContent(context, [ 'etc', 'apk', 'world' ]);
    });
  });

  // ConfigCoreComponents

  describe('ConfigLs', () => {
    it('Should execute properly', async () => {
      const context = await initContext();
      await tasks.ConfigInit.execute(context, {});
      await tasks.ConfigLs.execute(context, { path: '/' });

      // TODO: expect logs ?
    });
  });

  describe('VariablesSet', () => {
    it('Should execute properly', async () => {
      const context = await initContext({ noload: true });
      await tasks.VariablesSet.execute(context, { name: 'variable', value: 'value' });

      expect(context.variables).to.deep.equal({ variable : 'value' });
    });
  });

  describe('VariablesReset', () => {
    it('Should execute properly', async () => {
      const context = await initContext();
      await tasks.ConfigInit.execute(context, {});
      await tasks.ImagePack.execute(context, {});
      await tasks.VariablesSet.execute(context, { name: 'variable', value: 'value' });
      await tasks.VariablesReset.execute(context, {});


      expect(context.variables).to.be.null;
      expect(context.root).to.exist;
      expect(context.config).to.exist;
      expect(context.image).to.exist;
    });
  });
});
