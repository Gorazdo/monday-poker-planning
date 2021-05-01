import { createItemCreator } from "../createItem";

export const joinGame = async ({ boardId, groupId, user }) => {
  const createItem = createItemCreator(boardId, groupId);
  console.log(user.id);
  const result = await createItem(`${user.name}'s vote panel`, {
    voting_status: "Ready",
    player: `"${user.id}"`,
  });
  return result;
};
