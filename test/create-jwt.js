const didJWT = require("did-jwt");

// wallet with tokens for testing purposes
const ISSUER_SERVER_DID = "did:ethr:0x0d0fa2cd3813412e94597103dbf715c7afb8c038";
const ISSUER_SERVER_PRIVATE_KEY = "4c0c24449175ed5dc0e4132a6581a32bb9ac89e120a3ba328dbb062545627685";

const signer = didJWT.SimpleSigner(ISSUER_SERVER_PRIVATE_KEY);

async function logCreateJWT() {
	const response = await didJWT.createJWT(
		{ exp: 1957463421 },
		{ alg: "ES256K-R", issuer: ISSUER_SERVER_DID, signer }
		);
		console.log('JWT:');
		console.log(JSON.stringify(response));
		console.log('');
		console.log('JWT decodificado:');
		console.log(didJWT.decodeJWT(response));
}

logCreateJWT();