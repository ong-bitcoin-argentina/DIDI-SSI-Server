const { createShareRequest } = require('../../../services/CertService');
const { createJWT } = require('../../../services/BlockchainService');
const { SERVER_DID, SERVER_PRIVATE_KEY } = require('../../../constants/Constants');

const serverDid = `did:ethr:${SERVER_DID}`;
const aud = 'did:ethr:0xd097adcb17ad8b5a7d18ed84cc8353911f13c042';

const createJwt = async () => {
  const jwt = await createJWT(serverDid, SERVER_PRIVATE_KEY, { sub: aud }, undefined, aud);
  return jwt;
};
const jwt = createJwt();

const createShareReq = async () => {
  const shareReq = await createShareRequest(aud, jwt);
  return shareReq;
};
const shareReq = createShareReq();

const createUserJwt = async () => {
  const userJWT = await createJWT(aud, SERVER_PRIVATE_KEY, {}, undefined, serverDid);
  return userJWT;
};
const userJWT = createUserJwt();

const pagination = {
  limit: 1,
  page: 2,
};

module.exports = {
  jwt,
  shareReq,
  pagination,
  userJWT,
};
