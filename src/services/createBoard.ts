import { PP_README_GROUP_NAME } from "../constants/boards";
import {
  createColumnCreator,
  VOTING_STATUS_COLUMN_PROPS,
  STORY_POINTS_COLUMN_PROPS,
  VOTING_DURATION_COLUMN_PROPS,
  SESSION_DURATION_COLUMN_PROPS,
} from "./createColumn";
import { createGroup } from "./createGroup";
import { createItemCreator } from "./createItem";
import { deleteGroup } from "./deleteGroup";
import { fetchBoardGroups } from "./fetchBoardGroups";
import { monday } from "./monday";
import { Board, BoardKind } from "./types";

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
  return board;
};

/**
 * TODO:
 * convert it to generators, then we can easily track the progress
 */

const clearGroups = async (boardId: Board["id"]) => {
  const groups = await fetchBoardGroups(boardId);
  const deletedGroups = await Promise.all(
    groups.map((group) => deleteGroup(boardId, group.id))
  );
  console.log("deleted groups", deletedGroups);
  return deletedGroups;
};

const createCommonColumns = async (createColumn) => {
  const columns = [];
  // Unfortunately, sending them simultaniously using Promise.all produces unreliable results
  columns.push(
    await createColumn("Voting Status", "status", VOTING_STATUS_COLUMN_PROPS)
  );
  columns.push(
    await createColumn("Round 1", "numbers", STORY_POINTS_COLUMN_PROPS)
  );
  columns.push(
    await createColumn("Round 2", "numbers", STORY_POINTS_COLUMN_PROPS)
  );
  columns.push(
    await createColumn("Round 3", "numbers", STORY_POINTS_COLUMN_PROPS)
  );
  columns.push(
    await createColumn(
      "Voting Duration",
      "numbers",
      VOTING_DURATION_COLUMN_PROPS
    )
  );
  columns.push(
    await createColumn(
      "Session Duration",
      "numbers",
      SESSION_DURATION_COLUMN_PROPS
    )
  );
  console.log("created columns", columns);
  return columns;
};

export const prepareDefaultTemplateBoard = async (boardId: Board["id"]) => {
  await clearGroups(boardId);
  const createColumn = createColumnCreator(boardId);
  await createCommonColumns(createColumn);

  const demoGroup = await createGroup(boardId, "Planning Poker Session #1");
  console.log("the demo group", demoGroup);
};

export const addReadmeInfo = async (boardId: Board["id"]) => {
  await clearGroups(boardId);
  const readmeGroup = await createGroup(boardId, PP_README_GROUP_NAME);
  const createReadmeItem = createItemCreator(boardId, readmeGroup.id);
  await createReadmeItem("Cool! You've created a suitable board!");
  await createReadmeItem("Now, let's add the app to this board");
  await createReadmeItem("1. Press [+ Add View] Button above");
  await createReadmeItem("2. Select 'Apps' and find Planning Poker");
};

export const prepareNewlyCreatedBoard = async (boardId: Board["id"]) => {
  await clearGroups(boardId);
  const createColumn = createColumnCreator(boardId);
  await createCommonColumns(createColumn);
  await createColumn("Player", "people");
  await createColumn("Session Started", "date");
  await createColumn("Game Status", "text");
  await createGroup(boardId, "My Task");
};

// Flow #1
// 1. User creates New Default Board
// 2. User adds Poker Planning
// 3. App shows Popup with a Start! Button
// 4. App deletes 2 groups and 5 items which were created by default
// 5. App renames Person column into Player
// 6. App renames Date column into Session Started
// 7. App renames Status column into "This column can be deleted manually"
// 8. App adds other columns

// Flow #2
// 1. User uses some board
// 2. User adds Poker Planning
// 3. App shows Popup with a [Create a new Board!] Button
// 4. App creates a Board with "Read me first" group and steps
// 5. User adds Poker Planning
// 6. App automatically creates columns and starts with a first group

// First game
// 1. App shows players
// 2. App suggests to invite more players
// 3. Player can press a button "Ready to play"
// 4. Player can press a button "Absent today"
