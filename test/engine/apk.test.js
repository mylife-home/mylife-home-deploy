'use strict';

const { expect } = require('chai');
const apk        = require('../../lib/engine/apk');

const repo = 'http://dl-4.alpinelinux.org/alpine/v3.4/main/';

let cachedBase;

describe('APK', () => {

  it('Should get index', async () => {
    const res = await apk.index({ repo });

    console.log(res);
  });
});
