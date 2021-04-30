import { monday } from "./monday";
import { Board, BoardGroup } from "./types";

export const fetchBoardGroups = async (
  id: Board["id"]
): Promise<BoardGroup[]> => {
  const response = await monday.api(`#graphql
    {
      boards(ids: ${id}) {
        groups { 
          id 
          title 
          color 
        }
      }
    }
  `);
  return response.data.boards[0].groups;
};
