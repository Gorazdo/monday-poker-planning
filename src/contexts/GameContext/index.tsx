import { createContext, useCallback, useContext } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useDeepCompareEffect } from "react-use";
import { useMondayListenerEffect } from "../../hooks/useMondayListenerEffect";
import { useReoccuringDispatch } from "../../hooks/useReoccuringFetch";
import { fetchBoardGroups } from "../../services/fetchBoardGroups";
import { joinGame } from "../../services/game/joinGame";
import {
  boardSlice,
  fetchCurrentItemsThunk,
  selectGroupId,
  selectModeratorItemId,
  selectMyItemId,
} from "../../state/boardSlice";
import { selectBoardId } from "../../state/contextSlice";
import { selectMe } from "../../state/meSlice";
import { useAppDispatch } from "../../state/store";

export const GameContext = createContext<[]>([]);

export const GameProvider = ({ children }) => {
  const boardId = useSelector(selectBoardId);
  const groupId = useSelector(selectGroupId);

  useJoinMeEffect();
  useReoccuringDispatch(fetchCurrentItemsThunk({ boardId, groupId }));
  const dispatch = useAppDispatch();
  const eventListener = useCallback(
    (event) => {
      dispatch(fetchCurrentItemsThunk({ boardId, groupId }));
      const { data } = event;
      console.log(data.type, data);
      if (data.boardId !== boardId) {
        // we do not care about different boards
        return;
      }
      if (data.type === "new_items") {
        // double check to load everything
        // update items in the store
      }
      if (data.type === "change_column_values") {
        if (data.columnId.startsWith("round_")) {
          // update items in the store
        }

        if (data.columnId === "game_status") {
          if (data.columnValue === "New Game") {
            // look for a new gorup and "join" in a second
            fetchBoardGroups(boardId).then((groups) => {
              const [latestGroup] = groups;
              console.log({ latestGroup });
              setTimeout(() => {
                dispatch(boardSlice.actions.setGroup(latestGroup));
              }, 1000);
            });
          }
          if (
            data.columnValue.startsWith("Round") ||
            data.columnValue === "Session ended"
          ) {
            // update items in the store
          }
        }
        if (data.columnId === "voting_status") {
          if (data.columnValue.textual_value === "Voting") {
            // we do not trigger on this "Temp" value
            return; //
          }
          // update items in the store
        }
      }
    },
    [dispatch, boardId, groupId]
  );

  useMondayListenerEffect("events", eventListener);

  return <GameContext.Provider value={[]}>{children}</GameContext.Provider>;
};

const useJoinMeEffect = () => {
  const boardId = useSelector(selectBoardId);
  const groupId = useSelector(selectGroupId);
  const me = useSelector(selectMe, shallowEqual);
  const myItemId = useSelector(selectMyItemId);
  const moderatorItemId = useSelector(selectModeratorItemId);
  const dispatch = useAppDispatch();
  useDeepCompareEffect(() => {
    console.log(groupId);
    if (myItemId === undefined) {
      console.log(me, "is going to be joined");
      joinGame({ boardId, user: me, groupId }).then(() => {
        dispatch(fetchCurrentItemsThunk({ boardId, groupId }));
      });
    } else {
      console.log(me, "Has been joined");
    }
  }, [myItemId, moderatorItemId, me, groupId, boardId]);
};
