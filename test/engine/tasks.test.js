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

      console.log(list);
/*
[ { name: 'alpine-base',
    version: '3.7.0-r0',
    repo: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main/armhf/' },
  { name: 'alpine-baselayout',
    version: '3.0.5-r2',
    repo: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main/armhf/' },
  { name: 'busybox',
    version: '1.27.2-r7',
    repo: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main/armhf/' },
  { name: 'musl',
    version: '1.1.18-r2',
    repo: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main/armhf/' },
  { name: 'alpine-conf',
    version: '3.7.0-r0',
    repo: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main/armhf/' },
  { name: 'openrc',
    version: '0.24.1-r4',
    repo: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main/armhf/' },
  { name: 'apk-tools',
    version: '2.8.1-r2',
    repo: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main/armhf/' },
  { name: 'libressl2.6-libcrypto',
    version: '2.6.3-r0',
    repo: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main/armhf/' },
  { name: 'libressl2.6-libssl',
    version: '2.6.3-r0',
    repo: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main/armhf/' },
  { name: 'zlib',
    version: '1.2.11-r1',
    repo: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main/armhf/' },
  { name: 'busybox-suid',
    version: '1.27.2-r7',
    repo: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main/armhf/' },
  { name: 'busybox-initscripts',
    version: '3.1-r2',
    repo: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main/armhf/' },
  { name: 'libc-utils', version: '0.7.1-r0', repo: '/apks/armhf/' },
  { name: 'musl-utils',
    version: '1.1.18-r2',
    repo: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main/armhf/' },
  { name: 'scanelf',
    version: '1.2.2-r1',
    repo: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main/armhf/' },
  { name: 'alpine-keys', version: '2.1-r1', repo: '/apks/armhf/' },
  { name: 'chrony',
    version: '3.2-r1',
    repo: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main/armhf/' },
  { name: 'libcap', version: '2.25-r1', repo: '/apks/armhf/' },
  { name: 'openssh',
    version: '7.5_p1-r7',
    repo: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main/armhf/' },
  { name: 'openssh-client',
    version: '7.5_p1-r7',
    repo: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main/armhf/' },
  { name: 'openssh-keygen',
    version: '7.5_p1-r7',
    repo: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main/armhf/' },
  { name: 'openssh-sftp-server',
    version: '7.5_p1-r7',
    repo: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main/armhf/' },
  { name: 'openssh-server',
    version: '7.5_p1-r7',
    repo: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main/armhf/' },
  { name: 'openssh-server-common',
    version: '7.5_p1-r7',
    repo: 'http://dl-cdn.alpinelinux.org/alpine/v3.7/main/armhf/' } ]
*/
      // TODO: expect
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
