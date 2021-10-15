const mongoose = require('mongoose');

const { MONGO_URL } = require('../../../constants/Constants');
const Issuer = require('../../../models/Issuer');
const { data, delegationHashes } = require('./constants');

describe('models/Issuer/create.test.js', () => {
  const {
    name, newIssuer, expireOn, description, imageUrl,
  } = data;
  const { did } = newIssuer;
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

  test('Expect create to fail on missing did', async () => {
    try {
      await Issuer.create({
        name, expireOn, delegationHashes, description, imageUrl,
      });
    } catch (error) {
      expect(error.message).toBe('Issuer validation failed: did: Path `did` is required.');
    }
  });

  test('Expect create to fail on missing name', async () => {
    try {
      await Issuer.create({
        did, expireOn, delegationHashes, description, imageUrl,
      });
    } catch (error) {
      expect(error.message).toBe('Issuer validation failed: name: Path `name` is required.');
    }
  });

  test('Expect create to fail on missing expiration date', async () => {
    try {
      await Issuer.create({
        did, name, delegationHashes, description, imageUrl,
      });
    } catch (error) {
      expect(error.message).toBe('Issuer validation failed: expireOn: Path `expireOn` is required.');
    }
  });

  test('Expect create to fail on missing description', async () => {
    try {
      await Issuer.create({
        did, name, delegationHashes, expireOn, imageUrl,
      });
    } catch (error) {
      expect(error.message).toBe('Issuer validation failed: description: Path `description` is required.');
    }
  });

  test('Expect create to fail on missing delegationHashes', async () => {
    try {
      await Issuer.create({
        did, name, expireOn, description, imageUrl,
      });
      expect(false).toBe(true);
    } catch (error) {
      expect(error.message).toBe('Issuer validation failed: delegationHashes: Path `delegationHashes` is required.');
    }
  });

  test('Expect create to success', async () => {
    const issuer = await Issuer.create({
      name, did, delegationHashes, expireOn, description, imageUrl,
    });
    expect(issuer.id).not.toBe(null);
    expect(issuer.createdOn).not.toBe(null);
    expect(issuer.did).toBe(did);
  });
});
