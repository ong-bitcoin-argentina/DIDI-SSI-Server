/* eslint-disable import/no-extraneous-dependencies */
require('fast-text-encoding');

const mongoose = require('mongoose');
const { revokeDelegate, addDelegate } = require('../../../services/BlockchainService');
const { missingOtherDID } = require('../../../constants/serviceErrors');
const { MONGO_URL } = require('../../../constants/Constants');
const { data } = require('./constant');
const { addIssuer } = require('../../../services/IssuerService');

describe('services/Blockchain/revokeDelegate.test.js', () => {
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    await addIssuer(data.issuerDIDRsk, 'blockchain-rsk-test');
    await addDelegate(data.issuerDIDRsk);
    await addIssuer(data.issuerDIDLatch, 'blockchain-latch--test');
    await addDelegate(data.issuerDIDLatch);
    // await addIssuer(data.issuerDIDBfa, 'blockchain-bfa--test');
    // await addDelegate(data.issuerDIDBfa);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropCollection('issuers');
    await mongoose.connection.close();
  });

  test('Expect revokeDelegate to throw on missing otherDID', async () => {
    try {
      await revokeDelegate(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingOtherDID.code);
    }
  });

  // rsk
  test('Expect revokeDelegate to revoke Delegate RSK', async () => {
    const result = await revokeDelegate(data.issuerDIDRsk);
    expect(result.deleted).toBe(true);
  });

  // Lacchain
  test('Expect revokeDelegate to revoke Delegate LATCH', async () => {
    const result = await revokeDelegate(data.issuerDIDLatch);
    expect(result.deleted).toBe(true);
  });

  // BFA
  test.skip('Expect revokeDelegate to revoke Delegate BFA', async () => {
    const result = await revokeDelegate(data.issuerDIDBfa);
    expect(result.deleted).toBe(true);
  });
});
