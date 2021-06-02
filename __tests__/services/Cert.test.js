const {
  createPhoneCertificate,
  createMailCertificate,
  createPetition,
  createShareRequest,
  createCertificate,
  verifyCertificateEmail,
  verifyCertificatePhoneNumber,
  decodeCertificate,
  verifyCertificate,
  verifyIssuer,
} = require('../../services/CertService');

const {
  missingPhoneNumber,
  missingDid,
  missingEmail,
  missingClaims,
  missingCallback,
  missingJwt,
  missingSubject,
  missingErrMsg,
  missingIssuerDid,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  /**
   * createPhoneCertificate
   */
  test('Expect createPhoneCertificate to throw on missing did', async () => {
    try {
      await createPhoneCertificate(undefined, 'phoneNumber');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect createPhoneCertificate to throw on missing phoneNumber', async () => {
    try {
      await createPhoneCertificate('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  /**
   * createMailCertificate
   */
  test('Expect createMailCertificate to throw on missing did', async () => {
    try {
      await createMailCertificate(undefined, 'email');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect createMailCertificate to throw on missing email', async () => {
    try {
      await createMailCertificate('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  /**
   * createPetition
   */
  test('Expect createPetition to throw on missing did', async () => {
    try {
      await createPetition(undefined, 'claims', 'callback');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect createPetition to throw on missing claims', async () => {
    try {
      await createPetition('did', undefined, 'callback');
    } catch (e) {
      expect(e.code).toMatch(missingClaims.code);
    }
  });

  test('Expect createPetition to throw on missing callback', async () => {
    try {
      await createPetition('did', 'claims', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingCallback.code);
    }
  });

  /**
   * createShareRequest
   */
  test('Expect createShareRequest to throw on missing did', async () => {
    try {
      await createShareRequest(undefined, 'jwt');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect createShareRequest to throw on missing jwt', async () => {
    try {
      await createShareRequest('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });

  /**
   * createCertificate
   */
  test('Expect createCertificate to throw on missing did', async () => {
    try {
      await createCertificate(undefined, 'subject', 'expDate', 'errMsg');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect createCertificate to throw on missing subject', async () => {
    try {
      await createCertificate('did', undefined, 'expDate', 'errMsg');
    } catch (e) {
      expect(e.code).toMatch(missingSubject.code);
    }
  });

  test('Expect createCertificate to throw on missing errMsg', async () => {
    try {
      await createCertificate('did', 'subject', 'expDate', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingErrMsg.code);
    }
  });

  /**
   * verifyCertificateEmail
   */
  test('Expect verifyCertificateEmail to throw on missing jwt', async () => {
    try {
      await verifyCertificateEmail(undefined, 'hash');
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });

  /**
   * verifyCertificatePhoneNumber
   */
  test('Expect verifyCertificatePhoneNumber to throw on missing jwt', async () => {
    try {
      await verifyCertificatePhoneNumber(undefined, 'hash');
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });

  /**
   * decodeCertificate
   */
  test('Expect decodeCertificate to throw on missing jwt', async () => {
    try {
      await decodeCertificate(undefined, 'errMsg');
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });

  test('Expect decodeCertificate to throw on missing errMsg', async () => {
    try {
      await decodeCertificate('jwt', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingErrMsg.code);
    }
  });

  /**
   * verifyCertificate
   */
  test('Expect verifyCertificate to throw on missing jwt', async () => {
    try {
      await verifyCertificate(undefined, 'hash', 'errMsg');
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });

  test('Expect verifyCertificate to throw on missing errMsg', async () => {
    try {
      await verifyCertificate('jwt', 'hash', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingErrMsg.code);
    }
  });

  /**
   * verifyIssuer
   */
  test('Expect verifyIssuer to throw on missing issuerDid', async () => {
    try {
      await verifyIssuer(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingIssuerDid.code);
    }
  });
});
