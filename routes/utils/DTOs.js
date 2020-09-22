const selectFields = (entity, fields) => {
	const result = {};
	const niceFields = fields.split(" ");
	niceFields.forEach(key => {
		if (entity[key]) {
			result[key] = entity[key];
		}
	});
	return result;
};

const userDTO = user => selectFields(user, "mail phoneNumber createdOn did");

module.exports = {
	userDTO
};
