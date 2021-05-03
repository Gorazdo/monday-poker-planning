import { useContext, useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { BoardContext } from ".";
import { selectBoardId } from "../../state/contextSlice";
import { selectMe } from "../../state/meSlice";

export const useMySpace = () => {
  const [{ group, items }] = useContext(BoardContext);
  const boardId = useSelector(selectBoardId);
  const me = useSelector(selectMe, shallowEqual);
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
