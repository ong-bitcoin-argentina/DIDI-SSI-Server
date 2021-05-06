const { readProviders } = require('./readProviders');
const { readCredentialsByDidAndDni } = require('./readCredentialsByDidAndDni');
const { shareCredentials } = require('./shareCredentials');
const { createValidationDni } = require('./createValidationDni');
const { updateValidation } = require('./updateValidation');
const { removeValidationByDid } = require('./removeValidationByDid');
const { readValidationStateByDid } = require('./readValidationStateByDid');

module.exports = {
  readProviders,
  readCredentialsByDidAndDni,
  shareCredentials,
  createValidationDni,
  updateValidation,
  removeValidationByDid,
  readValidationStateByDid,
};
