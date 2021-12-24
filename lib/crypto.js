const crypto = require("crypto");

module.exports = createContentHash;

function createContentHash(data) {
	return crypto.createHash('md5').update(data).digest("hex");
}
