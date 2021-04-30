export const stringifyJsonForGql = (json): string =>
  '"' + JSON.stringify(json).replaceAll('"', '\\"') + '"';
