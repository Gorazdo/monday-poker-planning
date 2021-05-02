export const normalizeById = (array) =>
  Object.fromEntries(array.map((item) => [item.id, item]));
