const {
  addIssuer,
  editData,
  refresh,
  getIssuerByDID,
  callback,
  createDelegateTransaction,
} = require('../../services/IssuerService');

const {
  missingDid, missingName, missingUrl, missingToken, missingData, missingCallback, missingAction,
} = require('../../constants/serviceErrors');

describe('Should be green', () => {
  /**
   * addIssuer
   */
  test('Expect addIssuer to throw on missing did', async () => {
    try {
      await addIssuer(undefined, 'name');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect addIssuer to throw on missing name', async () => {
    try {
      await addIssuer('did', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingName.code);
    }
  });

  /**
   * editData
   */
  test('Expect editData to throw on missing did', async () => {
    try {
      await editData(undefined, 'name', 'description');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  /**
   * refresh
   */
  test('Expect refresh to throw on missing did', async () => {
    try {
      await refresh(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  /**
   * getIssuerByDID
   */
  test('Expect getIssuerByDID to throw on missing did', async () => {
    try {
      await getIssuerByDID(undefined);
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  /**
   * callback
   */
  test('Expect callback to throw on missing url', async () => {
    try {
      await callback(undefined, 'did', 'token', 'data');
    } catch (e) {
      expect(e.code).toMatch(missingUrl.code);
    }
  });

  test('Expect callback to throw on missing did', async () => {
    try {
      await callback('url', undefined, 'token', 'data');
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect callback to throw on missing token', async () => {
    try {
      await callback('url', 'did', undefined, 'data');
    } catch (e) {
      expect(e.code).toMatch(missingToken.code);
    }
  });

  test('Expect callback to throw on missing data', async () => {
    try {
      await callback('url', 'did', 'token', undefined);
    } catch (e) {
      expect(e.code).toMatch(missingData.code);
    }
  });

  /**
   * createDelegateTransaction
   */
  test('Expect createDelegateTransaction to throw on missing did', async () => {
    try {
      await createDelegateTransaction({
        did: undefined, name: 'name', callbackUrl: 'callbackUrl', token: 'token', action: 'action',
      });
    } catch (e) {
      expect(e.code).toMatch(missingDid.code);
    }
  });

  test('Expect createDelegateTransaction to throw on missing callbackUrl', async () => {
    try {
      await createDelegateTransaction({
        did: 'did', name: 'name', callbackUrl: undefined, token: 'token', action: 'action',
      });
    } catch (e) {
      expect(e.code).toMatch(missingCallback.code);
    }
  });

  test('Expect createDelegateTransaction to throw on missing token', async () => {
    try {
      await createDelegateTransaction({
        did: 'did', name: 'name', callbackUrl: 'callbackUrl', token: undefined, action: 'action',
      });
    } catch (e) {
      expect(e.code).toMatch(missingToken.code);
    }
  });

  test('Expect createDelegateTransaction to throw on missing action', async () => {
    try {
      await createDelegateTransaction({
        did: 'did', name: 'name', callbackUrl: 'callbackUrl', token: 'token', action: undefined,
      });
    } catch (e) {
      expect(e.code).toMatch(missingAction.code);
    }
  });
});
