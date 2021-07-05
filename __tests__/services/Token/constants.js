const { createJWT, SimpleSigner } = require('did-jwt');
const Constants = require('../../../constants/Constants');

const dataResponse = {
  iat: 1624978767,
  sub: 'did:ethr:0x341b73c4dab6da7a2b037ae16e6a1f03d1245e99',
  issuer: 'did:ethr:0xb1ba86face5115be2ca902fae14f79de31c0fe7f',
};

const createToken = async (key) => {
  const signer = SimpleSigner(key);
  const jwt = await createJWT(
    { sub: dataResponse.sub, iat: dataResponse.iat, iss: dataResponse.issuer },
    { issuer: dataResponse.issuer, signer, alg: 'ES256K-R' },
  );
  return jwt;
};

const token = createToken(Constants.SERVER_PRIVATE_KEY);
const invalidToken = createToken('6553d6a56762fd5072065c68b145b7b024e302015821bd10e416e01a3a99a47d');

module.exports = {
  token,
  invalidToken,
  dataResponse,
  error: {
    code: 'INVALID_TOKEN',
    message: 'El token de aplicación es inválido, por favor verificalo.',
  },
};
