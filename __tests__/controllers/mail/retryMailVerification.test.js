const mongoose = require('mongoose');
const { retryMailVerification } = require('../../../controllers/mail');
const { create } = require('../../../services/MailService');
const { MONGO_URL } = require('../../../constants/Constants');
const Messages = require('../../../constants/Constants');
const {
  req, res, email, code, did,
} = require('./constants');

describe('controllers/mail/retryMailVerification.test.js', () => {
  beforeAll(async () => {
    await mongoose
      .connect(MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    await create(email, code, did);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropCollection('mails');
    await mongoose.connection.close();
  });

  test('Expect to throw if validation ism\'t created before', async () => {
    try {
      await retryMailVerification({ ...req, eMail: 'notVerified@test.io' }, res);
    } catch (e) {
      expect(e.code).toBe(Messages.EMAIL.ERR.NO_VALIDATIONS_FOR_EMAIL.code);
      expect(e.message).toBe(Messages.EMAIL.ERR.NO_VALIDATIONS_FOR_EMAIL.message);
    }
  });

  test('Expect to send validation new code', async () => {
    await retryMailVerification(req, res);
    expect(res.type.mock.calls.length).toBe(1);
    expect(res.json.mock.calls.length).toBe(1);
  });
});
