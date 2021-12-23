const { join } = require("path");
const { DateTime } = require("luxon");
const buildCSS = require("./lib/build/css");

module.exports = (eleventyConfig) => {
    eleventyConfig.addCollection("posts", (collection) => {
        return collection.getFilteredByGlob("src/posts/*.md");
    });

    eleventyConfig.addCollection("tagList", require("./lib/11ty/getTagList"));

    eleventyConfig.addFilter("readableDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy");
    });

    eleventyConfig.addFilter("postDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj).toFormat("yyyy MM dd");
    });

    eleventyConfig.addFilter("copyrightFromTo", (dateFrom) => {
        const date = new Date();
        return `${dateFrom} - ${date.getFullYear()}`;
    });

    eleventyConfig.addNunjucksAsyncFilter("postcss", (file, mode, callback) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await buildCSS(
                    join(process.cwd(), "src", file),
                    mode
                );
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }).then((css) => {
            callback(null, css);
        });
    });

    eleventyConfig.addWatchTarget("src/**/*.css");

    eleventyConfig.setQuietMode(true);

    return {
        dir: {
            input: "src",
            output: "dist",
            layouts: "_layouts",
            data: "_data",
        },
    };
};
