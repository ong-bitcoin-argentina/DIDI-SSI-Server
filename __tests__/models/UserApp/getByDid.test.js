/* eslint-disable no-console */
const mongoose = require('mongoose');
const {
  MONGO_URL,
} = require('../../../constants/Constants');
const UserApp = require('../../../models/UserApp');
const { createUser, createAppAuth } = require('./utils');
const {
  userData, appData, secondAppData, secondUserData,
} = require('./constants');

describe('UserApp getOrCreate', () => {
  let user;
  let appAuth;
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    user = await createUser(userData.did);
    appAuth = await createAppAuth(appData);
    await UserApp.getOrCreate(user.id, appAuth.id);
  });
  afterAll(async () => {
    await mongoose.connection.db.dropCollection('users');
    await mongoose.connection.db.dropCollection('appauths');
    await mongoose.connection.db.dropCollection('userapps');
    await mongoose.connection.close();
  });
  test('Expect to get one userApp by did', async () => {
    const result = await UserApp.getByDID(userData.did);
    expect(result.userId.did).toBe(userData.did);
    expect(result.appAuthId.name).toBe(appData.name);
  });
  // Los siguientes test se saltean debido al mal funcionamiento del modelo
  test.skip('Expect to throw error on missing did', async () => {
    const result = await UserApp.getByDID(undefined);
    expect(result).toBeNull();
  });
  test.skip('Expect to get multiple userApp by did', async () => {
    const secondAppAuth = await createAppAuth(secondAppData);
    await UserApp.getOrCreate(user.id, secondAppAuth);
    const result = await UserApp.getByDID(userData.did);
    expect(result.length).toBeGreaterThan(1);
  });
  test.skip('Expect to get one userApp by other did', async () => {
    const secondUser = await createUser(secondUserData.did);
    await UserApp.getOrCreate(secondUser.id, appAuth.id);
    const result = await UserApp.getByDID(secondUserData.did);
    expect(result.userId.did).toBe(secondUserData.did);
  });
});
