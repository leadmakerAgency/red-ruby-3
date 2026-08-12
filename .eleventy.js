const path = require("path");
const { shouldHideInProduction } = require("./lib/post-visibility");
const { isSupersededDuplicate, prepareN8nPosts } = require("./lib/n8n-posts");

const postsDir = path.join(__dirname, "content", "posts");
const duplicateGroups = prepareN8nPosts(postsDir);

if (duplicateGroups.length > 0) {
  console.log(
    `[n8n] Resolved ${duplicateGroups.length} duplicate slug group(s); keeping the newest post for each slug.`
  );
}

// Eleventy config — Red Ruby site (Cambridge cleaning co.).
module.exports = function (eleventyConfig) {
  for (const group of duplicateGroups) {
    for (let index = 1; index < group.posts.length; index += 1) {
      const relativePath = path
        .relative(__dirname, group.posts[index].inputPath)
        .split(path.sep)
        .join("/");
      eleventyConfig.ignores.add(`./${relativePath}`);
    }
  }

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

  // Blog posts: newest first, excluding unpublished future/draft posts in production.
  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("content/posts/*.md")
      .filter(
        (post) =>
          !isSupersededDuplicate(post.inputPath) &&
          !shouldHideInProduction({
            date: post.date,
            draft: post.data?.draft,
          })
      )
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
// end of config
