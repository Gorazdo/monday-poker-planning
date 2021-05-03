import { createItemCreator } from "../createItem";
import { fetchGroupItemsAndValues } from "../fetchBoardItemsAndValues";
import { fetchItem } from "../fetchItem";
import { BoardItemWithValues } from "../types";

type JoinGameType = {
  item: BoardItemWithValues;
  isModerator?: boolean;
};

export const joinGame = async ({
  boardId,
  groupId,
  user,
}): Promise<JoinGameType> => {
  const createItem = createItemCreator(boardId, groupId);

  // doublecheck that item has not been created (different device case, partial execution)
  const currentItems = await fetchGroupItemsAndValues(boardId, groupId);
  const currentUserItem = currentItems.find(
    (item) => item.creator.id === user.id
  );

  if (currentUserItem) {
    // it's been created already
    return { item: currentUserItem };
  }
  const isModerator = currentItems.length === 0;
  const newItem = await createItem(`${user.name}'s vote panel`, {
    voting_status: isModerator ? "Moderator" : "Joined",
    game_status: isModerator ? "Round 1" : null,
    player: `${user.id}`,
  });

  const fullNewItem = await fetchItem(boardId, newItem.id);
  console.log({ fullNewItem });
  return { item: fullNewItem, isModerator };
};
