import { processItemValues } from "../utils/processItemValues";
import { api } from "./monday";
import { Board, BoardGroup, BoardItemWithValues } from "./types";

export const fetchGroupItemsAndValues = async (
  boardId: Board["id"],
  groupId: BoardGroup["id"]
): Promise<BoardItemWithValues[]> => {
  return await api(
    `#graphql
    {
      boards(ids: ${boardId}) {
        groups(ids: ${groupId}) {
          items { 
            id 
            name 
            creator {
              id
              name
            }
            column_values {
              id
              value
              additional_info
              text
              type
            }
          }
        }
      }
    }
  `,
    processor
  );
};

const processor = (response): BoardItemWithValues[] => {
  const { groups } = response.data.boards[0];
  if (groups.length === 0) {
    // zero groups therefore zero items
    return [];
  }
  const { items } = groups[0];
  return items.map(processItemValues);
};
