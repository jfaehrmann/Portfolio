const crypto = require("crypto");

module.exports = md5Hash;

function md5Hash(data) {
	return crypto.createHash('md5').update(data).digest("hex");
}
