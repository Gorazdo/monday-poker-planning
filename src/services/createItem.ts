import { stringifyJsonForGql } from "../utils";
import { monday } from "./monday";
import { Board, BoardGroup, BoardItem } from "./types";

export const createItemCreator = (
  boardId: Board["id"],
  groupId: BoardGroup["id"]
) => (item_name: BoardItem["name"], column_values?: any) => {
  return createItem(boardId, groupId, item_name, column_values);
};

export const createItem = async (
  boardId: Board["id"],
  groupId: BoardGroup["id"],
  item_name: BoardItem["name"],
  column_values: any = {}
) => {
  await monday.api(`#graphql
    mutation {
      create_item (board_id: ${boardId}, group_id: "${groupId}", item_name: "${item_name}", column_values: ${stringifyJsonForGql(
    column_values
  )}) {
        id
      }
    }
  `);
};
