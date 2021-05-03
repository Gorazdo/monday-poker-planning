import { BoardGroup } from "../types";
import { updateRow } from "../updateRow";
import { getPrivateVote } from "./privateVote";

type RoundNumber = 1 | 2 | 3;

export const revealCard = async (
  roundNumber: RoundNumber,
  { boardId, itemId, userId }
) => {
  const vote = await getPrivateVote(itemId, userId, roundNumber);

  const key = `round_${roundNumber}`;

  if (Number.isFinite(vote)) {
    await updateRow(boardId, itemId, {
      [key]: vote,
    });
  } else if (vote === "infinity") {
    await updateRow(boardId, itemId, {
      [key]: 1000,
    });
  } else if (vote === "coffee-break") {
    await updateRow(boardId, itemId, {
      [key]: -1,
    });
  } else if (vote === "what") {
    await updateRow(boardId, itemId, {
      [key]: -2,
    });
  }
};

export const VOTE_MAP_FROM_NUMBERS = {
  1000: "infinity",
  "-1": "coffee-break",
  "-2": "what",
} as const;

export const extractVote = (vote) => {
  if (vote in VOTE_MAP_FROM_NUMBERS) {
    return VOTE_MAP_FROM_NUMBERS[vote];
  }
  return vote ?? null;
};
