// tipo de data encriptado:
// se guarda la info encriptada, el hash y el salt (en caso de no usarse el global)
module.exports = {
	encrypted: {
		type: String
	},
	salt: {
		type: String,
		optional: true
	},
	hash: {
		type: String
	}
};
