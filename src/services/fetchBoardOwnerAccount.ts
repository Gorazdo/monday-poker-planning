import { monday } from "./monday";
import { AccountInfo } from "./types";

export const fetchBoardOwnerAccount = async (
  id: number
): Promise<AccountInfo> => {
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