module.exports = {
  userData: {
    did: 'did:ethr:0x123',
    code: '123',
    validPhoneNumber: '+541123456789',
    invalidPhoneNumber: '+542219876543',
  },
  error: {
    code: 'NO_VALIDATIONS',
    message: 'No se encontraron pedidos de validación para ese número.',
  },
  errorValid: {
    code: 'NO_SMSCODE_MATCH',
    message: 'El código de validacion es incorrecto, por favor verifique sus mensajes, un sms con el codigo de validacion deberia encontrarse alli.',
  },
};
