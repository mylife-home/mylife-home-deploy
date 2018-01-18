'use strict';

const fs            = require('fs');
const { expect }    = require('chai');
const { SSHClient } = require('../../lib/engine/ssh');


describe('SSH Client', () => {

  describe('In real world', () => {

    const rootList = [ '.modloop', 'bin', 'dev', 'etc', 'home', 'lib', 'media', 'mnt', 'proc', 'root', 'run', 'sbin', 'srv', 'sys', 'tmp', 'usr', 'var' ];

    async function runRealClientTest(tester) {
      const privateKey = fs.readFileSync('/Users/vincent/Downloads/id_rsa');
      const client = new SSHClient();
      await client.connect({ host : 'rpi-devel', username : 'root', privateKey });
      try {
        await tester(client);
      } finally {
        client.end();
      }
    }

    it('Should properly execute command on remote host in real world', async () => runRealClientTest(async client => {
      expect(await client.exec('ls -a /')).to.equal([ '.', '..', ...rootList ].map(it => `${it}\n`).join(''));
    }));

    it('Should properly read sftp directory on remote host in real world', async () => runRealClientTest(async client => {
      const list = await client.sftpReaddir('/');
      expect(list.map(it => it.filename).sort()).to.deep.equal(rootList);
    }));

    it('Should combine exec and sftp in same session in real world', async () => runRealClientTest(async client => {
      await client.exec('ls -a /');
      await client.sftpReaddir('/');
      await client.exec('ls -a /');
      await client.sftpReaddir('/');
    }));
  });
});
