/**
 * Blog posts live here as *.md files (e.g. created by n8n). There are no posts in git right now.
 *
 * Cloudflare Pages: set build command to `npm run build` and output directory to `_site`.
 * `_site/` is gitignored — do not commit it; the deploy must run Eleventy so old blog URLs disappear.
 *
 * If removed posts still appear live: purge Cloudflare cache (Caching → Configuration → Purge Everything)
 * or change the `deploy-bump` line below, commit, and push again.
 *
 * deploy-bump: 2026-03-24
 */
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
