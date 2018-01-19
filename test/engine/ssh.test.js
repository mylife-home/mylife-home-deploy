'use strict';

const fs            = require('fs');
const path          = require('path');
const { expect }    = require('chai');
const vfs           = require('../../lib/engine/vfs');
const { SSHClient } = require('../../lib/engine/ssh');
const { SSHServer } = require('./ssh-server');

describe('SSH', () => {

  describe('Basic execution', () => {

    describe.skip('Client to real server', () => {

      const rootList = [ '.modloop', 'bin', 'dev', 'etc', 'home', 'lib', 'media', 'mnt', 'proc', 'root', 'run', 'sbin', 'srv', 'sys', 'tmp', 'usr', 'var' ];

      async function runClientRealServerTest(tester) {
        const privateKey = fs.readFileSync('/Users/vincent/Downloads/id_rsa');
        const client = new SSHClient();
        await client.connect({ host : 'rpi-devel', username : 'root', privateKey });
        try {
          await tester(client);
        } finally {
          client.end();
        }
      }

      it('Should properly execute command on remote host in real world', async () => runClientRealServerTest(async client => {
        expect(await client.exec('ls -a /')).to.equal([ '.', '..', ...rootList ].map(it => `${it}\n`).join(''));
      }));

      it('Should properly read sftp directory on remote host in real world', async () => runClientRealServerTest(async client => {
        const list = await client.sftpReaddir('/');
        expect(list.map(it => it.filename).sort()).to.deep.equal(rootList);
      }));

      it('Should combine exec and sftp in same session in real world', async () => runClientRealServerTest(async client => {
        await client.exec('ls -a /');
        await client.sftpReaddir('/');
        await client.exec('ls -a /');
        await client.sftpReaddir('/');
      }));
    });

    describe('Client to mocked server', () => {
      async function runClientMockedServerTest(rootfs, cmdhandler, tester) {
        const port = 8822;
        const server = new SSHServer({ port, rootfs, cmdhandler, hostKeys : [ fs.readFileSync(path.resolve(__dirname, 'content/id_rsa')) ] });
        const client = new SSHClient();
        await client.connect({ host : 'localhost', port, username : 'root', password : 'nothing' });
        try {
          await tester(client);
        } finally {
          client.end();
          server.close();
        }
      }

      const command = 'MyCmd';
      const commandResult = 'MyResult';

      function cmdHandler(cmd) {
        if(command !== cmd) {
          throw new Error('Unknown command');
        }
        return commandResult;
      }

      it('Should properly execute command on mocked server', async () => await runClientMockedServerTest(new vfs.Directory(), cmdHandler, async (client) => {
        expect(await client.exec(command)).to.equal(commandResult);
      }));

      it('Should fail to execute wrong command on mocked server', async () => await runClientMockedServerTest(new vfs.Directory(), cmdHandler, async (client) => {
        let err;
        try {
          await client.exec('wrong command');
        } catch(exc) {
          err = exc;
        }
        expect(err).to.match(/Error: Command has error output : 'Unknown command'/);
      }));

      it('Should properly use sftp to read directory on moched server', async () => {
        const rootfs = new vfs.Directory();
        const attrs = { uid : 5, gid : 6, atime : new Date(2000, 0, 1, 10, 30), mtime : new Date(2010, 5, 10, 10, 30) };

        rootfs.add(new vfs.Directory({ name : 'dir',   mode : 0o755, ...attrs }));
        rootfs.add(new vfs.File(     { name : 'file',  mode : 0o644, ...attrs, content : Buffer.alloc(10) }));
        rootfs.add(new vfs.Symlink(  { name : 'slink', mode : 0o777, ...attrs, target : './file' }));

        const eattrs = { ...attrs, atime : attrs.atime.valueOf() / 1000, mtime : attrs.mtime.valueOf() / 1000 };

        const expected = [{
          attrs    : { ...eattrs, size : 0, mode : 0o040755, permissions : 0o040755 },
          filename : 'dir',
          longname : 'drwxr-xr-x 1 5        6                   0 Jun 10 10:30 dir'
        }, {
          attrs    : { ...eattrs, size : 10, mode : 0o100644, permissions : 0o100644 },
          filename : 'file',
          longname : '-rw-r--r-- 1 5        6                  10 Jun 10 10:30 file'
        }, {
          attrs    : { ...eattrs, size : './file'.length, mode : 0o120777, permissions : 0o120777 },
          filename : 'slink',
          longname : 'lrwxrwxrwx 1 5        6                   6 Jun 10 10:30 slink -> ./file'
        }];
        await runClientMockedServerTest(rootfs, cmdHandler, async (client) => {
          const result = await client.sftpReaddir('/');
          // need clone because result contains Stats objects
          expect(JSON.parse(JSON.stringify(result))).to.deep.equal(expected);
        });
      });
    });
  });

  //describe('SFTP manipulations')

});
