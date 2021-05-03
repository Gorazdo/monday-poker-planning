import { createContext, useCallback, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAsyncFn, useMap } from "react-use";
import { Actions } from "react-use/lib/useMap";
import { RoundNumber } from "../../constants/cards";
import { useConsole } from "../../hooks/useContextConsole";
import { useLoadingPercent } from "../../hooks/useLoadingStatus";
import { FullScreenLoader } from "../../library/FullScreenLoader";
import { createGroup } from "../../services/createGroup";
import { fetchBoardGroups } from "../../services/fetchBoardGroups";
import { fetchGroupItemsAndValues } from "../../services/fetchBoardItemsAndValues";
import { fetchUsers } from "../../services/fetchUsers";
import {
  Board,
  BoardGroup,
  BoardItemWithValues,
  StatusMap,
  User,
} from "../../services/types";
import {
  boardSlice,
  fetchCurrentItemsThunk,
  selectGroupId,
} from "../../state/boardSlice";
import { selectBoardId } from "../../state/contextSlice";
import { useAppDispatch } from "../../state/store";
import { normalizeById } from "../../utils/normalizers";
import { useBoardInitialization } from "./useBoardInitialization";

export const BoardContext = createContext<[BoardState, Actions<BoardState>]>(
  null
);
type BoardState = {
  boardId: Board["id"];
  group?: BoardGroup; // current group
  items: Record<string, BoardItemWithValues>;
  round: RoundNumber;
  sessionStarted: boolean;
};

export const BoardProvider = ({ children, boardType }) => {
  const boardId = useSelector(selectBoardId);
  const dispatch = useAppDispatch();
  const [statuses, { set: setStatus }] = useMap<StatusMap>({
    prepared: "pending",
    items: "pending",
    group: "pending",
  });
  const [boardState, boardActions] = useMap<BoardState>({
    boardId,
    items: {},
    round: 1,
    sessionStarted: false,
  });
  const { set } = boardActions;
  const groupId = useSelector(selectGroupId);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchCurrentItemsThunk({ boardId, groupId }));
    }
  }, [groupId, boardId]);

  useConsole("BoardContext", statuses, boardState);

  useBoardInitialization({ boardType, boardId, setStatus });

  useEffect(() => {
    if (statuses.prepared === "fulfilled") {
      fetchBoardGroups(boardId)
        .then((groups) => {
          if (groups.length === 0) {
            createGroup(boardId, "My Task").then((group) => {
              set("group", group);
              dispatch(boardSlice.actions.setGroup(group));
              setStatus("group", "fulfilled");
            });
          } else {
            const [latestGroup] = groups;
            set("group", latestGroup);
            dispatch(boardSlice.actions.setGroup(latestGroup));
            setStatus("group", "fulfilled");
          }
        })
        .catch((error) => {
          setStatus("group", error);
        });
    }
  }, [boardId, statuses.prepared, setStatus, set]);

  useEffect(() => {
    if (boardState.group?.id) {
      console.log(
        "Fetching items for group",
        boardState.group.id,
        boardState.group.title
      );
      fetchGroupItemsAndValues(boardId, boardState.group.id)
        .then((items) => {
          console.log(items);
          set("items", normalizeById(items));
          setStatus("items", "fulfilled");
        })
        .catch((error) => {
          setStatus("items", error);
        });
    }
  }, [boardId, boardState.group?.id, boardState.group?.title, setStatus, set]);

  const loadingPercent = useLoadingPercent(statuses);

  if (Object.values(statuses).every((status) => status === "fulfilled")) {
    return (
      <BoardContext.Provider value={[boardState, boardActions]}>
        {children}
      </BoardContext.Provider>
    );
  }
  return (
    <FullScreenLoader
      statuses={statuses}
      label="Shuffling the deck..."
      percent={loadingPercent}
    />
  );
};
