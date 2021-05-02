import { stringifyJsonForGql } from "../utils";
import { api } from "./monday";
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
): Promise<BoardItem> => {
  const response = await api(`#graphql
    mutation {
      create_item (board_id: ${boardId}, group_id: "${groupId}", item_name: "${item_name}", column_values: ${stringifyJsonForGql(
    column_values
  )}) {
        id
        name
        creator {
          id
          name
        }
      }
    }
  `);

  return response.data.create_item;
};
