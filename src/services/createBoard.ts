import { monday } from "./monday";

type BoardKind = "public" | "private" | "share";

export const createBoard = async (
  name: string,
  kind: BoardKind = "public"
): Promise<string> => {
  const response = await monday.api(`#graphql
    mutation {
      create_board (board_name: "${name}", board_kind: ${kind}) {
        id
      }
    }
  `);

  return response.data.create_board.id;
};
