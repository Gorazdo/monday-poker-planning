import { processItemValues } from "../utils/processItemValues";
import { monday } from "./monday";
import {
  Board,
  BoardItemWithGroup,
  BoardItemWithValuesAndGroup,
} from "./types";

export const fetchBoardItems = async (
  boardId: Board["id"],
  id: number[]
): Promise<BoardItemWithGroup[]> => {
  const response = await monday.api(`#graphql
    {
      boards(ids: ${boardId}) {
        items(ids: ${id.join(", ")}) { 
          id 
          name 
          group {
            id
            title
          }
          creator {
            id
            name
          }
        }
      }
    }
  `);
  return response.data.boards[0].items;
};

export const fetchBoardItemsWithValues = async (
  boardId: Board["id"],
  id: number[]
): Promise<BoardItemWithValuesAndGroup[]> => {
  const response = await monday.api(`#graphql
    {
      boards(ids: ${boardId}) {
        items(ids: ${id.join(", ")}) { 
          id 
          name 
          group {
            id
            title
          }
          column_values {
            id
            value
            additional_info
            text
            type
          }
          creator {
            id
            name
          }
        }
      }
    }
  `);
  return response.data.boards[0].items.map(processItemValues);
};
