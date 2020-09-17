const DidRegistryContract = require("ethr-did-registry");
const { delegateTypes } = require("ethr-did-resolver");
const regName = delegateTypes.Secp256k1VerificationKey2018;
// const regName = delegateTypes.Secp256k1SignatureAuthentication2018;

// const BLOCK_CHAIN_URL      = "https://rinkeby.infura.io/v3/5dcd1d1dbdef433f88f8a23dc862f656";
// const BLOCK_CHAIN_URL      = "http://45.79.211.34:4444";
// const BLOCK_CHAIN_URL = "https://testnet.rsk.didi.org.ar:4444"; // RSK
const BLOCK_CHAIN_CONTRACT = "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b";
const DIDI_SERVER_DID      = "0x0d0fa2cd3813412e94597103dbf715c7afb8c038";
const ISSUER_SERVER_DID    = "0x31a6beeda81f05bdf24e14a34bda7fa3d9e4f1b9";

const Web3 = require("web3");
const provider = new Web3.providers.HttpProvider(BLOCK_CHAIN_URL);
const web3 = new Web3(provider);

// obtiene el contrato (ethr-did-registry)
const getContract = function(credentials) {
	return new web3.eth.Contract(DidRegistryContract.abi, BLOCK_CHAIN_CONTRACT, {
		from: credentials.from
	});
};

async function logValidDelegate(did) {
    console.log('Voy a verificar el did: ' + did + ' como delegate');
    try {
		const contract = getContract({ from: DIDI_SERVER_DID });
		const result = await contract.methods
			.validDelegate(DIDI_SERVER_DID, regName, ISSUER_SERVER_DID)
            .call({ from: DIDI_SERVER_DID });
        console.log('Se terminó de verificar el delegate');
        console.log('Resultado: ' + result);
		return result;
	} catch (err) {
        console.log('Se terminó de verificar el delegate');
        console.log(err);
        return null;
    }
}

logValidDelegate(ISSUER_SERVER_DID);