import {
  createColumnCreator,
  VOTING_STATUSES,
  STORY_POINTS,
} from "./createColumn";
import { createGroup } from "./createGroup";
import { deleteGroup } from "./deleteGroup";
import { fetchBoardGroups } from "./fetchBoardGroups";
import { monday } from "./monday";
import { Board } from "./types";

type BoardKind = "public" | "private" | "share";

export const createBoard = async (
  name: string,
  kind: BoardKind = "public"
): Promise<Board> => {
  const response = await monday.api(`#graphql
    mutation {
      create_board (board_name: "${name}", board_kind: ${kind}) {
        id
        name
        owner {
          account {
            id
            name
            slug
          }
        }
      }
    }
  `);

  const board = response.data.create_board;
  await prepareNewlyCreatedBoard(board.id);
  return board;
};

/**
 * TODO:
 * convert it to generators, then we can easily track the progress
 */

const prepareNewlyCreatedBoard = async (boardId: Board["id"]) => {
  const groups = await fetchBoardGroups(boardId);
  const deletedGroups = await Promise.all(
    groups.map((group) => deleteGroup(boardId, group.id))
  );
  console.log("deleted groups", deletedGroups);
  const createColumn = createColumnCreator(boardId);
  const columns = [];
  // Unfortunately, sending them simultaniously using Promise.all produces unreliable results
  columns.push(await createColumn("Voting Status", "status", VOTING_STATUSES));
  columns.push(await createColumn("Player", "people"));
  columns.push(await createColumn("Round 1", "numbers", STORY_POINTS));
  columns.push(await createColumn("Round 2", "numbers", STORY_POINTS));
  columns.push(await createColumn("Round 3", "numbers", STORY_POINTS));
  columns.push(await createColumn("Session Started", "date"));
  columns.push(await createColumn("Session Duration", "time_tracking"));

  console.log("created columns", columns);
  const demoGroup = await createGroup(boardId, "Planning Poker Session #1");
  console.log("the demo group", demoGroup);
};
