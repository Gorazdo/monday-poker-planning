export const useUniqueAuthors = (items): string[] => {
  const itemsWithACreator = items.filter((item) => item.creator !== null);
  const creatorNames = itemsWithACreator.map((item) => item.creator.name);
  return Array.from(new Set(creatorNames));
};
