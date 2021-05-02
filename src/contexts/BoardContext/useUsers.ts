import { useContext } from "react";
import { BoardContext } from ".";

export const useUsers = () => {
  const [{ allUsers }] = useContext(BoardContext);
  return allUsers;
};
