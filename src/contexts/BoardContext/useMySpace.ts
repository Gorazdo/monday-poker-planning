import { useContext } from "react";
import { BoardContext } from ".";
import { useBoardId, useMe } from "../AppContext";

export const useMySpace = () => {
  const [{ group, items }] = useContext(BoardContext);
  const boardId = useBoardId();
  const me = useMe();
  return {
    boardId,
    userId: me.id,
    groupId: group.id,
    itemId: Object.values(items).find((item) => item.creator.id === me.id)?.id,
  };
};
