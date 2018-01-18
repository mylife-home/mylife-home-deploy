'use strict';

const { Client } = require('ssh2');

class SSHClient {

  constructor() {
    this.conn = new Client();
  }

  async connect(options) {
    return await new Promise((resolve, reject) => {

      const removeListeners = () => {
        this.conn.removeListener('error', onError);
        this.conn.removeListener('ready', onReady);
      };

      const onError = err => {
        removeListeners();
        reject(err);
      };

      const onReady = () => {
        removeListeners();
        resolve();
      };

      this.conn.once('error', onError);
      this.conn.once('ready', onReady);

      this.conn.connect(options);
    });
  }

  end() {
    this.conn.end();
  }

  async _exec(command, options = {}) {
    return await new Promise((resolve, reject) => {

      this.conn.exec(command, options, (err, stream) => {
        if(err) {
          return reject(err);
        }

        const ret = {
          stdout : Buffer.alloc(0),
          stderr : Buffer.alloc(0)
        };

        stream.on('close', (code, signal) => {
          ret.code   = code;
          ret.signal = signal;
          ret.stdout = ret.stdout.toString();
          ret.stderr = ret.stderr.toString();

          resolve(ret);
        });

        stream.on('data', data => {
          ret.stdout = Buffer.concat([ ret.stdout, data ]);
        });

        stream.stderr.on('data', data => {
          ret.stderr = Buffer.concat([ ret.stderr, data ]);
        });

      });
    });
  }

  async exec(command, env) {
    const ret = await this._exec(command, { env });
    if(ret.stderr) {
      throw new Error(`Command has error output : '${ret.stderr}'`);
    }
    if(ret.signal) {
      throw new Error(`Command received signal ${ret.signal}`);
    }
    if(ret.code) {
      throw new Error(`Command returned error code ${ret.code}`);
    }
    return ret.stdout;
  }

  async _getSftp() {
    if(this.sftp) {
      return this.sftp;
    }

    return await new Promise((resolve, reject) => {
      this.conn.sftp((err, sftp) => {
        if(err) {
          return reject(err);
        }

        this.sftp = sftp;
        resolve(sftp);
      });
    });
  }

  async sftpReaddir(location) {
    const sftp = await this._getSftp();

    return await new Promise((resolve, reject) => {
      sftp.readdir(location, (err, list) => {
        if(err) {
          return reject(err);
        }

        resolve(list);
      });
    });
  }
}

exports.SSHClient = SSHClient;