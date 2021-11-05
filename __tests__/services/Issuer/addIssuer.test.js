const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { addIssuer } = require('../../../services/IssuerService');
const { missingDid, missingName, missingDescription } = require('../../../constants/serviceErrors');
const { removeBlockchainFromDid, compareDid } = require('../../../services/BlockchainService');
const { data } = require('./constatns');

describe('services/Issuer/addIssuer.test.js', () => {
  const {
    did,
    name,
    description,
    imageUrl,
    secondDid,
    allNetworksDid,
    rskDid,
    lacchainDid,
  } = data;
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
    await mongoose.connection.db.dropCollection('issuers');
    await mongoose.connection.close();
  });

  test('Expect addIssuer to throw on missing did', async () => {
    try {
      await addIssuer(undefined, 'name', 'description');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect addIssuer to throw on missing name', async () => {
    try {
      await addIssuer('did', undefined, 'description');
    } catch (e) {
      expect(e.code).toMatch(missingName.code);
    }
  });

  test('Expect addIssuer to throw on missing description', async () => {
    try {
      await addIssuer('did', 'name', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDescription.code);
    }
  });

  test('Expect addIssuer to success without image', async () => {
    const response = await addIssuer(did, name, description);
    const didWithoutNetwork = await removeBlockchainFromDid(did);
    expect(response.did).toMatch(didWithoutNetwork);
    expect(response.name).toMatch(name);
    expect(response.description).toMatch(description);
    expect(response.deleted).toBe(false);
    expect(response.expireOne).not.toBe(null);
    expect(response.delegationHashes.length).toBeGreaterThan(0);
  });

  test('Expect addIssuer to success with image', async () => {
    const response = await addIssuer(secondDid, name, description, imageUrl);
    const didWithoutNetwork = await removeBlockchainFromDid(secondDid);
    expect(response.did).toMatch(didWithoutNetwork);
    expect(response.name).toMatch(name);
    expect(response.description).toMatch(description);
    expect(response.imageUrl).toBe(imageUrl);
    expect(response.deleted).toBe(false);
    expect(response.expireOne).not.toBe(null);
    expect(response.delegationHashes.length).toBeGreaterThan(0);
  });

  test('Expect addIssuer to success multiple blockchains', async () => {
    const response = await addIssuer(allNetworksDid, name, description);
    const didWithoutNetwork = await removeBlockchainFromDid(allNetworksDid);
    expect(response.did).toMatch(didWithoutNetwork);
    expect(response.name).toMatch(name);
    expect(response.description).toMatch(description);
    expect(response.deleted).toBe(false);
    expect(response.expireOne).not.toBe(null);
    expect(response.delegationHashes.length).toBeGreaterThan(0);
  });

  test('Expect addIssuer to let delegate a same public key on diferents blockchains', async () => {
    expect(await compareDid(rskDid, lacchainDid)).toBeTruthy();
    const firstDelegation = await addIssuer(lacchainDid, name, description);
    let didWithoutNetwork = await removeBlockchainFromDid(lacchainDid);
    expect(firstDelegation.did).toBe(didWithoutNetwork);
    expect(firstDelegation.delegationHashes.length).toBe(1);
    const secondDelegation = await addIssuer(rskDid, name, description);
    didWithoutNetwork = await removeBlockchainFromDid(rskDid);
    expect(firstDelegation.did).toBe(didWithoutNetwork);
    expect(secondDelegation.delegationHashes.length).toBe(2);
  });
});
