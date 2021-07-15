/* eslint-disable import/no-extraneous-dependencies */
require('fast-text-encoding');

const mongoose = require('mongoose');
const { missingOtherDID } = require('../../../constants/serviceErrors');
const { MONGO_URL } = require('../../../constants/Constants');
const { revokeDelegate } = require('../../../services/BlockchainService');
const { data } = require('./constant');
const { addIssuers } = require('./utils');

describe('services/Blockchain/revokeDelegate.test.js', () => {
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    await addIssuers();
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

  test('Expect revokeDelegate to revoke Delegate RSK', async () => {
    const result = await revokeDelegate(data.issuerDIDRsk);
    expect(result.deleted).toBe(true);
  });

  test('Expect revokeDelegate to revoke Delegate LACCH', async () => {
    const result = await revokeDelegate(data.issuerDIDLacch);
    expect(result.deleted).toBe(true);
  });

  // Skiped because out of gas
  test.skip('Expect revokeDelegate to revoke Delegate BFA', async () => {
    const result = await revokeDelegate(data.issuerDIDBfa);
    expect(result.deleted).toBe(true);
  });
});
