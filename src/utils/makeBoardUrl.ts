import { Board } from "../services/types";

export const makeBoardUrl = (board: Board): string => {
  return `https://${board.owner.account.slug}.monday.com/boards/${board.id}`;
};
