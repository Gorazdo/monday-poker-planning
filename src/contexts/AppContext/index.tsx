import { createContext, useContext, useEffect } from "react";
import { useAsync, useMap } from "react-use";
import { Actions } from "react-use/lib/useMap";
import { fetchAccount } from "../../services/fetchAccount";
import { fetchBoardOwnerAccount } from "../../services/fetchBoardOwnerAccount";
import { monday } from "../../services/monday";
import { AccountInfo } from "../../services/types";

export const AppContext = createContext<AppState>(null);
type StatusMap = Record<string, "pending" | "fulfilled" | Error>;
type AppState = {
  account?: AccountInfo;
  settings?: any;
  context?: {
    boardIds: number[];
    boardId?: number | string; // missing in app preview
    instanceType: string | "board_view";
    theme: string | "light";
    user: {
      id: string;
      isAdmin: boolean;
      isGuest: boolean;
      isViewOnly: boolean;
    };
    viewMode: "fullscreen" | "splited";
  };
};
const DEV_BOARD_ID = 1249871037;

const useLoadingStatus = (statuses: StatusMap): number => {
  const values = Object.values(statuses);
  const total = values.length;
  const fulfilled = values.filter((status) => status === "fulfilled").length;
  return fulfilled / total;
};

const useLoadingPercent = (statuses: StatusMap): number => {
  const value = useLoadingStatus(statuses);
  return Math.round(value * 100);
};

export const AppProvider = ({ children }) => {
  const [status, { set: setStatus }] = useMap<StatusMap>({
    context: "pending",
    settings: "pending",
    account: "pending",
  });
  const [map, { set }] = useMap<AppState>({});
  console.groupCollapsed(
    `AppProvider is rerendered | ${useLoadingPercent(status)}%`
  );
  console.log("New state:", map);
  console.log("Statuses:", status);
  console.groupEnd();
  useEffect(() => {
    if (!map.context?.boardId) {
      return;
    }
    const boardId = Number(map.context.boardId);
    fetchBoardOwnerAccount(boardId)
      .then((account) => {
        setStatus("account", "fulfilled");
        set("account", account);
      })
      .catch((error) => {
        setStatus("account", error);
      });
  }, [map.context?.boardId]);
  useEffect(() => {
    monday.listen("context", (res) => {
      setStatus("context", "fulfilled");
      set("context", res.data);
    });

    monday.listen("settings", (res) => {
      setStatus("settings", "fulfilled");
      set("settings", res.data);
    });
    return () => {
      console.log("AppProvider was demounted", monday);
      // @ts-ignore
      monday._clearListeners();
      console.log("Listeners were cleared");
    };
  }, []);
  return <AppContext.Provider value={map}>{children}</AppContext.Provider>;
};

export const useBoardId = (): number => {
  return Number(useContext(AppContext).context?.boardId ?? DEV_BOARD_ID);
};
