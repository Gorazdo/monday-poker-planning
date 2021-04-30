import pluralize from "pluralize";

export const plural = (
  str: string,
  count?: null | number | any[],
  printNumber = true
): string => {
  if (count === undefined || count === null) {
    return pluralize(str, 0, printNumber);
  }
  if (Array.isArray(count)) {
    return pluralize(str, count.length, printNumber);
  }
  return pluralize(str, count, printNumber);
};

export const usePlural = plural;
