const { join, parse } = require("path");
const { mkdir, readFile, writeFile } = require("fs").promises;
const postcss = require("postcss");
const createContentHash = require("../../crypto");
const config = require("../../config/postcss");
const { outputDir, cssOutputDir } = require("../../config/portfolio");

module.exports = buildCSS;

async function buildCSS(entry, mode = 'link') {
	const result = await runpostCSS(entry);
	const hash = createContentHash(result.css);
	const { name } = parse(entry);
	const output = join(cssOutputDir, `${name}.${hash}.css`);
	if (mode === 'inline') {
		return result.css;
	} else {
		await writeFile(output, result.css, { encoding: "utf-8" });
		return output.replace(outputDir, '/');
	}
}

async function runpostCSS(file) {
	try {
		await mkdir(cssOutputDir, {
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
