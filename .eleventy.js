const fs = require("node:fs");
const path = require("node:path");

module.exports = function (eleventyConfig) {
  // #region agent log
  const mediaDir = path.join(process.cwd(), "content", "media");
  const mediaExists = fs.existsSync(mediaDir);
  const mediaFiles = mediaExists ? fs.readdirSync(mediaDir) : [];
  fetch("http://127.0.0.1:7457/ingest/23b8f3fa-75d6-496e-99f0-de39d0fa2967", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "6c20ef" },
    body: JSON.stringify({
      sessionId: "6c20ef",
      runId: "pre-fix",
      hypothesisId: "H1_H2",
      location: ".eleventy.js:module",
      message: "Media directory status before build",
      data: { mediaDir, mediaExists, mediaFileCount: mediaFiles.length, mediaFiles: mediaFiles.slice(0, 10) },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

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
    const featuredImageChecks = posts.slice(0, 20).map((post) => {
      const featuredImage = post.data?.featured_image || "";
      const fileName = featuredImage.startsWith("/media/") ? decodeURIComponent(featuredImage.replace("/media/", "")) : "";
      const localMediaPath = fileName ? path.join(process.cwd(), "content", "media", fileName) : "";
      return {
        inputPath: post.inputPath,
        slug: post.data?.slug || "",
        featuredImage,
        isMediaUrl: featuredImage.startsWith("/media/"),
        localMediaPath,
        localMediaExists: localMediaPath ? fs.existsSync(localMediaPath) : null,
      };
    });

    fetch("http://127.0.0.1:7457/ingest/23b8f3fa-75d6-496e-99f0-de39d0fa2967", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "6c20ef" },
      body: JSON.stringify({
        sessionId: "6c20ef",
        runId: "pre-fix",
        hypothesisId: "H3_H4",
        location: ".eleventy.js:addCollection(posts)",
        message: "Post featured image mapping and source file existence",
        data: { postCount: posts.length, featuredImageChecks },
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


