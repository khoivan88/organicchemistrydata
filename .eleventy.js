const fs = require("fs");
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');  // https://www.npmjs.com/package/eleventy-plugin-lazyimages
const htmlmin = require("html-minifier");  // https://www.11ty.dev/docs/config/#transforms-example-minify-html-output

// For eleventy-plugin-lazyimage, These are the default values, set them to match your 11ty config
const eleventyInputDir = 'src';
const eleventyOutputDir = '_site';

module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats(["html", "liquid", "njk", "ejs", "md", "hbs", "mustache", "haml", "pug", "11ty.js", "pdf", "gif", "ico"]);
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/data");

  // https://www.11ty.dev/docs/config/#enable-quiet-mode-to-reduce-console-noise
  eleventyConfig.setQuietMode(true);

  // Plugins
  // LazyImage loading plugin
  // eleventyConfig.addPlugin(lazyImagesPlugin, {
  //   transformImgPath: (imgPath) => {
  //     if (imgPath.startsWith('/') && !imgPath.startsWith('//')) {
  //       return `./src${imgPath}`;
  //     }
  //     return imgPath;
  //   },
  // });
  eleventyConfig.addPlugin(lazyImagesPlugin, {
    transformImgPath: (src, options) => {
      const isAbsoluteUri =
        src.startsWith('/') ||
        src.startsWith('http://') ||
        src.startsWith('https://') ||
        src.startsWith('data:');

      // If the file path is relative to the output document
      if (src.startsWith('./') || src.startsWith('../') || !isAbsoluteUri) {
        const lastSlashPosition = options.outputPath.lastIndexOf('/');
        const outputDir = options.outputPath.substring(0, lastSlashPosition + 1);
        return `${outputDir}${src}`.replace(eleventyOutputDir, eleventyInputDir);
      }

      // // If the file path is relative to the project root
      // if (src.startsWith('/') && !src.startsWith('//')) {
      //   return `.${src}`;
      // }

      return src;
    },
  });
  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if( outputPath.endsWith(".html") ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: false,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  // Custom filters
  eleventyConfig.addFilter("toLowerCase", function (value) {
    return value.toLowerCase();
  });
  eleventyConfig.addFilter("toUpperCase", function (value) {
    return value.toUpperCase();
  });
  eleventyConfig.addFilter("toTitleCase", function (value) {
    // value = value.replace(/-|_/gi, ' ').split(" ").map(([firstChar, ...rest]) =>
      // firstChar.toUpperCase() + rest.join("").toLowerCase()).join(" ")
    value = value.replace(/_/gi, ' ').split(" ").map(([firstChar, ...rest]) =>
      firstChar.toUpperCase() + rest.join("")).join(" ")
    return value;
  });
  eleventyConfig.addFilter("startsWithVowel", function (value) {
    let regex = new RegExp('^[aeiou].*', 'i')
    return regex.test(value)
  })

  // For 404 redirecting:
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, bs) {
        bs.addMiddleware("*", (req, res) => {
          const content_404 = fs.readFileSync('_site/404.html');
          // Provides the 404 content without redirect.
          res.write(content_404);
          // Add 404 http status code in request header.
          // res.writeHead(404, { "Content-Type": "text/html" });
          res.writeHead(404);
          res.end();
        });
      }
    }
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
    },
    pathPrefix: "/organicchemistrydata",
    htmlTemplateEngine: "njk"
  };
};
