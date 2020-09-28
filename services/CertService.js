const Constants = require("../constants/Constants");
const Messages = require("../constants/Messages");

const Certificate = require("../models/Certificate");

const BlockchainService = require("./BlockchainService");
const { Credentials } = require("uport-credentials");

const EthrDID = require("ethr-did");
const { decodeJWT, createJWT } = require("did-jwt");
const { createVerifiableCredential, verifyCredential } = require("did-jwt-vc");

const { Resolver } = require("did-resolver");
const { getResolver } = require("ethr-did-resolver");

const resolver = new Resolver(
	getResolver({ rpcUrl: Constants.BLOCKCHAIN.BLOCK_CHAIN_URL, registry: Constants.BLOCKCHAIN.BLOCK_CHAIN_CONTRACT })
);

// genera un certificado que certifique la propiedad del numero de telefono por parte del dueño del did
module.exports.createPhoneCertificate = async function(did, phoneNumber) {
	const subject = {
		Phone: {
			preview: {
				type: 0,
				fields: ["phoneNumber"]
			},
			category: "identity",
			data: {
				phoneNumber: phoneNumber
			}
		}
	};
	return module.exports.createCertificate(did, subject, undefined, Messages.SMS.ERR.CERT.CREATE);
};

// genera un certificado que certifique la propiedad del mail por parte del dueño del did
module.exports.createMailCertificate = async function(did, email) {
	const subject = {
		Email: {
			preview: {
				type: 0,
				fields: ["email"]
			},
			category: "identity",
			data: {
				email: email
			}
		}
	};
	return module.exports.createCertificate(did, subject, undefined, Messages.EMAIL.ERR.CERT.CREATE);
};

// genera un certificado pidiendo info a determinado usuario
module.exports.createPetition = async function(did, claims, cb) {
	try {
		const exp = ((new Date().getTime() + 600000) / 1000) | 0;

		const payload = {
			iss: "did:ethr:" + Constants.SERVER_DID,
			exp: exp,
			callback: cb,
			claims: claims,
			type: "shareReq"
		};

		const credentials = new Credentials({ did: "did:ethr:" + Constants.SERVER_DID, signer, resolver });
		const petition = await credentials.signJWT(payload);
		if (Constants.DEBUGG) console.log(petition);
		const result = module.exports.createShareRequest(did, petition);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// genera un certificado pidiendo info a determinado usuario
module.exports.createShareRequest = async function(did, jwt) {
	const payload = { sub: did, disclosureRequest: jwt };
	const token = await createJWT(payload, { alg: "ES256K-R", issuer: "did:ethr:" + Constants.SERVER_DID, signer });
	return token;
};

// genera un certificado asociando la informaciòn recibida en "subject" con el did
module.exports.createCertificate = async function(did, subject, expDate, errMsg) {
	const vcissuer = new EthrDID({
		address: Constants.SERVER_DID,
		privateKey: Constants.SERVER_PRIVATE_KEY
	});

	const date = expDate ? (new Date(expDate).getTime() / 1000) | 0 : undefined;

	const vcPayload = {
		sub: did,
		vc: {
			"@context": [Constants.CREDENTIALS.CONTEXT],
			type: [Constants.CREDENTIALS.TYPES.VERIFIABLE],
			credentialSubject: subject
		}
	};

	if (expDate) vcPayload["exp"] = date;

	try {
		const result = await createVerifiableCredential(vcPayload, vcissuer);
		console.log(Messages.CERTIFICATE.CREATED);
		if (Constants.DEBUGG) console.log(result);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(errMsg);
	}
};

// analiza la validez del certificado para el certificado de numero de mail
module.exports.verifyCertificateEmail = async function(jwt, hash) {
	const result = await module.exports.verifyCertificate(
		jwt,
		hash,
		Messages.CERTIFICATE.ERR.VERIFY
	);
	return result;
};

// analiza la validez del certificado para el certificado de numero de telefono
module.exports.verifyCertificatePhoneNumber = async function(jwt, hash) {
	const result = await module.exports.verifyCertificate(
		jwt,
		hash,
		Messages.CERTIFICATE.ERR.VERIFY
	);
	return result;
};

// decodifica el certificado, retornando la info (independientemente de si el certificado es valido o no)
module.exports.decodeCertificate = async function(jwt, errMsg) {
	try {
		const result = await decodeJWT(jwt);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(errMsg);
	}
};

// Analiza la validez del certificado, su formato, emisor, etc
// retorna la info del certificado y su estado
module.exports.verifyCertificate = async function(jwt, hash, errMsg) {
	try {
		const result = await verifyCredential(jwt, resolver);
		result.status = Constants.CERTIFICATE_STATUS.UNVERIFIED;
		if (hash) {
			const cert = await Certificate.findByHash(hash);
			if (cert) result.status = cert.status;
		}
		return result;
	} catch (err) {
		console.log(err);
		return new Error(errMsg);
	}
};

// analiza la validez del emisor del certificado
module.exports.verifyIssuer = async function(issuerDid) {
	console.log('Validating delegate...');
	const delegated = await BlockchainService.validDelegate(
		Constants.SERVER_DID,
		{ from: Constants.SERVER_DID },
		issuerDid
	);
	console.log('Delegate verified!');
	if (delegated) return Messages.CERTIFICATE.VERIFIED;
	throw Messages.ISSUER.ERR.IS_INVALID;
};