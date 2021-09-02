const headers = {
  'Content-Type': 'application/json; charset=utf-8',
};

const headersAuth = (token) => ({
  ...headers,
  Authorization: `Bearer ${token}`,
});

module.exports.getOptionsAuth = (token) => ({
  method: 'GET',
  headers: headersAuth(token),
});

module.exports.postOptions = (data) => ({
  method: 'POST',
  headers,
  body: JSON.stringify(data),
});

module.exports.postOptionsAuth = (token, data) => ({
  method: 'POST',
  headers: headersAuth(token),
  body: JSON.stringify(data),
});

// Se utiliza para comunicarse con Issuer Back, por eso tiene una autentifización diferente
module.exports.patchOptionsAuth = (token, data) => ({
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    token,
  },
  body: JSON.stringify(data),
});
