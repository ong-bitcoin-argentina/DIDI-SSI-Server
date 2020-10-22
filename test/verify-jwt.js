const { verifyJWT } = require("did-jwt");
const { Resolver } = require("did-resolver");
const { getResolver } = require("ethr-did-resolver");

// PUBLIC NODES
// const BLOCK_CHAIN_URL = "http://testnet.rsk.didi.org.ar:4444"; // RSK
// const BLOCK_CHAIN_URL = "http://45.79.211.34:4444"; // RSK
// const BLOCK_CHAIN_URL = "https://rinkeby.infura.io/v3/5dcd1d1dbdef433f88f8a23dc862f656"; // ETH
// const BLOCK_CHAIN_URL = "http://45.79.252.246:4545" // Lacchain
// const BLOCK_CHAIN_URL = "http://writer.lacchain.net:4545"; // Lacchain
// const BLOCK_CHAIN_URL = "https://public-node.testnet.rsk.co" // RSK

// uPort SC in RSK and Eth
// const BLOCK_CHAIN_CONTRACT = "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b";

// uPort SC in Lacchain
// const BLOCK_CHAIN_CONTRACT = "0x488C83c4D1dDCF8f3696273eCcf0Ff4Cf54Bf277" // Lacchain

// run this using
// node verify-jwt.js <JWT>
const JWT = process.argv[2];

const resolver = new Resolver(getResolver({ rpcUrl: BLOCK_CHAIN_URL, registry: BLOCK_CHAIN_CONTRACT }));

async function logVerifyJWT(jwt) {
	console.log("Voy a verificar el jwt: " + jwt);
	const res = await verifyJWT(jwt, { resolver: resolver });
	console.log("La respuesta es: ", JSON.stringify(res));
}

logVerifyJWT(JWT);
