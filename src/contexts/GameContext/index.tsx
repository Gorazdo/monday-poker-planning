import { createContext, useCallback, useContext } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useDeepCompareEffect } from "react-use";
import { useMondayListenerEffect } from "../../hooks/useMondayListenerEffect";
import { fetchBoardGroups } from "../../services/fetchBoardGroups";
import { fetchBoardItemsWithValues } from "../../services/fetchBoardItems";
import { fetchGroupItemsAndValues } from "../../services/fetchBoardItemsAndValues";
import { joinGame } from "../../services/game/joinGame";
import { BoardItemWithValues } from "../../services/types";
import { selectMe } from "../../state/meSlice";
import { normalizeById } from "../../utils/normalizers";
import { BoardContext, useModeratorItem } from "../BoardContext";

export const GameContext = createContext<[]>([]);

export const GameProvider = ({ children }) => {
  const [{ boardId, group, items }, boardActions] = useContext(BoardContext);

  const groupId = group.id;
  useJoinMeEffect();

  const eventListener = useCallback(
    (event) => {
      const { data } = event;
      console.log(data.type, data);
      if (data.boardId !== boardId) {
        // we do not care about different boards
        return;
      }
      if (data.type === "new_items") {
        fetchBoardItemsWithValues(boardId, data.itemIds).then((newItems) => {
          // in case of item in different group was created
          const thisGroupItems = newItems.filter(
            (item) => item.group.id === groupId
          );
          // add new items to the store
          boardActions.set("items", {
            ...items,
            ...normalizeById(thisGroupItems),
          });
          console.log({ items, thisGroupItems, groupId });
        });
        // double check to load everything
        fetchGroupItemsAndValues(boardId, groupId).then((updatedItems) => {
          // update items in the store
          boardActions.set("items", {
            ...items,
            ...normalizeById(updatedItems),
          });
        });
      }
      if (data.type === "change_column_values") {
        if (data.columnId.startsWith("round_")) {
          fetchGroupItemsAndValues(boardId, groupId).then((updatedItems) => {
            // update items in the store
            boardActions.set("items", {
              ...items,
              ...normalizeById(updatedItems),
            });
          });
        }

        if (data.columnId === "game_status") {
          if (data.columnValue === "New Game") {
            // look for a new gorup and "join" in a second
            fetchBoardGroups(boardId).then((groups) => {
              const [latestGroup] = groups;
              console.log({ latestGroup });
              setTimeout(() => {
                boardActions.set("group", latestGroup);
              }, 1000);
            });
          }
          if (
            data.columnValue.startsWith("Round") ||
            data.columnValue === "Session ended"
          ) {
            fetchGroupItemsAndValues(boardId, groupId).then((updatedItems) => {
              // update items in the store
              boardActions.set("items", {
                ...items,
                ...normalizeById(updatedItems),
              });
            });
          }
        }
        if (data.columnId === "voting_status") {
          if (data.columnValue.textual_value === "Voting") {
            // we do not trigger on this "Temp" value
            return; //
          }
          fetchGroupItemsAndValues(boardId, groupId).then((updatedItems) => {
            // update items in the store
            boardActions.set("items", {
              ...items,
              ...normalizeById(updatedItems),
            });
          });
        }
      }
    },
    [boardId, groupId, JSON.stringify(items)]
  );

  useMondayListenerEffect("events", eventListener);

  return <GameContext.Provider value={[]}>{children}</GameContext.Provider>;
};

const useJoinMeEffect = () => {
  const [{ boardId, items, group }, boardActions] = useContext(BoardContext);
  const me = useSelector(selectMe, shallowEqual);
  const myItem = useMyItem();
  const moderatorItem = useModeratorItem();
  const groupId = group.id;
  useDeepCompareEffect(() => {
    console.log(groupId);
    if (myItem === undefined) {
      console.log(me, "is going to be joined");
      joinGame({ boardId, user: me, groupId }).then(({ item, isModerator }) => {
        console.log("Joined item is", item, isModerator);
        const newItems = {
          ...items,
          [item.id]: item,
        };
        console.log("join", { items, newItems });
        boardActions.set("items", newItems);
      });
    } else {
      console.log(me, "Has been joined");
    }
  }, [myItem, moderatorItem?.id, me, groupId, boardId]);
};

export const useMyItem = (): BoardItemWithValues | undefined => {
  const [{ items }] = useContext(BoardContext);
  const me = useSelector(selectMe, shallowEqual);
  try {
    const myItem = Object.values(items).find(
      (item) => item.creator.id === me.id
    );
    return myItem;
  } catch {
    return undefined;
  }
};

export const useIAmModerator = () => {
  const myItem = useMyItem();
  const moderatorItem = useModeratorItem();
  return myItem && moderatorItem && myItem.id === moderatorItem.id;
};
