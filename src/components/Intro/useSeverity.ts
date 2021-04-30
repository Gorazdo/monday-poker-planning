export const useSeverity = ({
  items,
  groups,
  authors,
}): "success" | "danger" | "primary" => {
  if (authors.length === 1 && groups.length === 2 && items.length === 5) {
    // this is a newly created board template
    return "success";
  }

  if (authors.length > 1) {
    // when more than one author we imply it is a totally non-new board
    return "danger";
  }
  if (items.length > 10) {
    // when board is big enough
    return "danger";
  }

  // by default it's primary
  return "primary";
};
