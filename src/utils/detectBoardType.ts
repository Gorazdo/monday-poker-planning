import { PP_BOARD_NAME, PP_README_GROUP_NAME } from "../constants/boards";
import { BoardType } from "../services/types";

export const detectBoardType = ({
  name,
  columns,
  items,
  groups,
}): BoardType => {
  const authors = extractUniqueCreators(items);
  const columnIds = columns.map((column) => column.id);
  if (
    columnIds.includes("round_1") &&
    columnIds.includes("round_2") &&
    columnIds.includes("round_3") &&
    columnIds.includes("voting_status")
  ) {
    return "planning_poker";
  }
  if (authors.length > 1 || groups.length > 2 || items.length > 5) {
    return "danger";
  }
  if (authors.length === 1 && groups.length === 2 && items.length === 5) {
    return "default_template";
  }
  if (authors.length === 1 && groups.length === 1 && items.length === 1) {
    return "empty";
  }
  if (
    groups[0] === undefined ||
    (name.endsWith(PP_BOARD_NAME) && groups[0]?.title === PP_README_GROUP_NAME)
  ) {
    return "readme";
  }
  // if something goes wrong we ask to create a new board
  return "unknown";
};

const extractUniqueCreators = (items) => {
  const itemsWithACreator = items.filter((item) => item.creator !== null);
  const creatorNames = itemsWithACreator.map((item) => item.creator.name);
  return Array.from(new Set(creatorNames));
};
