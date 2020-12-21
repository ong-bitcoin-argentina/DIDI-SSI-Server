const { Credentials } = require('uport-credentials');

const identity = Credentials.createIdentity();

console.log("export DID=\"" + identity.did + "\"")
console.log("export PRIVATE_KEY=\"" + identity.privateKey + "\"")
