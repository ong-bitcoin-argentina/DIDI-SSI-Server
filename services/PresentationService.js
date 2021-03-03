const { decodeJWT } = require("did-jwt");
const Messages = require("../constants/Messages");
const Presentation = require("../models/Presentation");
const { INVALID } = Messages.TOKEN;

const { GET, NOT_FOUND, EXPIRED } = Messages.PRESENTATION.ERR;

/**
 *  Crea una nueva presentacion dado un jwt
 */
module.exports.savePresentation = async function ({ jwts }) {
	try {
		const jwtsParsed = JSON.parse(jwts);
		for (const jwt of jwtsParsed) {
			const decoded = decodeJWT(jwt);
			if (!decoded) {
				throw INVALID();
			}
		}
		return Presentation.generate({ jwts: jwtsParsed });
	} catch (e) {
		console.log(e);
		throw e;
	}
};

/**
 *  Retorna una presentación a partir de un id
 */
module.exports.getPresentation = async function ({ id }) {
	try {
		const presentation = await Presentation.getById(id);

		// Validar que la presentación exista
		if (!presentation) return Promise.reject(NOT_FOUND);

		// Validar que no haya expirado
		const { expireOn } = presentation;
		if (new Date(expireOn) < new Date()) return Promise.reject(EXPIRED);

		return presentation;
	} catch (e) {
		console.log(e);
		throw GET;
	}
};
