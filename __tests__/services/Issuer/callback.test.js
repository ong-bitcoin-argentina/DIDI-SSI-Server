jest.mock('node-fetch');

const fetch = require('node-fetch');
const { callback } = require('../../../services/IssuerService');
const {
  missingDid, missingUrl, missingToken, missingData,
} = require('../../../constants/serviceErrors');
const { data, successResp, failureResp } = require('./constatns');

describe('services/Issuer/callback.test.js', () => {
  const {
    rskDid, token, callbackUrl,
  } = data;

  test('Expect callback to throw on missing url', async () => {
    try {
      await callback(undefined, 'did', 'token', 'data');
    } catch (e) {
      expect(e.code).toMatch(missingUrl.code);
    }
  });

  test('Expect callback to throw on missing did', async () => {
    try {
      await callback('url', undefined, 'token', 'data');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect callback to throw on missing token', async () => {
    try {
      await callback('url', 'did', undefined, 'data');
    } catch (e) {
      expect(e.code).toMatch(missingToken.code);
    }
  });

  test('Expect callback to throw on missing data', async () => {
    try {
      await callback('url', 'did', 'token', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingData.code);
    }
  });

  test('Expect callback to get success response fron issuer', async () => {
    fetch.mockReturnValue(
      Promise.resolve(successResp),
    );
    const response = await callback(callbackUrl, rskDid, token, { status: 'Creado' });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toBe(successResp.json());
  });

  test('Expect callback to get failure response fron issuer', async () => {
    fetch.mockReturnValue(
      Promise.reject(failureResp),
    );
    try {
      await callback(callbackUrl, rskDid, token, { status: 'Creado' });
    } catch (error) {
      expect(error).toBe(failureResp);
    }
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
