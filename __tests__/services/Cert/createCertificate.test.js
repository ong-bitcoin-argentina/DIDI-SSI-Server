/* eslint-disable import/no-extraneous-dependencies */
require('fast-text-encoding');

const mongoose = require('mongoose');
const { createCertificate } = require('../../../services/CertService');
const { missingDid, missingSubject, missingErrMsg } = require('../../../constants/serviceErrors');
const { MONGO_URL } = require('../../../constants/Constants');

describe('services/Cert/createCertificate.test.js', () => {
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
  });

  afterAll(async () => {
    // await mongoose.connection.db.dropCollection('issuers');
    await mongoose.connection.close();
  });

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

  test('Expect createCertificate to createCertificate', async () => {
    const result = await createCertificate('did:ethr:0xb7123', 'TEL', 'expDate', 'errMsg');
    console.log(result);
  });
});
