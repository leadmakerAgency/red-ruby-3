/**
 * One-time repair for n8n posts that used execution IDs in filenames
 * while frontmatter slugs/images omitted them, causing duplicate permalinks
 * and broken featured images.
 */
const fs = require("fs");
const path = require("path");

const postsDir = path.join(__dirname, "..", "content", "posts");
const mediaDir = path.join(__dirname, "..", "content", "media");

const deleteFiles = [
  "airbnb-cleaning-service-cambridge-professional-reliable.md",
  "airbnb-cleaning-service-cambridge-trusted-local-cleaners.md",
  "airbnb-cleaning-service-cambridge-trusted-turnover-cleaning.md",
];

const renamePosts = [
  ["airbnb-cleaning-service-cambridge-professional-reliable-220205.md", "airbnb-cleaning-service-cambridge-professional-reliable.md"],
  ["airbnb-cleaning-service-cambridge-trusted-local-cleaners-220155.md", "airbnb-cleaning-service-cambridge-trusted-local-cleaners.md"],
  ["airbnb-cleaning-service-cambridge-trusted-turnover-cleaning-220223.md", "airbnb-cleaning-service-cambridge-trusted-turnover-cleaning.md"],
  ["airbnb-cleaning-service-cambridge-reliable-fast-220237.md", "airbnb-cleaning-service-cambridge-reliable-fast.md"],
  ["airbnb-cleaning-service-cambridge-reliable-and-professional-220190.md", "airbnb-cleaning-service-cambridge-reliable-and-professional.md"],
  ["airbnb-cleaning-service-cambridge-fast-reliable-cleaners-220198.md", "airbnb-cleaning-service-cambridge-fast-reliable-cleaners.md"],
  ["airbnb-cleaning-service-cambridge-professional-turnover-cleaning-220212.md", "airbnb-cleaning-service-cambridge-professional-turnover-cleaning.md"],
  ["airbnb-cleaning-service-cambridge-trusted-choice-for-hosts-220169.md", "airbnb-cleaning-service-cambridge-trusted-choice-for-hosts.md"],
];

const renameImages = [
  ["image-airbnb-cleaning-service-cambridge-professional-reliable-220205.png", "image-airbnb-cleaning-service-cambridge-professional-reliable.png"],
  ["image-airbnb-cleaning-service-cambridge-trusted-local-cleaners-220155.png", "image-airbnb-cleaning-service-cambridge-trusted-local-cleaners.png"],
  ["image-airbnb-cleaning-service-cambridge-trusted-turnover-cleaning-220223.png", "image-airbnb-cleaning-service-cambridge-trusted-turnover-cleaning.png"],
  ["image-airbnb-cleaning-service-cambridge-reliable-fast-220237.png", "image-airbnb-cleaning-service-cambridge-reliable-fast.png"],
  ["image-airbnb-cleaning-service-cambridge-reliable-and-professional-220190.png", "image-airbnb-cleaning-service-cambridge-reliable-and-professional.png"],
  ["image-airbnb-cleaning-service-cambridge-fast-reliable-cleaners-220198.png", "image-airbnb-cleaning-service-cambridge-fast-reliable-cleaners.png"],
  ["image-airbnb-cleaning-service-cambridge-professional-turnover-cleaning-220212.png", "image-airbnb-cleaning-service-cambridge-professional-turnover-cleaning.png"],
  ["image-airbnb-cleaning-service-cambridge-trusted-choice-for-hosts-220169.png", "image-airbnb-cleaning-service-cambridge-trusted-choice-for-hosts.png"],
];

const safeDelete = (dir, file) => {
  const fullPath = path.join(dir, file);
  if (!fs.existsSync(fullPath)) {
    console.log(`skip delete (missing): ${file}`);
    return;
  }
  fs.unlinkSync(fullPath);
  console.log(`deleted: ${file}`);
};

const safeRename = (dir, from, to) => {
  const fromPath = path.join(dir, from);
  const toPath = path.join(dir, to);
  if (!fs.existsSync(fromPath)) {
    console.log(`skip rename (missing): ${from}`);
    return;
  }
  if (fs.existsSync(toPath)) {
    console.log(`skip rename (target exists): ${from} -> ${to}`);
    return;
  }
  fs.renameSync(fromPath, toPath);
  console.log(`renamed: ${from} -> ${to}`);
};

for (const file of deleteFiles) safeDelete(postsDir, file);
for (const [from, to] of renamePosts) safeRename(postsDir, from, to);
for (const [from, to] of renameImages) safeRename(mediaDir, from, to);

console.log("\nDone.");
