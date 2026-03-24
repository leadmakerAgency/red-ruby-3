module.exports = {
  title: "Blog — Red Ruby Cleaning Co. | Cambridge Airbnb Cleaning Tips & Advice",
  eleventyExcludeFromCollections: true,
  pagination: {
    data: "collections.posts",
    size: 15,
    alias: "pagedPosts",
    before: (paginationData) =>
      paginationData && paginationData.length > 0 ? paginationData : [null],
  },
  permalink(data) {
    const pageNumber = data.pagination?.pageNumber ?? 0;
    return pageNumber === 0 ? "/blog/" : `/blog/page/${pageNumber + 1}/`;
  },
};
