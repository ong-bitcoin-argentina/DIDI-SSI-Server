const httpMocks = require('node-mocks-http');
const { ValidateIssuer } = require('../../middlewares/ValidateIssuer');
const { missingJwt } = require('../../constants/serviceErrors');
const { SERVER_DID, SERVER_PRIVATE_KEY } = require('../../constants/Constants');
const {
  ISSUER: { ERR: ERROR_ISSUER },
} = require('../../constants/Messages');
const { createJWT } = require('../../services/BlockchainService');
const { validShareReq } = require('./constants');

describe('__tests__/middlewares/ValidateIssuer/validateIssuer.test.js', () => {
  const nextFunction = jest.fn();

  const serverDid = `did:ethr:${SERVER_DID}`;
  const invalidServerDid = `did:xxethr:xx${SERVER_DID}`;

  test('Expect validate schema to throw error on missing jwt', async () => {
    const response = httpMocks.createResponse();
    const req = {
      body: {},
    };
    await ValidateIssuer(req, response, nextFunction);
    const data = response._getJSONData();
    expect(data.errorCode).toMatch(missingJwt.code);
    expect(data.status).toMatch('error');
    expect(data.message).toMatch(missingJwt.message);
  });

  test('Expect validate issuer to throw error on invalid delegate', async () => {
    const jwt = await createJWT(
      invalidServerDid,
      SERVER_PRIVATE_KEY,
      validShareReq,
      undefined,
      'id:ethr:lacchain:0x36f6dc06d34b164aec5421c8071a0d07765d4ef2',
    );
    const response = httpMocks.createResponse();
    const req = {
      body: {
        jwt,
      },
    };
    await ValidateIssuer(req, response, nextFunction);
    const data = response._getJSONData();
    expect(data.status).toMatch('error');
    expect(data.errorCode).toMatch(ERROR_ISSUER.ISSUER_IS_INVALID.code);
    expect(data.message).toMatch(ERROR_ISSUER.ISSUER_IS_INVALID.message);
  });

  test('Expect validate issuer to success', async () => {
    const jwt = await createJWT(
      serverDid,
      SERVER_PRIVATE_KEY,
      validShareReq,
      undefined,
      'id:ethr:lacchain:0x36f6dc06d34b164aec5421c9071a0d07765d4ee1',
    );
    const req = {
      body: {
        jwt,
      },
    };
    const response = httpMocks.createResponse();
    await ValidateIssuer(req, response, nextFunction);
    expect(response._getData()).toBe('');
    expect(response._isEndCalled());
  });
});
