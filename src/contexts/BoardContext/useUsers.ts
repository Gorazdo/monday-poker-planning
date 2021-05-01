import { useContext } from "react";
import { BoardContext } from ".";

export const useUsers = () => {
  return useContext(BoardContext).users;
};
