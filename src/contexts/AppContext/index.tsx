import { createContext, useContext, useEffect } from "react";
import { useMap } from "react-use";
import { useConsole } from "../../hooks/useContextConsole";
import { fetchBoardOwnerAccount } from "../../services/fetchBoardOwnerAccount";
import { monday } from "../../services/monday";
import { AccountInfo, StatusMap } from "../../services/types";

export const AppContext = createContext<AppState>(null);
type AppState = {
  account?: AccountInfo;
  settings?: any;
  context?: {
    boardIds: number[];
    boardId?: string; // missing in app preview
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
// const DEV_BOARD_ID = "1249871037";
const DEV_BOARD_ID = "1257333489";

export const AppProvider = ({ children }) => {
  const [status, { set: setStatus }] = useMap<StatusMap>({
    context: "pending",
    settings: "pending",
    account: "pending",
  });
  const [map, { set }] = useMap<AppState>({});
  useConsole("AppContext", status, map);
  useEffect(() => {
    if (!map.context?.boardId) {
      return;
    }
    fetchBoardOwnerAccount(map.context.boardId)
      .then((account) => {
        setStatus("account", "fulfilled");
        set("account", account);
      })
      .catch((error) => {
        setStatus("account", error);
      });
  }, [set, setStatus, map.context?.boardId]);
  useEffect(() => {
    monday.listen("context", (res) => {
      setStatus("context", "fulfilled");
      if (res.data.boardId === undefined) {
        // dev mode
        set("context", {
          boardId: res.data.boardIds[0] ?? DEV_BOARD_ID,
          ...res.data,
        });
      } else {
        set("context", res.data);
      }
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
  }, [set, setStatus]);
  if (!map.context?.boardId) {
    return null;
  }
  return <AppContext.Provider value={map}>{children}</AppContext.Provider>;
};

export const useBoardId = (): string => {
  return useContext(AppContext).context.boardId;
};
