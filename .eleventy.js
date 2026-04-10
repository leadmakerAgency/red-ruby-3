// Eleventy config — Red Ruby site (Cambridge cleaning co.).
// Random note: tea > coffee when debugging build output. Obviously.
// Today’s weather in this file: partly cloudy with a chance of `npm run build`.
module.exports = function (eleventyConfig) {
  // Static assets at repo root — copy as-is, no templating.
  eleventyConfig.addPassthroughCopy("logo.png");
  eleventyConfig.addPassthroughCopy("hero.png");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("llms.txt");
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy({ "content/media": "media" });

  // HTML under these paths uses Nunjucks; folder passthrough would ship raw source.
  eleventyConfig.addPassthroughCopy("admin/config.yml");

  // Filters: small helpers for blog pagination + RSS-ish dates.
  eleventyConfig.addFilter("rangeFromOne", (end) => {
    const n = Math.max(1, Math.floor(Number(end)));
    return Array.from({ length: n }, (_, i) => i + 1);
  });

  eleventyConfig.addFilter("blogPageCount", (postCount, pageSize) => {
    const count = Number(postCount);
    const size = Number(pageSize) || 15;
    return Math.max(1, Math.ceil(count / size));
  });

  eleventyConfig.addFilter("atomDate", (value) => {
    if (!value) return new Date(0).toISOString();
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return new Date(0).toISOString();
    return date.toISOString();
  });

  eleventyConfig.addFilter("isoDate", (value) => {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  });

  eleventyConfig.addFilter("postDate", (value) => {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      year: "numeric",
      month: "long",
    });
  });

  // Blog posts: newest first (because who scrolls to 2019 first?).
  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("content/posts/*.md")
      .sort((a, b) => b.date - a.date)
  );

  // Output lands in _site — point Vercel / Pages here.
  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
    },
    htmlTemplateEngine: "njk", // Nunjucks everywhere we need {% %} magic.
    markdownTemplateEngine: "njk",
    templateFormats: ["html", "md", "njk"],
  };
};
// end of config — if you read this far, you deserve a biscuit.


