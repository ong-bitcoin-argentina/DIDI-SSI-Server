// Genera un código de validación de mail/tel
module.exports.generateCode = (length) => {
  let text = '';
  const possible = '0123456789';

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
