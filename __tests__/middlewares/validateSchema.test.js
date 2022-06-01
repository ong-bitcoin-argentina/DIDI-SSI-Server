const httpMocks = require('node-mocks-http');
const { ValidateSchema } = require('../../middlewares/ValidateSchema');
const { missingJwt } = require('../../constants/serviceErrors');
const { SERVER_DID, SERVER_PRIVATE_KEY } = require('../../constants/Constants');
const { validShareReq, invalidShareReq } = require('./constants');

const {
  SHAREREQUEST: { ERR },
} = require('../../constants/Messages');

const { createJWT } = require('../../services/BlockchainService');

const serverDid = `did:ethr:${SERVER_DID}`;
const invalidServerDid = `did:xxethr:xx${SERVER_DID}`;

describe('__tests__/middlewares/validateSchema/validateSchema.test.js', () => {
  const nextFunction = jest.fn();

  test('Expect validate schema to throw error on missing jwt', async () => {
    const req = {
      body: {
        jwt: undefined,
      },
    };
    const response = httpMocks.createResponse();
    await ValidateSchema(req, response, nextFunction);
    const data = response._getJSONData();
    expect(data.errorCode).toMatch(missingJwt.code);
    expect(data.status).toMatch('error');
    expect(data.message).toMatch(missingJwt.message);
  });

  test('Expect validate schema to throw invalid did', async () => {
    const response = httpMocks.createResponse();
    const jwt = await createJWT(
      invalidServerDid,
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
    await ValidateSchema(req, response, nextFunction);
    const data = response._getJSONData();
    expect(data.status).toMatch('error');
    expect(data.message).toMatch("Unsupported DID method: 'xxethr'");
  });

  test('Expect validate schema to fail on invalid schema', async () => {
    const jwt = await createJWT(
      serverDid,
      SERVER_PRIVATE_KEY,
      invalidShareReq,
      undefined,
      'lacchain:0x36f6dc06d34b164aec5421c9071a0d07765d4ee1',
    );

    const response = httpMocks.createResponse();
    const req = {
      body: {
        jwt,
      },
    };
    await ValidateSchema(req, response, nextFunction);
    const data = response._getJSONData();
    expect(data.status).toMatch('error');
    expect(data.errorCode).toMatch(ERR.VALIDATION_ERROR('').code);
    expect(data.message).toMatch(ERR.VALIDATION_ERROR("should have required property 'claims'").message);
  });

  test('Expect validate schema to success', async () => {
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

    await ValidateSchema(req, response, nextFunction);
    expect(response._getData()).toBe('');
    expect(response._isEndCalled());
  });
});
