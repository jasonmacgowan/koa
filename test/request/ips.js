
'use strict';

const assert = require('assert');
const request = require('../helpers/context').request;

describe('req.ips', () => {
  describe('when X-Forwarded-For is present', () => {
    describe('and proxy is not trusted', () => {
      it('should be ignored', () => {
        const req = request();
        req.app.proxy = false;
        req.header['x-forwarded-for'] = '127.0.0.1,127.0.0.2';
        assert.deepEqual(req.ips, []);
      });
    });

    describe('and proxy is trusted', () => {
      it('should be used', () => {
        const req = request();
        req.app.proxy = true;
        req.header['x-forwarded-for'] = '127.0.0.1,127.0.0.2';
        assert.deepEqual(req.ips, ['127.0.0.1', '127.0.0.2']);
      });
    });

    describe('and contains IPv4', () => {
      it('should not return port', () => {
        const req = request();
        req.app.proxy = true;
        req.header['x-forwarded-for'] = '127.0.0.1:80,127.0.0.2';
        assert.deepEqual(req.ips, ['127.0.0.1', '127.0.0.2']);
      });
    });

    describe('and contains IPv6', () => {
      it('should parse correctly', () => {
        const req = request();
        req.app.proxy = true;
        req.header['x-forwarded-for'] = '::1';
        assert.deepEqual(req.ips, ['::1']);
      });
    });
  });
});
