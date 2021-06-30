/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const { MONGO_URL } = require('../../../constants/Constants');
const { savePresentation } = require('../../../services/PresentationService');
const {
  missingJwt,
} = require('../../../constants/serviceErrors');
const { jwts } = require('./constants');

describe('services/Presentation/savePresentation.test.js', () => {
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
  test('Expect savePresentation to throw on missing jwts', async () => {
    try {
      await savePresentation({ jwts: undefined });
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });
  test('Expect savePresentation generate the presentation', async () => {
    try {
      const savePresentationresponse = await savePresentation({ jwts });
      expect(savePresentationresponse.jwts).toMatch(jwts);
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });
});
