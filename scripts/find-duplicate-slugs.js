const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "content", "posts");
const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".md") && !f.includes("11tydata"));

const slugMap = {};

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), "utf8");
  const slugMatch = content.match(/^slug:\s*["']?([^"'\n]+)["']?/m);
  const dateMatch = content.match(/^date:\s*["']?([^"'\n]+)["']?/m);
  const imageMatch = content.match(/^featured_image:\s*["']?([^"'\n]+)["']?/m);
  const slug = slugMatch ? slugMatch[1].trim() : file.replace(".md", "");

  if (!slugMap[slug]) slugMap[slug] = [];
  slugMap[slug].push({
    file,
    date: dateMatch ? dateMatch[1].trim() : "",
    image: imageMatch ? imageMatch[1].trim() : "",
  });
}

const duplicates = Object.entries(slugMap).filter(([, items]) => items.length > 1);
const checkOnly = process.argv.includes("--check");

if (duplicates.length === 0) {
  if (!checkOnly) {
    console.log("Duplicate slugs: 0");
  }
  process.exit(0);
}

console.error(`Duplicate slugs: ${duplicates.length}`);
for (const [slug, items] of duplicates) {
  console.error(`\nSLUG: ${slug}`);
  for (const item of items) {
    console.error(`  - ${item.file} | ${item.date} | ${item.image}`);
  }
}

console.error(
  "\nBuild blocked: multiple posts share the same slug/permalink. " +
    "Remove or rename the conflicting files before deploying."
);
process.exit(1);
