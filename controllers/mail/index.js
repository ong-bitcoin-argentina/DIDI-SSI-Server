const { createMailVerification } = require('./createMailVerification');
const { retryMailVerification } = require('./retryMailVerification');
const { createCertificateByMailCode } = require('./createCertificateByMailCode');

module.exports = {
  createMailVerification,
  retryMailVerification,
  createCertificateByMailCode,
};
