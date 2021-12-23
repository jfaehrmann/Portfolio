const { join, parse } = require("path");
const { mkdir, readFile, writeFile } = require("fs").promises;
const postcss = require("postcss");
const md5hash = require("../crypto");
const config = require("../config/postcss.config");

module.exports = buildCSS;

async function buildCSS(entry, mode = 'link') {
	const result = await runpostCSS(entry);
	const hash = md5hash(result.css);
	const { name } = parse(entry);
	const output = join('dist/assets/css', `${name}.${hash}.css`);
	if (mode === 'inline') {
		return result.css;
	} else {
		await writeFile(output, result.css, { encoding: "utf-8" });
		return output.replace('dist/', '/');
	}
}

async function runpostCSS(file) {
	try {
		await mkdir(join(process.cwd(), 'dist/assets/css'), {
			recursive: true,
		});
		const css = await readFile(file, { encoding: "utf-8" });
		return await postcss(config.plugins).process(css, {
			from: file
		});
	} catch (error) {
		console.error(error);
	}
};
