import { monday } from "./monday";
import { Board, BoardGroup, BoardItem } from "./types";

export const createItemCreator = (
  boardId: Board["id"],
  groupId: BoardGroup["id"]
) => (item_name: BoardItem["name"]) => {
  return createItem(boardId, groupId, item_name);
};

export const createItem = async (
  boardId: Board["id"],
  groupId: BoardGroup["id"],
  item_name: BoardItem["name"]
) => {
  await monday.api(`#graphql
    mutation {
      create_item (board_id: ${boardId}, group_id: "${groupId}", item_name: "${item_name}") {
        id
      }
    }
  `);
};
