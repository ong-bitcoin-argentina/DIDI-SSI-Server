const fetch = require('node-fetch');

const {
  missingDid,
  missingJwt,
} = require('../constants/serviceErrors');
const { ISSUER_URLS, ISSUER_AUTH_TOKEN } = require('../constants/Constants');

module.exports.addShareResponse = async function addShareResponse(jwt, did) {
  if (!jwt) throw missingJwt;
  if (!did) throw missingDid;
  try {
    const url = `${ISSUER_URLS.SHARE_RESPONSE}/${did}`;
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: ISSUER_AUTH_TOKEN,
      },
      body: JSON.stringify(jwt),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
};
