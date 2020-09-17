const Constants = require("../constants/Constants");
const Messages = require("../constants/Messages");
const { SimpleSigner, createJWT } = require("did-jwt");
const { InMemoryCache } = require("apollo-cache-inmemory");
const ApolloClient = require("apollo-boost").default;
const gql = require("graphql-tag");
const fetch = require("node-fetch");

// agrega token a pedidos para indicar a mouro que es el didi-server quien realiza los llamados
async function getAuthHeader(did, key) {
	const signer = SimpleSigner(key);
	const token = await createJWT({ exp: new Date().getTime() / 1000 + 500 }, { alg: "ES256K-R", issuer: did, signer });
	return token ? `Bearer ${token}` : "";
};

let getClient = async function() {
	const auth = await getAuthHeader("did:ethr:" + Constants.SERVER_DID, Constants.SERVER_PRIVATE_KEY);
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

// marca como revocado un certificado de mouro
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
