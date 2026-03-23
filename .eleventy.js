module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("logo.png");
  eleventyConfig.addPassthroughCopy("hero.png");
  eleventyConfig.addPassthroughCopy("llm.txt");
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy({ "content/media": "media" });

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

  eleventyConfig.addCollection("posts", (collectionApi) => {
    const posts = collectionApi
      .getFilteredByGlob("content/posts/*.md")
      .sort((a, b) => b.date - a.date);

    // #region agent log
    fetch("http://127.0.0.1:7457/ingest/23b8f3fa-75d6-496e-99f0-de39d0fa2967", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "6c20ef" },
      body: JSON.stringify({
        sessionId: "6c20ef",
        runId: "pre-fix",
        hypothesisId: "H2_H3_H4",
        location: ".eleventy.js:addCollection(posts)",
        message: "Posts resolved for blog collection",
        data: {
          postCount: posts.length,
          posts: posts.slice(0, 25).map((post) => ({
            inputPath: post.inputPath,
            title: post.data?.title || "",
            slug: post.data?.slug || "",
            date: String(post.date || ""),
            url: post.url || "",
            featuredImage: post.data?.featured_image || "",
          })),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    return posts;
  });

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


