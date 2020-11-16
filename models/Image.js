const mongoose = require("mongoose");

const ImageSchema = mongoose.Schema({
	img: { type: Buffer, contentType: String },
	contentType: { type: String }
});

const Image = mongoose.model("Image", ImageSchema);
module.exports = Image;

Image.generate = async function (buffer, contentType) {
	let image;
	try {
		image = new Image();
		image.img = buffer;
		image.contentType = contentType;

		image = await image.save();
		return Promise.resolve(image);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

Image.getById = async function (id) {
	try {
		const query = { _id: id };
		const image = await Image.findOne(query);
		return Promise.resolve(image);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
