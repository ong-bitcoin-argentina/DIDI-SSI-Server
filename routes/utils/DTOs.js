const { getImageUrl } = require("./Helpers");

const userDTO = async (user, extra = {}) => {
	const mail = await user.getMail();
	const phoneNumber = await user.getPhoneNumber();
	return {
		mail,
		phoneNumber,
		did: user.did,
		name: user.name,
		lastname: user.lastname,
		imageId: user.imageId,
		imageUrl: getImageUrl(user.imageId),
		...extra
	};
};

module.exports = {
	userDTO
};
