jest.mock('node-fetch');
const fetch = require('node-fetch');

const { missingJwt, missingDid } = require('../../../constants/serviceErrors');
const { addShareResponse } = require('../../../services/ShareResponseService');
const { did, jwt, successResult } = require('./constants');

describe('services/ShareResponse/addShareResponse.test.js', () => {
  it('Expect addShareResponse to throw missing JWT', async () => {
    try {
      await addShareResponse(undefined, did);
    } catch (error) {
      expect(error).toBe(missingJwt);
    }
  });
  it('Expect addShareResponse to throw missing DID', async () => {
    try {
      await addShareResponse(jwt, undefined);
    } catch (error) {
      expect(error).toBe(missingDid);
    }
  });
  it('Expect addShareResponse to throw invalid JWT', async () => {
    try {
      await addShareResponse('jwt', did);
    } catch (error) {
      expect(error.message).toBe('Incorrect format JWT');
    }
  });
  it('Expect addShareResponse to success', async () => {
    fetch.mockReturnValue(successResult);
    const response = await addShareResponse(jwt, did);
    expect(response).toStrictEqual(successResult);
  });
});
