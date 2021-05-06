const { readPrestadores } = require('./readPrestadores');
const { readCredentials } = require('./readCredentials');
const { shareCredentials } = require('./shareCredentials');
const { createDniValidation } = require('./createDniValidation');
const { updateDniValidation } = require('./updateDniValidation');
const { removeDniValidationByDid } = require('./removeDniValidationByDid');
const { readDniValidationByDid } = require('./readDniValidationByDid');

module.exports = {
  readPrestadores,
  readCredentials,
  shareCredentials,
  createDniValidation,
  updateDniValidation,
  removeDniValidationByDid,
  readDniValidationByDid,
};
