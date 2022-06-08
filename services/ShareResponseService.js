const fetch = require('node-fetch');
const { getPayload } = require('./TokenService');

const {
  missingDid,
  missingJwt,
} = require('../constants/serviceErrors');

module.exports.addShareResponse = async function addShareResponse(jwt, did) {
  if (!jwt) throw missingJwt;
  if (!did) throw missingDid;
  try {
    const { req } = await getPayload(jwt);
    const { callback } = await getPayload(req);

    return fetch(callback, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jwt),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
};
