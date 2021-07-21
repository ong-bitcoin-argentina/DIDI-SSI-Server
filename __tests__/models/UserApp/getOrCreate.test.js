/* eslint-disable eqeqeq */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const {
  MONGO_URL,
} = require('../../../constants/Constants');
const UserApp = require('../../../models/UserApp');
const { userId, appAuthId, errors } = require('./constants');

describe('UserApp getOrCreate', () => {
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
    await mongoose.connection.db.dropCollection('userapps');
    await mongoose.connection.close();
  });
  test('Expect to create & get', async () => {
    const userApp = await UserApp.getOrCreate(userId, appAuthId);
    expect(userApp.userId.toString()).toEqual(userId);
    expect(userApp.appAuthId.toString()).toEqual(appAuthId);
  });
  test('Expect to throw error on missing userId', async () => {
    try {
      await UserApp.getOrCreate(undefined, appAuthId);
    } catch (e) {
      expect(e.errors.userId.message).toBe(errors.userId);
    }
  });
  test('Expect to throw error on missing appAuthId', async () => {
    try {
      await UserApp.getOrCreate(userId, undefined);
    } catch (e) {
      expect(e.errors.appAuthId.message).toBe(errors.appAuthId);
    }
  });
});
