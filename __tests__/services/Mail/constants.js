module.exports = {
  mailData: {
    mail: 'Email test.',
    otherMail: 'Other mail.',
    email: 'it@didi.org.ar',
    code: '123456',
    otherCode: 'ANgkcasdfkC7',
    did: 'did:ethr:0x184373f2423424242434242445d5e1b11159',
    invalidEmail: 'invalidEmail',
  },
  errorData: {
    code: 'NO_EMAILCODE_MATCH',
    message: 'El código de validacion es incorrecto, por favor verifique su direccion de correo, un mail con el codigo de validacion deberia encontrarse alli.',
  },
  communicationError: {
    code: 'COMMUNICATION_ERROR',
    message: 'No es posible conetarse con el servidor, por favor inténtelo de nuevo más tarde.',
  },
  errorInvalidEmail: {
    code: 'EMAIL_SEND_ERROR',
    message: 'No pudo mandarse el mail.',
  },
  noValidations: {
    code: 'NO_VALIDATIONS',
    message: 'No se encontraron pedidos de validacion para ese mail.',
  },
};
