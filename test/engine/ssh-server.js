'use strict';

const { Server, SFTP_STATUS_CODE, SFTP_OPEN_MODE } = require('ssh2');
const vfs = require('../../lib/engine/vfs');

const S_IFMT  = 0o0170000; // bit mask for the file type bit fields
const S_IFREG = 0o0100000; // regular file
const S_IFDIR = 0o0040000; // directory
const S_IFLNK = 0o0120000; // symbolic link
const S_IRUSR = 0o00400;   // owner has read permission
const S_IWUSR = 0o00200;   // owner has write permission
const S_IXUSR = 0o00100;   // owner has execute permission
const S_IRGRP = 0o00040;   // group has read permission
const S_IWGRP = 0o00020;   // group has write permission
const S_IXGRP = 0o00010;   // group has execute permission
const S_IROTH = 0o00004;   // others have read permission
const S_IWOTH = 0o00002;   // others have write permission
const S_IXOTH = 0o00001;   // others have execute permission

const fileTypeLongname = new Map([
  [ S_IFREG , '-' ],
  [ S_IFDIR , 'd' ],
  [ S_IFLNK , 'l' ]
]);

const permtoLongname = [
  { num : S_IRUSR, value : 'r' },
  { num : S_IWUSR, value : 'w' },
  { num : S_IXUSR, value : 'x' },
  { num : S_IRGRP, value : 'r' },
  { num : S_IWGRP, value : 'w' },
  { num : S_IXGRP, value : 'x' },
  { num : S_IROTH, value : 'r' },
  { num : S_IWOTH, value : 'w' },
  { num : S_IXOTH, value : 'x' }
];

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

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
    return buffer.readUInt32LE(0);
  }

  _bufferFromInt(value) {
    const buffer = Buffer.allocUnsafe(4);
    buffer.writeUInt32LE(value, 0);
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
    return this.map.delete(id);
  }
}

class OpenedFile {

}

class OpenedDirectory {
  constructor(node) {
    this.node = node;
    this.eof = false;
  }

  content() {
    if(this.eof) {
      return [];
    }

    this.eof = true;

    return this.node.list().map(node => {

      let mode = node.mode;
      if(node instanceof vfs.File)      { mode += S_IFREG; }
      if(node instanceof vfs.Directory) { mode += S_IFDIR; }
      if(node instanceof vfs.Symlink)   { mode += S_IFLNK; }

      let size = 0;
      if(node instanceof vfs.File)    { size = node.content.length; }
      if(node instanceof vfs.Symlink) { size = node.target.length; }

      const { uid, gid, atime, mtime } = node;
      const date = new Date(mtime);

      let longname = fileTypeLongname.get(mode & S_IFMT) || ' ';
      for(const item of permtoLongname) {
        longname += (mode & item.num) ? item.value : '-';
      }

      longname += ' 1';
      longname += ' ' + uid.toString().padEnd(8);
      longname += ' ' + gid.toString().padEnd(8);
      longname += ' ' + size.toString().padStart(12);
      longname += ' ' + monthNames[date.getMonth()];
      longname += ' ' + date.getDate().toString().padStart(2);
      longname += ' ' + date.getHours().toString().padStart(2, '0');
      longname += ':' + date.getMinutes().toString().padStart(2, '0');
      longname += ' ' + node.name;

      if(node instanceof vfs.Symlink) {
        longname += ' -> ' + node.target;
      }

      return {
        filename : node.name,
        attrs    : { mode, size, uid, gid, atime, mtime },
        longname
      };
    });
  }
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
    const ret = this.handleTable.delete(handle);
    await ctx.status(ret ? SFTP_STATUS_CODE.OK : SFTP_STATUS_CODE.FAILURE);
  }

  async opendir(ctx, path) {
    const node = vfs.path(this.rootfs, path.split('/').filter(n => n), true);
    if(!node) {
      return await ctx.status(SFTP_STATUS_CODE.NO_SUCH_FILE);
    }

    if(!(node instanceof vfs.Directory)) {
      return await ctx.status(SFTP_STATUS_CODE.NO_SUCH_FILE);
    }

    const openedDirectory = new OpenedDirectory(node);
    const handle = this.handleTable.create(openedDirectory);
    await ctx.handle(handle);
  }

  async readdir(ctx, handle) {
    const openedDirectory = this.handleTable.target(handle);
    if(!openedDirectory) {
      return await ctx.status(SFTP_STATUS_CODE.FAILURE);
    }

    if(openedDirectory.eof) {
      return await ctx.status(SFTP_STATUS_CODE.EOF);
    }

    await ctx.name(openedDirectory.content());
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