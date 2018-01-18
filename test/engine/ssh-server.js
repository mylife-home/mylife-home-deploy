'use strict';

const { Server, SFTP_STATUS_CODE, SFTP_OPEN_MODE } = require('ssh2');

const sftpEvents = [
  'OPEN',
  'READ',
  'WRITE',
  'FSTAT',
  'FSETSTAT',
  'CLOSE',
  'OPENDIR',
  'READDIR',
  'LSTAT',
  'STAT',
  'REMOVE',
  'RMDIR',
  'REALPATH',
  'READLINK',
  'SETSTAT',
  'MKDIR',
  'RENAME',
  'SYMLINK'
];

const stfpResponses = [
  'status',
  'handle',
  'data',
  'name',
  'attrs'
];

class HandleTable {
  constructor() {
    this.generator = 0;
    this.map = new Map();
  }

  _bufferToInt(buffer) {
    return buffer.readUint32LE(0);
  }

  _bufferFromInt(value) {
    const buffer = Buffer.allocUnsafe(4);
    buffer.writeUint32LE(value, 0);
    return buffer;
  }

  create(target) {
    const id = ++this.generator;
    this.map.set(id, target);
    return this._bufferFromInt(id);
  }

  target(handle) {
    const id = this._bufferToInt(handle);
    return this.map.get(id);
  }

  delete(handle) {
    const id = this._bufferToInt(handle);
    this.map.delete(id);
  }
}

class OpenedFile {

}

class OpenedDirectory {

}

class RequestContext {
  constructor(conn, sftpStream, reqid) {
    this.conn = conn;
    this.sftpStream = sftpStream;
    this.reqid = reqid;

    for(const response of stfpResponses) {
      const responseCall = this.sftpStream[response].bind(this.sftpStream);
      this[response] = async (...args) => {
        if(responseCall(this.reqid, ...args)) {
          return;
        }

        await this._wait();
      };
    }
  }

  async _wait() {
    return await new Promise((resolve, reject) => {

      const removeListeners = () => {
        this.conn.removeListener('error', onError);
        this.conn.removeListener('continue', onContinue);
      };

      const onError = err => {
        removeListeners();
        reject(err);
      };

      const onContinue = () => {
        removeListeners();
        resolve();
      };

      this.conn.once('error', onError);
      this.conn.once('continue', onContinue);
    });
  }
}

class SFTPSession {
  constructor(rootfs) {
    this.handleTable = new HandleTable();
    this.rootfs = rootfs;
  }

  async open(ctx, filename, flags, attrs) {
    await ctx.status(SFTP_STATUS_CODE.OP_UNSUPPORTED);
  }

  async read(ctx, handle, offset, length) {
    await ctx.status(SFTP_STATUS_CODE.OP_UNSUPPORTED);
  }

  async write(ctx, handle, offset, data) {
    await ctx.status(SFTP_STATUS_CODE.OP_UNSUPPORTED);
  }

  async fstat(ctx, handle) {
    await ctx.status(SFTP_STATUS_CODE.OP_UNSUPPORTED);
  }

  async fsetstat(ctx, handle, attrs) {
    await ctx.status(SFTP_STATUS_CODE.OP_UNSUPPORTED);
  }

  async close(ctx, handle) {
    await ctx.status(SFTP_STATUS_CODE.OP_UNSUPPORTED);
  }

  async opendir(ctx, path) {
    await ctx.status(SFTP_STATUS_CODE.OP_UNSUPPORTED);
  }

  async readdir(ctx, handle) {
    await ctx.status(SFTP_STATUS_CODE.OP_UNSUPPORTED);
  }

  async lstat(ctx, path) {
    await ctx.status(SFTP_STATUS_CODE.OP_UNSUPPORTED);
  }

  async stat(ctx, path) {
    await ctx.status(SFTP_STATUS_CODE.OP_UNSUPPORTED);
  }

  async remove(ctx, path) {
    await ctx.status(SFTP_STATUS_CODE.OP_UNSUPPORTED);
  }

  async rmdir(ctx, path) {
    await ctx.status(SFTP_STATUS_CODE.OP_UNSUPPORTED);
  }

  async realpath(ctx, path) {
    await ctx.status(SFTP_STATUS_CODE.OP_UNSUPPORTED);
  }

  async readlink(ctx, path) {
    await ctx.status(SFTP_STATUS_CODE.OP_UNSUPPORTED);
  }

  async setstat(ctx, path, attrs) {
    await ctx.status(SFTP_STATUS_CODE.OP_UNSUPPORTED);
  }

  async mkdir(ctx, path, attrs) {
    await ctx.status(SFTP_STATUS_CODE.OP_UNSUPPORTED);
  }

  async rename(ctx, oldPath, newPath) {
    await ctx.status(SFTP_STATUS_CODE.OP_UNSUPPORTED);
  }

  async symlink(ctx, linkPath, targetPath) {
    await ctx.status(SFTP_STATUS_CODE.OP_UNSUPPORTED);
  }
}

class SSHServer {

  constructor(config) {
    const { port, rootfs, cmdhandler, ... otherConfig } = config;
    this.rootfs      = rootfs;
    this.cmdhandler  = cmdhandler;
    this.server      = new Server(otherConfig, client => this._newClient(client));
    this.connections = new Set();

    this.server.listen(port);
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
      connection.on('session', accept => this._newSession(connection, accept()));
    });
  }

  _newSession(connection, session) {
    session.on('exec', (accept, reject, info) => {
      const stream = accept();
      try {
        const ret = this.cmdhandler(info.command);
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
      const ssession = new SFTPSession(this.rootfs);

      for(const event of sftpEvents) {
        const sessionCall = ssession[event.toLowerCase()].bind(ssession);
        sftpStream.on(event, (reqid, ...args) => sessionCall(new RequestContext(connection, sftpStream, reqid), ...args));
      }
    });
  }
}

exports.SSHServer = SSHServer;