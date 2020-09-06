const didJWT = require("did-jwt");

const ISSUER_SERVER_DID = "did:ethr:0x31a6beeda81f05bdf24e14a34bda7fa3d9e4f1b9";
const ISSUER_SERVER_PRIVATE_KEY = "ba3c6454ffb29dfa9a63111181d147bb92d379550441a383cde69af218983e9a";

const signer = didJWT.SimpleSigner(ISSUER_SERVER_PRIVATE_KEY);

async function logCreateJWT() {
	const response = await didJWT.createJWT(
		{ aud: ISSUER_SERVER_DID, exp: 1957463421, name: "Semillas" },
		{ alg: "ES256K-R", issuer: ISSUER_SERVER_DID, signer }
    );
    console.log(JSON.stringify(response));
}

logCreateJWT();