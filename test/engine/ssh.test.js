'use strict';

const fs            = require('fs');
const path          = require('path');
const { expect }    = require('chai');
const { SSHClient } = require('../../lib/engine/ssh');
const { SSHServer } = require('./ssh-server');

describe('SSH Client', () => {

  describe.skip('In real world', () => {

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

  describe('Using mocked server', () => {

    async function runClientTest(tester) {
      const port = 8822;
      const server = new SSHServer({ port, hostKeys : [ fs.readFileSync(path.resolve(__dirname, 'content/id_rsa')) ] });
      const client = new SSHClient();
      await client.connect({ host : 'localhost', port, username : 'root', password : 'nothing' });
      try {
        await tester(server, client);
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

    it('Should properly execute command on mocked server', async () => runClientTest(async (server, client) => {
      server.registerCommandHandler(cmdHandler);
      expect(await client.exec(command)).to.equal(commandResult);
    }));

    it('Should fail to execute wrong command on mocked server', async () => runClientTest(async (server, client) => {
      server.registerCommandHandler(cmdHandler);
      expect(await client.exec('wrong command')).to.equal(commandResult);
    }));
  });
});
