import { monday } from "./monday";
import { Board, BoardColumn, BoardSummaryType } from "./types";

type PartialBoardColumn = Pick<BoardColumn, "id" | "title">;

export const fetchColumns = async (
  id: Board["id"]
): Promise<PartialBoardColumn[]> => {
  const response = await monday.api(`#graphql
     {
      boards(ids: ${id}) {
        name
        columns {
          id
          title
        }
      }
    }
  `);

  return response.data.boards[0].columns;
};
