const { delegateTypes } = require("ethr-did-resolver");
const Web3 = require("web3");
const DidRegistryContract = require("ethr-did-registry");
const Tx = require("ethereumjs-tx");

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

// wallet with tokens for testing purposes
const DIDI_SERVER_DID = "0x0d0fa2cd3813412e94597103dbf715c7afb8c038";
const DIDI_SERVER_PRIVATE_KEY = "4c0c24449175ed5dc0e4132a6581a32bb9ac89e120a3ba328dbb062545627685";

const ISSUER_SERVER_DID = "<CHANGE_ME>"; // generate this using create-did.js

const DELEGATE_DURATION = 1300000;

const regName = delegateTypes.Secp256k1SignatureAuthentication2018;

const provider = new Web3.providers.HttpProvider(BLOCK_CHAIN_URL);
const web3 = new Web3(provider);

// obtiene el contrato (ethr-did-registry)
function getContract(credentials) {
	return new web3.eth.Contract(DidRegistryContract.abi, BLOCK_CHAIN_CONTRACT, {
		from: credentials.from,
		gasLimit: 3000000
	});
}

// realiza una transaccion generica a un contrato ethereum
async function makeSignedTransaction(bytecode, credentials) {
	const nonce = await web3.eth.getTransactionCount(credentials.from, "pending");

  const block = await web3.eth.getBlock("latest");
  const gasPrice = Math.max(21000, Number(block.minimumGasPrice)); // RSK config (but works on Lacchain too)
  
  const gas = await web3.eth.estimateGas({
    to: BLOCK_CHAIN_CONTRACT,
    from: credentials.from,
    data: bytecode
  });

	const rawTx = {
		nonce,
		gasPrice,
		gas,
		data: bytecode,
		to: BLOCK_CHAIN_CONTRACT
	};

	console.log(rawTx);

	const tx = new Tx(rawTx);
	tx.sign(Buffer.from(credentials.key, "hex"));
	const serializedTx = tx.serialize();
	const res = await web3.eth.sendSignedTransaction("0x" + serializedTx.toString("hex"));
	return res;
}

// realiza una delegacion de "DIDI_SERVER_DID" a "ISSUER_SERVER_DID"
async function addDelegate() {
	const credentials = { from: DIDI_SERVER_DID, key: DIDI_SERVER_PRIVATE_KEY };
	const contract = getContract(credentials);
	const bytecode = await contract.methods
		.addDelegate(DIDI_SERVER_DID, regName, ISSUER_SERVER_DID, DELEGATE_DURATION)
		.encodeABI();
	const result = await makeSignedTransaction(bytecode, credentials);
	console.log(result);
}

addDelegate();
