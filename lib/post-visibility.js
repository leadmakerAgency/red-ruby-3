const isProductionBuild = () => process.env.NODE_ENV === "production";

const parsePostDate = (input) => {
  if (!input) return null;

  const date = input instanceof Date ? input : new Date(input);
  return Number.isNaN(date.getTime()) ? null : date;
};

const isFutureDate = (value, referenceDate = new Date()) => {
  const date = parsePostDate(value);
  if (!date) return false;
  return date.getTime() > referenceDate.getTime();
};

const shouldHideInProduction = (data, referenceDate = new Date()) => {
  const publishDate = data?.date || data?.page?.date;
  const isDraft = Boolean(data?.draft);
  const isFuture = isFutureDate(publishDate, referenceDate);

  return isProductionBuild() && (isDraft || isFuture);
};

module.exports = {
  isProductionBuild,
  parsePostDate,
  isFutureDate,
  shouldHideInProduction,
};
