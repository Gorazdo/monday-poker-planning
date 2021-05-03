import { monday } from "../monday";
import { updateRow } from "../updateRow";
import { setPrivateVote } from "./privateVote";

export const pickCard = async (
  roundNumber,
  value,
  { boardId, userId, itemId }
) => {
  const privateResult = await setPrivateVote(
    itemId,
    userId,
    roundNumber,
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
