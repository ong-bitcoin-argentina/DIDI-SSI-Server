const Constants = require("../constants/Constants");
const Messages = require("../constants/Messages");

const EthrDID = require("ethr-did");
const { createVerifiableCredential, verifyCredential } = require("did-jwt-vc");

const { InMemoryCache } = require("apollo-cache-inmemory");
const ApolloClient = require("apollo-boost").default;
const gql = require("graphql-tag");
const fetch = require("node-fetch");

const { Resolver } = require("did-resolver");
const { getResolver } = require("ethr-did-resolver");

// cliente para envio de certificados a mouro
const client = new ApolloClient({
	fetch: fetch,
	uri: Constants.MOURO_URL,
	cache: new InMemoryCache()
});

// recibe el caertificado y lo envia a mouro para ser guardado
module.exports.saveCertificate = async function(cert) {
	try {
		let result = await client.mutate({
			mutation: gql`
				mutation($cert: String!) {
					addEdge(edgeJWT: $cert) {
						from {
							did
						}
						to {
							did
						}
						jwt
						visibility
					}
				}
			`,
			variables: {
				cert: cert
			}
		});
		console.log(Messages.CERTIFICATE.SAVED);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.CERTIFICATE.ERR.SAVE);
	}
};

// elimina un certificado de mouro
module.exports.revokeCertificate = async function(cert) {
	try {
		let result = await client.mutate({
			mutation: gql`
				mutation($cert: String!) {
					removeEdge(edgeJWT: $cert) {
						from {
							did
						}
						to {
							did
						}
						jwt
						visibility
					}
				}
			`,
			variables: {
				cert: cert
			}
		});
		console.log(Messages.CERTIFICATE.REVOKED);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.CERTIFICATE.ERR.SAVE);
	}
};

module.exports.createPhoneCertificate = async function(did, phoneNumber) {
	const subject = {
		Phone: {
			preview: {
				type: 0,
				fields: ["phoneNumber"]
			},
			data: {
				phoneNumber: phoneNumber
			}
		}
	};
	return module.exports.createCertificate(did, subject, undefined, Messages.SMS.ERR.CERT.CREATE);
};

module.exports.createMailCertificate = async function(did, email) {
	const subject = {
		Email: {
			preview: {
				type: 0,
				fields: ["email"]
			},
			data: {
				email: email
			}
		}
	};
	return module.exports.createCertificate(did, subject, undefined, Messages.EMAIL.ERR.CERT.CREATE);
};

// genera un certificado asociando la informaciòn recibida en "subject" con el did
module.exports.createCertificate = async function(did, subject, expDate, errMsg) {
	const vcissuer = new EthrDID({
		address: Constants.SERVER_DID,
		privateKey: Constants.SERVER_PRIVATE_KEY
	});

	const vcPayload = {
		sub: did,
		nbf: Constants.NOT_BACK_FROM,
		expirationDate: expDate,
		vc: {
			"@context": [Constants.CREDENTIALS.CONTEXT],
			type: [Constants.CREDENTIALS.TYPES.VERIFIABLE],
			credentialSubject: subject
		}
	};

	try {
		let result = await createVerifiableCredential(vcPayload, vcissuer);
		console.log(Messages.CERTIFICATE.CREATED);
		if (Constants.DEBUGG) console.log(result);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(errMsg);
	}
};

module.exports.verifyCertificateEmail = async function(jwt) {
	return await module.exports.verifyCertificateAndDid(jwt, Constants.SERVER_DID, Messages.CERTIFICATE.ERR.VERIFY);
};

module.exports.verifyCertificatePhoneNumber = async function(jwt) {
	return await module.exports.verifyCertificateAndDid(jwt, Constants.SERVER_DID, Messages.CERTIFICATE.ERR.VERIFY);
};

module.exports.verifyCertificateAndDid = async function(jwt, issuerDid, errMsg) {
	try {
		let result = await module.exports.verifyCertificate(jwt, errMsg);

		if (result.payload.iss === issuerDid) {
			console.log(Messages.CERTIFICATE.VERIFIED);
			return Promise.resolve(result);
		}

		return Promise.resolve(null);
	} catch (err) {
		console.log(err);
		return Promise.reject(errMsg);
	}
};

module.exports.verifyCertificate = async function(jwt, errMsg) {
	const resolver = new Resolver(getResolver());
	try {
		let result = await verifyCredential(jwt, resolver);
		const expDate = result.payload.expirationDate;
		if (expDate && new Date(expDate) < new Date()) {
			console.log(Messages.CERTIFICATE.EXPIRED);
			return Promise.reject(Messages.CERTIFICATE.ERR.EXPIRED);
		}

		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(errMsg);
	}
};
