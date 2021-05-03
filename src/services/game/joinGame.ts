import { makeMondayDateTimeString } from "../../utils/makeMondayDateTimeString";
import { createItemCreator } from "../createItem";
import { fetchBoardGroups } from "../fetchBoardGroups";
import { fetchGroupItemsAndValues } from "../fetchBoardItemsAndValues";
import { fetchItem } from "../fetchItem";
import { BoardItemWithValues } from "../types";

type JoinGameType = {
  item: BoardItemWithValues;
  isModerator?: boolean;
};

export const joinGame = async ({
  boardId,
  user,
  groupId,
}): Promise<JoinGameType> => {
  console.log("JoinGame", { user });

  // const [lastGroup] = await fetchBoardGroups(boardId);
  // doublecheck that item has not been created (different device case, partial execution)
  const currentItems = await fetchGroupItemsAndValues(boardId, groupId);
  const currentUserItem = currentItems.find(
    (item) => item.creator.id === user.id
  );

  if (currentUserItem) {
    // it's been created already
    return { item: currentUserItem };
  }
  console.log("JoinGame", { currentUserItem });
  const isModerator = currentItems.length === 0;
  const createItem = createItemCreator(boardId, groupId);
  const newItem = await createItem(`${user.name}'s vote panel`, {
    voting_status: isModerator ? "Moderator" : "Joined",
    game_status: isModerator ? "Round 1" : null,
    session_started: makeMondayDateTimeString(new Date()),
    player: `${user.id}`,
  });

  console.log("JoinGame", { newItem });

  const fullNewItem = await fetchItem(boardId, newItem.id);
  console.log("JoinGame", { fullNewItem });
  return { item: fullNewItem, isModerator };
};
