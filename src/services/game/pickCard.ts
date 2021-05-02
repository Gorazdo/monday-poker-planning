import { monday } from "../monday";
import { updateRow } from "../updateRow";

export const pickCard = async (
  roundNumber,
  value,
  { boardId, userId, itemId }
) => {
  const privateResult = await monday.storage.instance.setItem(
    `${userId}_${roundNumber}`,
    value
  );

  console.log({ privateResult });
  await updateRow(boardId, itemId, {
    // we trigger "change_column_values" if a user picks another card
    voting_status: "Voting",
  });
  const publicResult = await updateRow(boardId, itemId, {
    voting_status: "Voted",
  });

  console.log({ publicResult });
  return { privateResult, publicResult };
};
