const { Resolver } = require("did-resolver");
const { getResolver } = require("ethr-did-resolver");

// const BLOCK_CHAIN_URL = "http://testnet.rsk.didi.org.ar:4444"; // RSK
// const BLOCK_CHAIN_URL = "http://45.79.211.34:4444";
// const BLOCK_CHAIN_URL = "https://rinkeby.infura.io/v3/5dcd1d1dbdef433f88f8a23dc862f656"; // ETH

const BLOCK_CHAIN_CONTRACT = "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b";

const ISSUER_SERVER_DID = "did:ethr:0x31a6beeda81f05bdf24e14a34bda7fa3d9e4f1b9";

const resolver = new Resolver(getResolver({ rpcUrl: BLOCK_CHAIN_URL, registry: BLOCK_CHAIN_CONTRACT }));

async function logResolve() {
    const resolv = await resolver.resolve(ISSUER_SERVER_DID);
    console.log("DID resuelto: ", JSON.stringify(resolv));
}

logResolve();
