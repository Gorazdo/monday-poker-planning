import { createContext, useContext, useEffect, useState } from "react";
import { useMap } from "react-use";
import { useConsole } from "../../hooks/useContextConsole";
import { prepareNewlyCreatedBoard } from "../../services/createBoard";
import { fetchUsers } from "../../services/fetchUsers";
import { monday } from "../../services/monday";
import { StatusMap, User } from "../../services/types";
import { useBoardId } from "../AppContext";

export const BoardContext = createContext<BoardState>(null);
type BoardState = {
  events: any[];
  users: User[];
};

export const BoardProvider = ({ children, boardType }) => {
  const [hasPrepared, setHasPrepared] = useState(
    boardType === "planning_poker"
  );
  const [status, { set: setStatus }] = useMap<StatusMap>({
    users: "pending",
  });
  const [map, { set }] = useMap<BoardState>({
    events: [],
    users: [],
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
        set("users", users);
        setStatus("users", "fulfilled");
      })
      .catch((error) => {
        setStatus("users", error);
      });
  }, [set, setStatus]);
  useEffect(() => {
    monday.listen("events", (res) => {
      setStatus("events", "fulfilled");
      console.log(res.data);
    });

    return () => {
      console.log("BoardProvider was unmounted", monday);
      // @ts-ignore
      monday._clearListeners();
      console.log("Listeners were cleared");
    };
  }, [set, setStatus]);
  return <BoardContext.Provider value={map}>{children}</BoardContext.Provider>;
};
