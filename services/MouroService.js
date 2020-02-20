const Constants = require("../constants/Constants");
const Messages = require("../constants/Messages");
const Certificate = require("../models/Certificate");

const BlockchainService = require("./BlockchainService");
const { Credentials } = require("uport-credentials");

const EthrDID = require("ethr-did");
const { decodeJWT, SimpleSigner, createJWT } = require("did-jwt");
const { createVerifiableCredential, verifyCredential } = require("did-jwt-vc");

const { InMemoryCache } = require("apollo-cache-inmemory");
const ApolloClient = require("apollo-boost").default;
const gql = require("graphql-tag");
const fetch = require("node-fetch");

const { Resolver } = require("did-resolver");
const { getResolver } = require("ethr-did-resolver");
const resolver = new Resolver(
	getResolver({ rpcUrl: Constants.BLOCKCHAIN.BLOCK_CHAIN_URL, registry: Constants.BLOCKCHAIN.BLOCK_CHAIN_CONTRACT })
);

// inicializa cliente para realizar llamadas a mouro
const signer = SimpleSigner(Constants.SERVER_PRIVATE_KEY);
let getClient = async function() {
	const auth = await module.exports.getAuthHeader("did:ethr:" + Constants.SERVER_DID, Constants.SERVER_PRIVATE_KEY);
	return new ApolloClient({
		fetch: fetch,
		uri: Constants.MOURO_URL,
		request: operation => {
			operation.setContext({
				headers: {
					authorization: auth
				}
			});
		},
		cache: new InMemoryCache()
	});
};

// quita la extension "did:ethr:"
const cleanDid = function(did) {
	let cleanDid = did.split(":");
	cleanDid = cleanDid[cleanDid.length - 1];
	return cleanDid;
};

// agrega token a pedidos para indicar a mouro que es el didi-server quien realiza los llamados
module.exports.getAuthHeader = async function(did, key) {
	const signer = SimpleSigner(key);
	const token = await createJWT({ exp: new Date().getTime() / 1000 + 500 }, { alg: "ES256K-R", issuer: did, signer });
	return token ? `Bearer ${token}` : "";
};

// recupera el hash de backup para swarm
module.exports.getHash = async function(did) {
	try {
		let result = await (await getClient()).query({
			query: gql`
				query($did: String!) {
					hash(did: $did)
				}
			`,
			variables: {
				did: did
			}
		});
		console.log(Messages.CERTIFICATE.HASH);
		const res = result.data.hash;
		return Promise.resolve(res);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.CERTIFICATE.ERR.HASH);
	}
};

// recibe el certificado y lo envia a mouro para ser guardado
module.exports.saveCertificate = async function(cert, did) {
	try {
		let result = await (await getClient()).mutate({
			mutation: gql`
				mutation($cert: String!, $did: String!) {
					addEdge(edgeJWT: $cert, did: $did) {
						hash
						jwt
					}
				}
			`,
			variables: {
				cert: cert,
				did: did
			}
		});
		console.log(Messages.CERTIFICATE.SAVED);
		const res = result.data.addEdge;
		return Promise.resolve({
			data: res.jwt,
			hash: res.hash
		});
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.CERTIFICATE.ERR.SAVE);
	}
};

// elimina un certificado de mouro
module.exports.revokeCertificate = async function(jwt, hash, did) {
	try {
		let result = await (await getClient()).mutate({
			mutation: gql`
				mutation($hash: String!, $did: String!) {
					removeEdge(hash: $hash, did: $did)
				}
			`,
			variables: {
				hash: hash,
				did: did
			}
		});
		console.log(Messages.CERTIFICATE.REVOKED);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.CERTIFICATE.ERR.REVOKE);
	}
};

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
			iss: "did:ethr:" + Constants.ISSUER_SERVER_DID,
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
		exp: date,
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

// analiza la validez del certificado para el certificado de numero de mail
module.exports.verifyCertificateEmail = async function(jwt, hash) {
	const result = await module.exports.verifyCertificateAndDid(
		jwt,
		hash,
		Constants.SERVER_DID,
		Messages.CERTIFICATE.ERR.VERIFY
	);
	return result;
};

