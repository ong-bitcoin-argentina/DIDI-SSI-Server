const mongoose = require('mongoose');
const { getPresentation, savePresentation } = require('../../../services/PresentationService');
const { MONGO_URL } = require('../../../constants/Constants');
const {
  missingId,
} = require('../../../constants/serviceErrors');
const { jwts } = require('./constants');


describe('services/Presentation/getPresentation.test.js', () => {
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
    await mongoose.connection.db.dropCollection('presentations');
    await mongoose.connection.close();
  });
  test('Expect getPresentation to throw on missing id', async () => {
    try {
      await getPresentation({ id: undefined });
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });
  test('Expect getPresentation to find a generate id', async () => {
    try {
      const presentation = await savePresentation({ jwts });
      // eslint-disable-next-line no-underscore-dangle
      await getPresentation({ id: presentation._id });
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });
});
