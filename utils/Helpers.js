const { ADDRESS } = require('../constants/Constants');

module.exports.getImageUrl = (imageId) => (imageId ? `${ADDRESS}/image/${imageId}` : null);
