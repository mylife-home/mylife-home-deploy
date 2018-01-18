const { Server }   = require('ssh2');

class SSHServer {

  constructor(config) {
    const { port, rootfs, ... otherConfig } = config;
    this.rootfs = rootfs;
    this.server = new Server(otherConfig, client => this._newClient(client));
    this.connections = new Set();

    this.server.listen(port);
  }

  registerCommandHandler(handler) {
    this.cmdHandler = handler;
  }

  close() {
    this.server.close();
    Array.from(this.connections).forEach(c => c.end());
  }

  _newClient(connection) {
    this.connections.add(connection);
    connection.on('close', () => this.connections.remove(connection));

    connection.on('authentication', ctx => ctx.accept());

    connection.on('ready', () => {
      connection.on('session', accept => this._newSession(accept()));
    });
  }

  _newSession(session) {
    session.on('exec', (accept, reject, info) => {
      const stream = accept();
      try {
        const ret = this.cmdHandler(info.command);
        stream.write(ret);
        stream.exit(0);
      } catch(err) {
        stream.stderr.write(err.message);
        stream.exit(1);
      }
      stream.end();
    });

    session.on('sftp', accept => {
      const sftpStream = accept();
      // TODO
    });
  }
}

exports.SSHServer = SSHServer;