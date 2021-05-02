import { updateRow } from "../updateRow";
import { getPrivateVote } from "./privateVote";

type RoundNumber = 1 | 2 | 3;

export const revealCard = async (
  roundNumber: RoundNumber,
  { boardId, itemId, userId }
) => {
  const vote = await getPrivateVote(userId, roundNumber);

  if (Number.isFinite(vote)) {
    await updateRow(boardId, itemId, {
      [`round_${roundNumber}`]: vote,
    });
  } else if (vote === "infinity") {
    await updateRow(boardId, itemId, {
      [`round_${roundNumber}`]: 1000,
    });
  } else if (vote === "coffee-break") {
    await updateRow(boardId, itemId, {
      [`round_${roundNumber}`]: -1,
    });
  } else if (vote === "what") {
    await updateRow(boardId, itemId, {
      [`round_${roundNumber}`]: -2,
    });
  }
};
