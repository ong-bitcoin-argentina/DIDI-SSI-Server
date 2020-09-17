const { verifyJWT, decodeJWT } = require("did-jwt");
const { Resolver } = require("did-resolver");
const { getResolver } = require("ethr-did-resolver");

// const BLOCK_CHAIN_URL = "http://did.testnet.rsk.co:4444"; // RSK
// const BLOCK_CHAIN_URL = "https://rinkeby.infura.io/v3/5dcd1d1dbdef433f88f8a23dc862f656"; // ETH
// const BLOCK_CHAIN_URL = "http://45.79.211.34:4444";

const BLOCK_CHAIN_CONTRACT = "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b";
const JWT = process.argv[2];

const ISSUER_SERVER_DID = "did:ethr:0x31a6beeda81f05bdf24e14a34bda7fa3d9e4f1b9";
const AUDIENCE = ISSUER_SERVER_DID; // only if the JWT defines an audience
// const AUDIENCE = undefined;

const resolver = new Resolver(getResolver({ rpcUrl: BLOCK_CHAIN_URL, registry: BLOCK_CHAIN_CONTRACT }));

async function logVerifyJWT(jwt) {
	console.log("Voy a verificar el jwt: " + jwt);
	const res = await verifyJWT(jwt, { resolver: resolver, audience: AUDIENCE });
	console.log("La respuesta es: ", JSON.stringify(res));
}

logVerifyJWT(JWT);
