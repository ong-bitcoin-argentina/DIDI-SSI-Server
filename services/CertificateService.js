const Constants = require("../constants/Constants");

const EthrDID = require("ethr-did");
const { createVerifiableCredential } = require("did-jwt-vc");

class CertificateService {
	static createCertificate(did, subject, cb, errCb) {
		const vcissuer = new EthrDID({
			address: Constants.SERVER_DID,
			privateKey: Constants.SERVER_PRIVATE_KEY
		});

		const vcPayload = {
			sub: did,
			nbf: Constants.NOT_BACK_FROM,
			vc: {
				"@context": [Constants.CREDENTIALS.CONTEXT],
				type: [Constants.CREDENTIALS.TYPES.VERIFIABLE],
				credentialSubject: subject
			}
		};

		// TODO MANDARLO A MOURO
		createVerifiableCredential(vcPayload, vcissuer)
			.then(result => {
				console.log(result);
				return cb(result);
			})
			.catch(err => {
				console.log(err);
				return errCb(err);
			});
	}
}

module.exports = CertificateService;
