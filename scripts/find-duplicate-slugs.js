const path = require("path");
const { prepareN8nPosts } = require("../lib/n8n-posts");

const postsDir = path.join(__dirname, "..", "content", "posts");
const duplicateGroups = prepareN8nPosts(postsDir);

if (duplicateGroups.length === 0) {
  console.log("Duplicate slugs: 0");
  process.exit(0);
}

console.log(
  `Duplicate slugs: ${duplicateGroups.length} (auto-resolved by keeping newest post)`
);

for (const group of duplicateGroups) {
  console.log(`\nSLUG: ${group.slug}`);
  for (const [index, post] of group.posts.entries()) {
    const status = index === 0 ? "kept" : "skipped";
    console.log(`  - [${status}] ${path.basename(post.inputPath)} | ${post.date}`);
  }
}
