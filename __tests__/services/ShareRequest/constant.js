const { createJWT } = require('../../../services/BlockchainService');
const { SERVER_DID, SERVER_PRIVATE_KEY } = require('../../../constants/Constants');

const serverDid = `did:ethr:${SERVER_DID}`;
const aud = 'did:ethr:0xd097adcb17ad8b5a7d18ed84cc8353911f13c042';
const aud2 = 'did:ethr:0xd097adcb17ad8b5a7d18ed84cc8353911f13c043';
const shareReqName = 'Share Request';

const createJwt = async (audience) => {
  const jwt = await createJWT(
    serverDid,
    SERVER_PRIVATE_KEY,
    { name: shareReqName, sub: audience, aud: audience },
    undefined,
    audience,
  );
  return jwt;
};
const jwt = createJwt(aud);
const jwt2 = createJwt(aud2);

const createUserJwt = async () => {
  const userJWT = await createJWT(aud, SERVER_PRIVATE_KEY, {}, undefined, serverDid);
  return userJWT;
};
const userJWT = createUserJwt();

module.exports = {
  jwt,
  jwt2,
  userJWT,
  serverDid,
  aud,
  aud2,
};
