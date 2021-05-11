const {
  getHash,
  saveCertificate,
  revokeCertificate,
  isInMouro,
} = require('../../services/MouroService');
const {
  missingDid,
  missingJwt,
  missingHash,
  missingErrMsg,
  missingCert,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  /**
   * getHash
   */
  test('Expect getHash to throw on missing did', async () => {
    try {
      await getHash(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  /**
   * saveCertificate
   */
  test('Expect saveCertificate to throw on missing cert', async () => {
    try {
      await saveCertificate(undefined, 'did');
    } catch (e) {
      expect(e.code).toMatch(missingCert.code);
    }
  });

  test('Expect saveCertificate to throw on missing did', async () => {
    try {
      await saveCertificate('cert', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  /**
   * revokeCertificate
   */
  test('Expect revokeCertificate to throw on missing jwt', async () => {
    try {
      await revokeCertificate(undefined, 'hash', 'did');
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });

  test('Expect revokeCertificate to throw on missing hash', async () => {
    try {
      await revokeCertificate('jwt', undefined, 'did');
    } catch (e) {
      expect(e.code).toMatch(missingHash.code);
    }
  });

  test('Expect revokeCertificate to throw on missing did', async () => {
    try {
      await revokeCertificate('jwt', 'hash', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  /**
   * isInMouro
   */
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
});
