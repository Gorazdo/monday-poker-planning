import { createContext, useContext, useEffect } from "react";
import { useMap } from "react-use";
import { useLoadingPercent } from "../../hooks/useLoadingStatus";
import { fetchUsers } from "../../services/fetchUsers";
import { monday } from "../../services/monday";
import { StatusMap, User } from "../../services/types";

export const BoardContext = createContext<BoardState>(null);
type BoardState = {
  events: any[];
  users: User[];
};

export const BoardProvider = ({ children }) => {
  const [status, { set: setStatus }] = useMap<StatusMap>({
    users: "pending",
  });
  const [map, { set }] = useMap<BoardState>({
    events: [],
    users: [],
  });
  console.groupCollapsed(
    `BoardProvider is rerendered | ${useLoadingPercent(status)}%`
  );
  console.log("New state:", map);
  console.log("Statuses:", status);
  console.groupEnd();
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
