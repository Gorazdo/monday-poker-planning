import { stringifyJsonForGql } from "../utils";
import { monday } from "./monday";
import { Board, BoardItem, RowValues } from "./types";

export const updateRow = async (
  boardId: Board["id"],
  itemId: BoardItem["id"],
  payload: Partial<RowValues>
) => {
  const column_values = stringifyJsonForGql(payload);
  const response = await monday.api(`#graphql
    mutation {
      change_multiple_column_values (board_id: ${boardId}, item_id: ${itemId}, column_values: ${column_values}) {
        id
      }
    }
  `);

  return response.data.change_multiple_column_values;
};
