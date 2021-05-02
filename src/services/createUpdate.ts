import { stringifyJsonForGql } from "../utils";
import { api } from "./monday";
import { Board } from "./types";

type UpdateBody = {
  groupId: string;
};

export const createUpdate = async (
  itemId: Board["id"],
  body: UpdateBody
): Promise<{ id: number }> => {
  return await api(
    `#graphql
    mutation {
      create_update (item_id: ${itemId}, body: ${stringifyJsonForGql(body)}) {
        id
      }
    }
  `,
    processor
  );
};

const processor = (response) => response.data.create_update;
