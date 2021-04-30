import { monday } from "./monday";
import { Board, BoardGroup } from "./types";

export const deleteGroup = async (
  boardId: Board["id"],
  groupId: BoardGroup["id"]
) => {
  const response = await monday.api(`#graphql
    mutation {
      delete_group (board_id: ${boardId}, group_id: "${groupId}") {
        id
        deleted
      }
    }
  `);
  return response.data;
};
