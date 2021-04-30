import { monday } from "./monday";
import { Board } from "./types";

export const createGroup = async (boardId: Board["id"], title: string) => {
  await monday.api(`#graphql
    mutation {
      create_group (board_id: ${boardId}, group_name: "${title}") {
        id
      }
    }
  `);
};
