import { useContext, useMemo } from "react";
import { BoardContext } from ".";
import { useBoardId, useMe } from "../AppContext";

export const useMySpace = () => {
  const [{ group, items }] = useContext(BoardContext);
  const boardId = useBoardId();
  const me = useMe();
  const itemId = Object.values(items).find((item) => item.creator.id === me.id)
    ?.id;

  return useMemo(
    () => ({
      boardId,
      userId: me.id,
      groupId: group.id,
      itemId,
    }),
    [boardId, me.id, group.id, itemId]
  );
};
