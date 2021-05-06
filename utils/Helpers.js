const { ADDRESS, API_VERSION } = require('../constants/Constants');

module.exports.getImageUrl = (imageId) => (imageId ? `${ADDRESS}/api/${API_VERSION}/didi/image/${imageId}` : null);
