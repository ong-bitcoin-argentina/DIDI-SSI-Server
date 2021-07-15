const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { getByDID } = require('../../../services/UserService');
const { missingDid } = require('../../../constants/serviceErrors');

describe('services/Mail/getByMail.test.js', () => {
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
    await mongoose.connection.db.dropCollection('users');
    await mongoose.connection.close();
  });

  test('Expect getByDID to throw on missing did', async () => {
    try {
      await getByDID(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });
});
