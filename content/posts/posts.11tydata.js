module.exports = {
  eleventyComputed: {
    layout: (data) => data.layout || "blog-post.njk",
    permalink: (data) => {
      const rawSlug = data.slug || data.page?.fileSlug || "";
      const normalizedSlug = String(rawSlug)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      return `/blog/${normalizedSlug || data.page.fileSlug}/`;
    },
  },
};
