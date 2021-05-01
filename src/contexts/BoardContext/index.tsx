import { createContext, useContext, useEffect, useState } from "react";
import { useMap } from "react-use";
import { useConsole } from "../../hooks/useContextConsole";
import { useMondayListenerEffect } from "../../hooks/useMondayListenerEffect";
import { prepareNewlyCreatedBoard } from "../../services/createBoard";
import { fetchUsers } from "../../services/fetchUsers";
import { monday } from "../../services/monday";
import { Player, StatusMap, User } from "../../services/types";
import { useBoardId } from "../AppContext";

export const BoardContext = createContext<BoardState>(null);
type BoardState = {
  sessionStarted: boolean;
  round: number;
  players: Record<User["id"], Player>;
  allUsers: User[];
};

export const BoardProvider = ({ children, boardType }) => {
  const [hasPrepared, setHasPrepared] = useState(
    boardType === "planning_poker"
  );
  const [status, { set: setStatus }] = useMap<StatusMap>({
    allUsers: "pending",
  });
  const [map, { set }] = useMap<BoardState>({
    sessionStarted: false,
    round: 1,
    players: {},
    allUsers: [],
  });
  const boardId = useBoardId();
  useConsole("BoardContext", status, map);

  useEffect(() => {
    if (boardType === "readme" && !hasPrepared) {
      prepareNewlyCreatedBoard(boardId).then((res) => {
        setHasPrepared(true);
      });
    } else {
      console.log("board has prepared", { boardType, hasPrepared });
    }
  }, [boardId, boardType, hasPrepared]);

  useEffect(() => {
    fetchUsers()
      .then((users) => {
        set("allUsers", users);
        setStatus("allUsers", "fulfilled");
      })
      .catch((error) => {
        setStatus("allUsers", error);
      });
  }, [set, setStatus]);

  useMondayListenerEffect("events", console.log);
  return <BoardContext.Provider value={map}>{children}</BoardContext.Provider>;
};
