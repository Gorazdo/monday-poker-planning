import { createContext, useContext, useEffect, useState } from "react";
import { useMap } from "react-use";
import { Card } from "../../constants/cards";
import { useConsole } from "../../hooks/useContextConsole";
import { fetchUsers } from "../../services/fetchUsers";
import { monday } from "../../services/monday";
import { RowValues, StatusMap, User } from "../../services/types";
import { useUsers } from "../BoardContext/useUsers";

export const GameContext = createContext<GameState>(null);

type UserGameState = {
  voting_status: RowValues["voting_status"];
  name: User["name"];
  id: User["id"];
  vote: Card["value"];
};

type GameState = {
  round: number;
  users?: Record<User["id"], UserGameState>;
};

export const GameProvider = ({ children, boardType }) => {
  const users = useUsers();
  const [hasPrepared, setHasPrepared] = useState(
    boardType === "planning_poker"
  );
  const [status, { set: setStatus }] = useMap<StatusMap>({});
  const [map, { set }] = useMap<GameState>();

  useEffect(() => {
    monday.listen("events", (res) => {
      console.log("event", res.data);
    });

    return () => {
      // @ts-ignore
      monday._clearListeners();
      console.log("Listeners were cleared");
    };
  }, [set, setStatus]);
  return <GameContext.Provider value={map}>{children}</GameContext.Provider>;
};
