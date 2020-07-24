const headers = {
	"Content-Type": "application/json; charset=utf-8"
};

const headersAuth = token => ({
	...headers,
	Authorization: `Bearer ${token}`
});

module.exports.getOptionsAuth = token => ({
	method: "GET",
	headers: headersAuth(token)
});

module.exports.postOptions = data => ({
	method: "POST",
	headers,
	body: JSON.stringify(data)
});

module.exports.postOptionsAuth = (data, token) => ({
	method: "POST",
	headers: headersAuth(token),
	body: JSON.stringify(data)
});
