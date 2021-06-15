const { isInMouro } = require('../../../services/MouroService');
const { missingDid, missingJwt, missingErrMsg } = require('../../../constants/serviceErrors');
const { appData } = require('./constants');

jest.mock('../../../models/SemillasAuth', () => ({
  getToken: () => ({ token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTYyMjIzMDcyMCwiZXhwIjoxNjIyODM1NTIwfQ.XIR5oQgglbnUY9nkvhOwuFCD0XUNoIdP3v1cAnvj4qwwjxg7j53_byF3MVFwUPCmM-QlR0ZVQBoB2SUwsFPdhA' }),
  createOrUpdateToken: () => ({ token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTYyMjIzMDcyMCwiZXhwIjoxNjIyODM1NTIwfQ.XIR5oQgglbnUY9nkvhOwuFCD0XUNoIdP3v1cAnvj4qwwjxg7j53_byF3MVFwUPCmM-QlR0ZVQBoB2SUwsFPdhA' }),
}));

describe('services/Mouro/getHash.test.js', () => {
  test('Expect isInMouro to throw on missing jwt', async () => {
    try {
      await isInMouro(undefined, 'did', 'errMsg');
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });

  test('Expect isInMouro to throw on missing did', async () => {
    try {
      await isInMouro('jwt', undefined, 'errMsg');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect isInMouro to throw on missing errMsg', async () => {
    try {
      await isInMouro('jwt', 'did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingErrMsg.code);
    }
  });

  test('Expect isInMouro success', async () => {
    const isInMouroResult = await isInMouro(appData.jwt, appData.did, 'myErrMsg');
    expect(isInMouroResult).toBeUndefined();
  });
});
