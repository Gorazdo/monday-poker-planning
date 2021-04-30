import { monday } from "./monday";
import { Board, BoardGroup } from "./types";

export const createGroup = async (
  boardId: Board["id"],
  title: string
): Promise<BoardGroup> => {
  const response = await monday.api(`#graphql
    mutation {
      create_group (board_id: ${boardId}, group_name: "${title}") {
        id
        title
        color
      }
    }
  `);

  return response.data.create_group;
};
