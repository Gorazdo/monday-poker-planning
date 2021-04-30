import { monday } from "./monday";
import { BoardGroup } from "./types";

export const fetchBoardGroups = async (id: number): Promise<BoardGroup[]> => {
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