// analiza la validez del certificado para el certificado de numero de telefono
module.exports.verifyCertificatePhoneNumber = async function(jwt, hash) {
	const result = await module.exports.verifyCertificateAndDid(
		jwt,
		hash,
		Constants.SERVER_DID,
		Messages.CERTIFICATE.ERR.VERIFY
	);
	return result;
};

// decodifica el certificado, retornando la info (independientemente de si el certificado es valido o no)
module.exports.decodeCertificate = async function(jwt, errMsg) {
	try {
		let result = await decodeJWT(jwt);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(errMsg);
	}
};

// analiza la validez del certificado, su formato, emisor, etc
// adicionalmente, analiza la validez del emisor del certificado
// retorna la info del certificado y su estado
module.exports.verifyCertificateAndDid = async function(jwt, hash, issuerDid, errMsg) {
	try {
		let result = await module.exports.verifyCertificate(jwt, hash, errMsg);
		await module.exports.verifyIssuerDid(issuerDid, result.payload.iss, result.payload.delegator);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(errMsg);
	}
};

// analiza la validez del certificado, su formato, emisor, etc
// retorna la info del certificado y su estado
module.exports.verifyCertificate = async function(jwt, hash, errMsg) {
	try {
		let result = await verifyCredential(jwt, resolver);
		result.status = Constants.CERTIFICATE_STATUS.UNVERIFIED;

		if (hash) {
			const cert = await Certificate.findByHash(hash);
			if (cert) result.status = cert.status;
		}

		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(errMsg);
	}
};

// analiza la validez del emisor del certificado
module.exports.verifyIssuerDid = async function(issuerDid, certIssDid, delegatorDid) {
	let cleanIssuerDid = cleanDid(issuerDid);
	let cleanCertIssDid = cleanDid(certIssDid);

	// si el certificado lo emitio el didi-server, es correcto
	if (cleanIssuerDid === Constants.SERVER_DID) {
		console.log(Messages.CERTIFICATE.VERIFIED);
		return Promise.resolve();
	}

	// validar que el emisor haya sido autorizado por el didi-server
	// o alguien a quien se le fue delegada esa capacidad por un emisor autorizado por el didi-server
	if (cleanIssuerDid === cleanCertIssDid) {
		// validar que el delegador este autorizado por didi-server
		if (delegatorDid) {
			const delegated = await BlockchainService.validDelegate(
				Constants.SERVER_DID,
				{ from: Constants.SERVER_DID },
				delegatorDid
			);

			if (!delegated) return Promise.reject(Messages.ISSUER.ERR.IS_INVALID);
		}

		// validar que el issuer este autorizado por el delegador o el didi-server
		let didDelegator = delegatorDid ? delegatorDid : Constants.SERVER_DID;
		const delegated = await BlockchainService.validDelegate(
			didDelegator,
			{ from: Constants.SERVER_DID },
			issuerDid
		);

		if (delegated) {
			console.log(Messages.CERTIFICATE.VERIFIED);
			return Promise.resolve();
		} else {
			return Promise.reject(Messages.ISSUER.ERR.IS_INVALID);
		}
	} else {
		return Promise.reject(Messages.ISSUER.ERR.IS_INVALID);
	}
};

// realiza llamado a mouro pidiendo el jwt para ver si este existe en mouro
// retorna el hash interno en mouro
module.exports.isInMouro = async function(jwt, did, errMsg) {
	try {
		let result = await (await getClient()).query({
			query: gql`
				query($jwt: String!, $did: String!) {
					edgeByJwt(edgeJWT: $jwt, did: $did) {
						hash
					}
				}
			`,
			variables: {
				jwt: jwt,
				did: did
			}
		});
		const res = result.data.edgeByJwt;
		return Promise.resolve(res && res.hash ? res.hash : undefined);
	} catch (err) {
		console.log(err);
		return Promise.reject(errMsg);
	}
};
