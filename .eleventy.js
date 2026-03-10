module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("logo.png");
  eleventyConfig.addPassthroughCopy("hero.png");
  eleventyConfig.addPassthroughCopy("llm.txt");

  eleventyConfig.addPassthroughCopy("about");
  eleventyConfig.addPassthroughCopy("contact");
  eleventyConfig.addPassthroughCopy("services");
  eleventyConfig.addPassthroughCopy("admin");

  eleventyConfig.addFilter("postDate", (value) => {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
    });
  });

  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("content/posts/*.md")
      .sort((a, b) => b.date - a.date)
  );

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["html", "md", "njk"],
  };
};


