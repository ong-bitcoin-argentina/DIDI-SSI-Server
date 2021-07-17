/* eslint-disable import/no-extraneous-dependencies */
// require('fast-text-encoding');
const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { missingIssuerDid } = require('../../../constants/serviceErrors');
const { validDelegate } = require('../../../services/BlockchainService');
const { addIssuers } = require('./utils');

describe('services/Blockchain/validDelegate.test.js', () => {
  let rsk;
  let lacchain;
  let bfa;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    const issuers = await addIssuers();
    rsk = issuers.rsk;
    lacchain = issuers.lacchain;
    bfa = issuers.bfa;
  });

  afterAll(async () => {
    await mongoose.connection.db.dropCollection('issuers');
    await mongoose.connection.close();
  });

  test('Expect validDelegate to throw on missing issuerDID', async () => {
    try {
      await validDelegate(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingIssuerDid.code);
    }
  });

  test('Expect validDelegate to be true on RSK', async () => {
    const result = await validDelegate(rsk.did);
    expect(result).toBe(true);
  });

  test('Expect validDelegate to be true on Lacch', async () => {
    const result = await validDelegate(lacchain.did);
    expect(result).toBe(true);
  });

  test.skip('Expect validDelegate to be true on BFA', async () => {
    const result = await validDelegate(bfa.did);
    expect(result).toBe(true);
  });
});
