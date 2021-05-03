export const makeMondayDateTimeString = (date: Date): string => {
  return date.toISOString().replace("T", " ").replace("Z", " ");
};
