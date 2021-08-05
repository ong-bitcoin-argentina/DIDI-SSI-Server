const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { verifyCertificate, createCertificate } = require('../../../services/CertService');
const { missingJwt, missingErrMsg } = require('../../../constants/serviceErrors');
const Messages = require('../../../constants/Messages');
const Certificate = require('../../../models/Certificate');
const Constants = require('../../../constants/Constants');
const { data, mouroResponse } = require('./constant');

describe('services/Cert/verifyCertificate.test.js', () => {
  let cert;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    cert = await createCertificate(
      data.did,
      data.did,
      undefined,
      Messages.CERTIFICATE.ERR.CREATE,
    );
    await Certificate.generate(
      Constants.CERTIFICATE_NAMES.GENERIC,
      data.did,
      Constants.CERTIFICATE_STATUS.UNVERIFIED,
      mouroResponse.data,
      mouroResponse.hash,
    );
  });

  afterAll(async () => {
    await mongoose.connection.db.dropCollection('certificates');
    await mongoose.connection.close();
  });

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

  test('Expect verifyCertificate to success', async () => {
    const response = await verifyCertificate(cert, undefined, Messages.ISSUER.ERR.IS_INVALID);
    expect(response).not.toBe(null);
  });

  test('Expect verifyCertificate to throw on invalid certificate', async () => {
    const response = await verifyCertificate(data.jwt, 'hash', Messages.ISSUER.ERR.IS_INVALID);
    expect(response).not.toBe(null);
  });

  test('Expect verifyCertificate to success passing hash parameter', async () => {
    const response = await verifyCertificate(
      cert,
      mouroResponse.hash,
      Messages.ISSUER.ERR.IS_INVALID,
    );
    expect(response).not.toBe(null);
  });
});
