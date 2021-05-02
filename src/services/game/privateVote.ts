import { RoundNumber, Vote } from "../../constants/cards";
import { monday } from "../monday";
import { User } from "../types";

export const setPrivateVote = async (
  userId: User["id"],
  roundNumber: RoundNumber,
  vote: Vote
) => {
  const response = await monday.storage.instance.setItem(
    `${userId}_${roundNumber}`,
    vote
  );
  console.log(response);
  return response;
};

export const getPrivateVote = async (
  userId: User["id"],
  roundNumber: RoundNumber
): Promise<Vote> => {
  const response = await monday.storage.instance.getItem(
    `${userId}_${roundNumber}`
  );
  console.log(response);
  // @ts-ignore // there is wrongly types response
  const { value } = response.data;
  if (Number.isFinite(Number(value))) {
    return Number(value);
  }
  return value;
};
