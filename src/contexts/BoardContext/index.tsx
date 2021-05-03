import { createContext, useCallback, useContext, useEffect } from "react";
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
  allUsers: User[];
};

export const BoardProvider = ({ children, boardType, boardId }) => {
  const [statuses, { set: setStatus }] = useMap<StatusMap>({
    prepared: "pending",
    items: "pending",
    allUsers: "pending",
    group: "pending",
  });
  const [boardState, boardActions] = useMap<BoardState>({
    boardId,
    items: {},
    round: 1,
    sessionStarted: false,
    allUsers: [],
  });
  const { set } = boardActions;

  useConsole("BoardContext", statuses, boardState);

  useBoardInitialization({ boardType, boardId, setStatus });

  useEffect(() => {
    fetchUsers()
      .then((users) => {
        set("allUsers", users);
        setStatus("allUsers", "fulfilled");
      })
      .catch((error) => {
        setStatus("allUsers", error);
      });
  }, [setStatus, set]);

  useEffect(() => {
    if (statuses.prepared === "fulfilled") {
      fetchBoardGroups(boardId)
        .then((groups) => {
          if (groups.length === 0) {
            createGroup(boardId, "My Task").then((group) => {
              set("group", group);
              setStatus("group", "fulfilled");
            });
          } else {
            const [latestGroup] = groups;
            set("group", latestGroup);
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

export const useModeratorItem = (): BoardItemWithValues | null => {
  const [{ items }] = useContext(BoardContext);
  return (
    Object.values(items).find(
      (item) => item.values.voting_status?.text === "Moderator"
    ) ?? null
  );
};

export const useRefetchFn = () => {
  const [{ boardId, group }, boardActions] = useContext(BoardContext);
  const [status, refetchFn] = useAsyncFn(async () => {
    if (!group) {
      return;
    }
    await fetchGroupItemsAndValues(boardId, group.id).then((items) => {
      console.log("Refetched items", items);
      boardActions.set("items", normalizeById(items));
    });
  }, [boardId, group?.id]);

  return refetchFn;
};
