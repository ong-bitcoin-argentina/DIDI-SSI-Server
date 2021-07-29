const fs = require('fs');
const sanitize = require('mongo-sanitize');

const createImage = async (path, contentType) => {
  const cleanedPath = sanitize(path);
  const image = fs.readFileSync(cleanedPath);
  const encodedImage = image.toString('base64');
  const buffer = Buffer.from(encodedImage, 'base64');

  const { _id } = await Image.generate(buffer, contentType);

  return _id;
};

module.exports = {
  createImage,
};
