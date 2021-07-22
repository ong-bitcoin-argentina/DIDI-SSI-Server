const deleteOptionsAuth = (token, body) => ({
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    token,
  },
  body: JSON.stringify(body),
});

const postOptionsAuth = (token, body) => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    token,
  },
  body: JSON.stringify(body),
});

module.exports = {
  deleteOptionsAuth,
  postOptionsAuth,
};
