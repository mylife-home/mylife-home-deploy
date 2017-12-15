'use strict';

const { expect }          = require('chai');
const tasks               = require('../../lib/engine/tasks');
const vfs                 = require('../../lib/engine/vfs');
const {
  formatStructure,
  expectConfigContent,
  expectConfigSymlink,
  printLines
} = require('./utils');

const source = '/Users/vincent/Downloads/rpi-devel-base.tar.gz';

let cachedRoot;

async function initContext(options = {}) {
  if(!options.nocache && cachedRoot) {
    return { root: cachedRoot };
  }

  const context = {};
  await tasks.ImageImport.execute(context, {
    archiveName : source,
    rootPath    : 'mmcblk0p1'
  });
  !options.nocache && (cachedRoot = context.root);
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
    it('Should execute properly', async () => {
      const context = await initContext({ nocache : true });
      await tasks.ConfigInit.execute(context, {});
      await tasks.ConfigPackage.execute(context, { name : 'nodejs' });
      await tasks.ImageCache.execute(context, {});

      const cache = vfs.path(context.root, [ 'cache' ]);
      const list = cache.list().map(f => ({ name : f.name, size : f.content.length }));

      expect(list).to.deep.equal([
        { name : 'alpine-base-3.7.0-r0.c85192e9.apk',            size : 1608    },
        { name : 'alpine-baselayout-3.0.5-r2.b682d9c3.apk',      size : 26065   },
        { name : 'busybox-1.27.2-r7.9edc42c7.apk',               size : 535467  },
        { name : 'musl-1.1.18-r2.ed2b9653.apk',                  size : 348641  },
        { name : 'alpine-conf-3.7.0-r0.2d924f50.apk',            size : 47930   },
        { name : 'openrc-0.24.1-r4.ae23d246.apk',                size : 322975  },
        { name : 'apk-tools-2.8.1-r2.3f19ee6a.apk',              size : 94683   },
        { name : 'libressl2.6-libcrypto-2.6.3-r0.7a7b0dd1.apk',  size : 734636  },
        { name : 'libressl2.6-libssl-2.6.3-r0.782efdc0.apk',     size : 115776  },
        { name : 'zlib-1.2.11-r1.cfdd0682.apk',                  size : 48558   },
        { name : 'busybox-suid-1.27.2-r7.9bb26640.apk',          size : 3542    },
        { name : 'busybox-initscripts-3.1-r2.1bfc3445.apk',      size : 8778    },
        { name : 'musl-utils-1.1.18-r2.6c7642c3.apk',            size : 31125   },
        { name : 'scanelf-1.2.2-r1.dcee8d8b.apk',                size : 38310   },
        { name : 'chrony-3.2-r1.379b6c3a.apk',                   size : 128112  },
        { name : 'openssh-7.5_p1-r7.1877a085.apk',               size : 135775  },
        { name : 'openssh-client-7.5_p1-r7.e3239860.apk',        size : 959155  },
        { name : 'openssh-keygen-7.5_p1-r7.787804f1.apk',        size : 160961  },
        { name : 'openssh-sftp-server-7.5_p1-r7.f8be6749.apk',   size : 35861   },
        { name : 'openssh-server-7.5_p1-r7.13bb46c6.apk',        size : 289552  },
        { name : 'openssh-server-common-7.5_p1-r7.8e7b5800.apk', size : 4369    },
        { name : 'nodejs-8.9.3-r0.1b89218a.apk',                 size : 7134025 },
        { name : 'ca-certificates-20171114-r0.4f03a76b.apk',     size : 178087  },
        { name : 'nodejs-npm-8.9.3-r0.59d2ece8.apk',             size : 5230012 },
        { name : 'c-ares-1.13.0-r0.5fdee948.apk',                size : 31753   },
        { name : 'libcrypto1.0-1.0.2n-r0.8e396cdb.apk',          size : 711959  },
        { name : 'libgcc-6.4.0-r5.ba3b8aee.apk',                 size : 18328   },
        { name : 'http-parser-2.7.1-r1.a624a351.apk',            size : 14557   },
        { name : 'libssl1.0-1.0.2n-r0.57ecdeb2.apk',             size : 163988  },
        { name : 'libstdc++-6.4.0-r5.789bae2e.apk',              size : 353573  },
        { name : 'libuv-1.17.0-r0.27fbd29b.apk',                 size : 60003   },
        { name : 'APKINDEX.70c88391.tar.gz',                     size : 762705  }
      ]);
    });
  });

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
});
