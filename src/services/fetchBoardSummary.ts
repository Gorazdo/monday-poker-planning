import { monday } from "./monday";
import { Board, BoardSummaryType } from "./types";

export const fetchBoardSummary = async (
  id: Board["id"]
): Promise<void | BoardSummaryType> => {
  const response = await monday.api(`#graphql
     {
      boards(ids: ${id}) {
        name
        columns {
          id
        }
        items {
          id
          name
          creator {
            id
            name
          }
        }
        groups {
          id
          title
          color
        }
      }
    }
  `);

  return response.data.boards[0];
};
