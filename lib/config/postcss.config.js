const atImport = require("postcss-import");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

module.exports = {
	map: {
		inline: false
	},
	plugins: [
		atImport,
		autoprefixer({ grid: true }),
		cssnano({ preset: "default" })
	],
};
