import { monday } from "../monday";
import { updateRow } from "../updateRow";

export const pickCard = async (boardId, userId, roundNumber, value) => {
  await monday.storage.instance.setItem(`${userId}_${roundNumber}`, value);
  await updateRow(boardId, userId, {
    voting_status: "Voted",
    player: userId,
  });

  return;
};
