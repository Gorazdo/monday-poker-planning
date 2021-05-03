import { RoundNumber, Vote } from "../../constants/cards";
import { monday } from "../monday";
import { BoardItem, User } from "../types";

export const setPrivateVote = async (
  itemId: BoardItem["id"],
  userId: User["id"],
  roundNumber: RoundNumber,
  vote: Vote
) => {
  const response = await monday.storage.instance.setItem(
    `${itemId}_${userId}_${roundNumber}`,
    vote
  );
  console.log(response);
  return response;
};

export const getPrivateVote = async (
  itemId: BoardItem["id"],
  userId: User["id"],
  roundNumber: RoundNumber
): Promise<Vote> => {
  const response = await monday.storage.instance.getItem(
    `${itemId}_${userId}_${roundNumber}`
  );
  console.log(response);
  // @ts-ignore // there is wrongly types response
  const { value } = response.data;
  if (Number.isFinite(Number(value))) {
    return Number(value);
  }
  return value;
};
