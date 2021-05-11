/* eslint-disable comma-dangle */
const {
  getByDID,
  findByDid,
  findByDidAndUpdate,
  getByEmail,
  getByTel,
  getAndValidate,
  emailTaken,
  telTaken,
  create,
  login,
  recoverAccount,
  changeEmail,
  changePhoneNumber,
  changePassword,
  recoverPassword,
  normalizePhone,
  saveImage,
  getImage,
} = require('../../services/UserService');

const {
  missingDid,
  missingData,
  missingEmail,
  missingPhoneNumber,
  missingPassword,
  missingExeptionDid,
  missingPrivateKeySeed,
  missingFirebaseId,
  missingName,
  missingLastName,
  missingContentType,
  missingPath,
  missingId,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  /**
   * getByDID
   */
  test('Expect getByDID to throw on missing did', async () => {
    try {
      await getByDID(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  /**
   * findByDid
   */
  test('Expect findByDid to throw on missing did', async () => {
    try {
      await findByDid(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  /**
   * findByDidAndUpdate
   */
  test('Expect findByDidAndUpdate to throw on missing did', async () => {
    try {
      await findByDidAndUpdate(undefined, 'data');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect findByDidAndUpdate to throw on missing data', async () => {
    try {
      await findByDidAndUpdate('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingData.code);
    }
  });

  /**
   * getByEmail
   */
  test('Expect getByEmail to throw on missing email', async () => {
    try {
      await getByEmail(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  /**
   * getByTel
   */
  test('Expect getByTel to throw on missing phoneNumber', async () => {
    try {
      await getByTel(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  /**
   * getAndValidate
   */
  test('Expect getAndValidate to throw on missing did', async () => {
    try {
      await getAndValidate(undefined, 'pass', 'email');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect getAndValidate to throw on missing password', async () => {
    try {
      await getAndValidate('did', undefined, 'email');
    } catch (e) {
      expect(e.code).toMatch(missingPassword.code);
    }
  });

  test('Expect getAndValidate to throw on missing email', async () => {
    try {
      await getAndValidate('did', 'pass', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  /**
   * emailTaken
   */
  test('Expect emailTaken to throw on missing mail', async () => {
    try {
      await emailTaken(undefined, 'exeptionDid');
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect emailTaken to throw on missing exeptionDid', async () => {
    try {
      await emailTaken('mail', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingExeptionDid.code);
    }
  });

  /**
   * telTaken
   */
  test('Expect telTaken to throw on missing tel', async () => {
    try {
      await telTaken(undefined, 'exeptionDid');
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  test('Expect telTaken to throw on missing exeptionDid', async () => {
    try {
      await telTaken('tel', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingExeptionDid.code);
    }
  });

  /**
   * create
   */
  test('Expect create to throw on missing did', async () => {
    try {
      await create(undefined, 'privateKeySeed', 'userMail', 'phoneNumber', 'userPass', 'firebaseId', 'name', 'lastname');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect create to throw on missing privateKeySeed', async () => {
    try {
      await create('did', undefined, 'userMail', 'phoneNumber', 'userPass', 'firebaseId', 'name', 'lastname');
    } catch (e) {
      expect(e.code).toMatch(missingPrivateKeySeed.code);
    }
  });

  test('Expect create to throw on missing userMail', async () => {
    try {
      await create('did', 'privateKeySeed', undefined, 'phoneNumber', 'userPass', 'firebaseId', 'name', 'lastname');
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect create to throw on missing phoneNumber', async () => {
    try {
      await create('did', 'privateKeySeed', 'userMail', undefined, 'userPass', 'firebaseId', 'name', 'lastname');
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  test('Expect create to throw on missing userPass', async () => {
    try {
      await create('did', 'privateKeySeed', 'userMail', 'phoneNumber', undefined, 'firebaseId', 'name', 'lastname');
    } catch (e) {
      expect(e.code).toMatch(missingPassword.code);
    }
  });

  test('Expect create to throw on missing firebaseId', async () => {
    try {
      await create('did', 'privateKeySeed', 'userMail', 'phoneNumber', 'userPass', undefined, 'name', 'lastname');
    } catch (e) {
      expect(e.code).toMatch(missingFirebaseId.code);
    }
  });

  test('Expect create to throw on missing name', async () => {
    try {
      await create('did', 'privateKeySeed', 'userMail', 'phoneNumber', 'userPass', 'firebaseId', undefined, 'lastname');
    } catch (e) {
      expect(e.code).toMatch(missingName.code);
    }
  });

  test('Expect create to throw on missing lastname', async () => {
    try {
      await create('did', 'privateKeySeed', 'userMail', 'phoneNumber', 'userPass', 'firebaseId', 'name', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingLastName.code);
    }
  });

  /**
   * login
   */
  test('Expect login to throw on missing did', async () => {
    try {
      await login(undefined, 'email', 'pass');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect login to throw on missing email', async () => {
    try {
      await login('did', undefined, 'pass');
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect login to throw on missing password', async () => {
    try {
      await login('did', 'email', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPassword.code);
    }
  });

  /**
   * recoverAccount
   */
  test('Expect recoverAccount to throw on missing email', async () => {
    try {
      await recoverAccount(undefined, 'pass', 'firebaseId');
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect recoverAccount to throw on missing password', async () => {
    try {
      await recoverAccount('email', undefined, 'firebaseId');
    } catch (e) {
      expect(e.code).toMatch(missingPassword.code);
    }
  });

  test('Expect recoverAccount to throw on missing firebaseId', async () => {
    try {
      await recoverAccount('email', 'pass', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingFirebaseId.code);
    }
  });

  /**
   * changeEmail
   */
  test('Expect changeEmail to throw on missing did', async () => {
    try {
      await changeEmail(undefined, 'newMail', 'password',);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect changeEmail to throw on missing newMail', async () => {
    try {
      await changeEmail('did', undefined, 'password');
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect changeEmail to throw on missing password', async () => {
    try {
      await changeEmail('did', 'newMail', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPassword.code);
    }
  });

  /**
   * changePhoneNumber
   */
  test('Expect changePhoneNumber to throw on missing did', async () => {
    try {
      await changePhoneNumber(undefined, 'newPhoneNumber', 'password', 'firebaseId');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect changePhoneNumber to throw on missing newPhoneNumber', async () => {
    try {
      await changePhoneNumber('did', undefined, 'password', 'firebaseId');
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  test('Expect changePhoneNumber to throw on missing password', async () => {
    try {
      await changePhoneNumber('did', 'newPhoneNumber', undefined, 'firebaseId');
    } catch (e) {
      expect(e.code).toMatch(missingPassword.code);
    }
  });

  test('Expect changePhoneNumber to throw on missing firebaseId', async () => {
    try {
      await changePhoneNumber('did', 'newPhoneNumber', 'password', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingFirebaseId.code);
    }
  });

  /**
   * changePassword
   */
  test('Expect changePassword to throw on missing did', async () => {
    try {
      await changePassword(undefined, 'oldPass', 'newPass',);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect changePassword to throw on missing oldPass', async () => {
    try {
      await changePassword('did', undefined, 'newPass');
    } catch (e) {
      expect(e.code).toMatch(missingPassword.code);
    }
  });

  test('Expect changePassword to throw on missing newPass', async () => {
    try {
      await changePassword('did', 'oldPass', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPassword.code);
    }
  });

  /**
   * recoverPassword
   */
  test('Expect recoverPassword to throw on missing eMail', async () => {
    try {
      await recoverPassword(undefined, 'newPass');
    } catch (e) {
      expect(e.code).toMatch(missingEmail.code);
    }
  });

  test('Expect recoverPassword to throw on missing newPass', async () => {
    try {
      await recoverPassword('eMail', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPassword.code);
    }
  });

  /**
   * normalizePhone
   */
  test('Expect normalizePhone to throw on missing phone', async () => {
    try {
      await normalizePhone(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPhoneNumber.code);
    }
  });

  /**
   * saveImage
   */
  test('Expect saveImage to throw on missing did', async () => {
    try {
      await saveImage(undefined, 'contentType', 'path');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect saveImage to throw on missing contentType', async () => {
    try {
      await saveImage('did', undefined, 'path');
    } catch (e) {
      expect(e.code).toMatch(missingContentType.code);
    }
  });

  test('Expect saveImage to throw on missing path', async () => {
    try {
      await saveImage('did', 'contentType', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingPath.code);
    }
  });

  /**
   * getImage
   */
  test('Expect getImage to throw on missing id', async () => {
    try {
      await getImage(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingId.code);
    }
  });
});
