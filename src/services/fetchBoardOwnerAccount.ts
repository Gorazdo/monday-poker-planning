import { monday } from "./monday";
import { AccountInfo, Board } from "./types";

export const fetchBoardOwnerAccount = async (
  id: Board["id"]
): Promise<AccountInfo> => {
  console.log({ id });
  const response = await monday.api(`#graphql
    {
      boards (ids: ${id}) {
        owner {
          account {
            id
            slug
            name
          }
        }
      }
    }
  `);
  return response.data.boards[0].owner.account;
};
