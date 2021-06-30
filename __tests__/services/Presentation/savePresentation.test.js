const { savePresentation } = require('../../../services/PresentationService');
const {
  missingJwt,
} = require('../../../constants/serviceErrors');
const {jwts, decodedData} = require('./constants');
const { decodeJWT } = require('did-jwt');
const { Result } = require('express-validator');

describe('services/Presentation/savePresentation.test.js', () => {
  
  test('Expect savePresentation to throw on missing jwts', async () => {
    try {
      await savePresentation({ jwts: undefined });
    } catch (e) {
      expect(e.code).toMatch(missingJwt.code);
    }
  });
  test('Expect decoded jwts on savePresentation', async () => {
    var result;
    try {
      const jwtsParsed = JSON.parse(jwts);
      for (const jwt of jwtsParsed) {
        const decoded = decodeJWT(jwt);
        if (!decoded) {
        throw INVALID();
      }
      result= decoded.data;
      }
      expect(result).toMatch(decodedData);

    } catch (e) {
      console.log(e);
      expect(e.code).toMatch(missingJwt.code);
    }
  });
});