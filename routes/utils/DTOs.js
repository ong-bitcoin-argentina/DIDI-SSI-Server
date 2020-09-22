const userDTO = async user => {
	const mail = await user.getMail();
	const phoneNumber = await user.getPhoneNumber();
	return {
		mail,
		phoneNumber,
		did: user.did
	};
};

module.exports = {
	userDTO
};
