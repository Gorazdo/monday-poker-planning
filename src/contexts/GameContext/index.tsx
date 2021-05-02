import { createContext, useCallback, useContext } from "react";
import { useDeepCompareEffect } from "react-use";
import { useMondayListenerEffect } from "../../hooks/useMondayListenerEffect";
import { fetchBoardGroups } from "../../services/fetchBoardGroups";
import { fetchBoardItemsWithValues } from "../../services/fetchBoardItems";
import { fetchGroupItemsAndValues } from "../../services/fetchBoardItemsAndValues";
import { joinGame } from "../../services/game/joinGame";
import { BoardItem } from "../../services/types";
import { normalizeById } from "../../utils/normalizers";
import { useMe } from "../AppContext";
import { BoardContext, useModeratorItem } from "../BoardContext";

export const GameContext = createContext<[]>([]);

export const GameProvider = ({ children }) => {
  const [{ boardId, group, items }, boardActions] = useContext(BoardContext);

  const groupId = group.id;
  useJoinMeEffect();

  console.log("GameContext", boardId, groupId);

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
      }
      if (data.type === "change_column_values") {
        if (data.columnId === "game_status") {
          if (data.columnValue === "Session ended") {
            fetchBoardGroups(boardId).then((groups) => {
              const [latestGroup] = groups;
              console.log({ latestGroup });
              setTimeout(() => {
                boardActions.set("group", latestGroup);
              }, 1000);
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
  const [{ boardId, group, items }, boardActions] = useContext(BoardContext);
  const me = useMe();
  const groupId = group.id;
  const myItem = useMyItem();
  useDeepCompareEffect(() => {
    if (myItem === undefined) {
      console.log(me, "is going to be joined");
      joinGame({ boardId, groupId, user: me }).then(({ item, isModerator }) => {
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
  }, [myItem, me, groupId, boardId]);
};

export const useMyItem = (): BoardItem | undefined => {
  const [{ items }] = useContext(BoardContext);
  const me = useMe();
  const myItem = Object.values(items).find((item) => item.creator.id === me.id);
  return myItem;
};

export const useIAmModerator = () => {
  const myItem = useMyItem();
  const moderatorItem = useModeratorItem();
  return myItem && moderatorItem && myItem.id === moderatorItem.id;
};
