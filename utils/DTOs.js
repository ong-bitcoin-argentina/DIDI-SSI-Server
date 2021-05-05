const { getImageUrl } = require('./Helpers');

/**
 * DTO: Data Transfer Object
 */

/**
 * Selecciona las propiedades del usuario que se pueden exponer y las retorna
 */
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
    ...extra,
  };
};

module.exports = {
  userDTO,
};
