import { monday } from "./monday";
import { BoardItem } from "./types";

export const fetchBoardItems = async (id: number): Promise<BoardItem[]> => {
  const response = await monday.api(`#graphql
    {
      boards(ids: ${id}) {
        items { 
          id 
          name 
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
