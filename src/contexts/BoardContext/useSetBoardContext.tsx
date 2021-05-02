import { useContext } from "react";
import { BoardContext } from ".";

export const useSetBoardContext = () => {
  const [, boardActions] = useContext(BoardContext);
  return boardActions.set;
};
