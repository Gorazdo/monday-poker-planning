import { processItemValues } from "../utils/processItemValues";
import { api } from "./monday";
import { Board, BoardItem, BoardItemWithValues } from "./types";

export const fetchItem = async (
  boardId: Board["id"],
  itemId: BoardItem["id"]
): Promise<BoardItemWithValues> => {
  return await api(
    `#graphql
    {
      boards(ids: ${boardId}) {
        items(ids: ${itemId}) {
          id
          creator {
            id
            name
          }
          column_values {
            id
            value
            additional_info
            text
            type
          }
        }
      }
    }
  `,
    processor
  );
};

const processor = (response): BoardItemWithValues => {
  const { items } = response.data.boards[0];
  return processItemValues(items[0]);
};
