const { isInMouro, saveCertificate, revokeCertificate } = require('../../../services/MouroService');
const { missingDid, missingJwt, missingErrMsg } = require('../../../constants/serviceErrors');
const { data, cert } = require('./constants');

describe('services/Mouro/getHash.test.js', () => {
  let response;
  beforeAll(async () => {
    response = await saveCertificate(await cert, data.did);
  });
  afterAll(async () => {
    await revokeCertificate(response.data, response.hash, data.did);
  });
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
    const hash = await isInMouro(response.data, data.did, 'myErrMsg');
    expect(hash).toMatch(response.hash);
  });
});
