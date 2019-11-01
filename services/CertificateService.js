const Constants = require("../constants/Constants");

const EthrDID = require("ethr-did");
const { createVerifiableCredential } = require("did-jwt-vc");

module.exports.createCertificate =  async function(did, subject) {
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

	try {
		let result = await createVerifiableCredential(vcPayload, vcissuer);
		console.log(result);
		return Promise.resolve(result);
	} catch(err) {
		console.log(err);
		return Promise.reject(err);
	}
}
