import LinearProgressBar from "monday-ui-react-core/dist/LinearProgressBar";
import { createContext, useCallback, useContext, useEffect } from "react";
import { useMap } from "react-use";
import { useConsole } from "../../hooks/useContextConsole";
import { useLoadingPercent } from "../../hooks/useLoadingStatus";
import { useMondayListenerEffect } from "../../hooks/useMondayListenerEffect";
import { fetchBoardOwnerAccount } from "../../services/fetchBoardOwnerAccount";
import { fetchMe } from "../../services/fetchMe";
import { AccountInfo, StatusMap, User } from "../../services/types";

export const AppContext = createContext<AppState>(null);
type AppState = {
  account?: AccountInfo;
  settings?: any;
  me?: User;
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
  const [statuses, { set: setStatus }] = useMap<StatusMap>({
    context: "pending",
    settings: "pending",
    account: "pending",
    me: "pending",
  });
  const [map, { set }] = useMap<AppState>({});
  useConsole("AppContext", statuses, map);
  const loadingPercent = useLoadingPercent(statuses);
  useEffect(() => {
    fetchMe()
      .then((me) => {
        setStatus("me", "fulfilled");
        set("me", me);
      })
      .catch((error) => {
        setStatus("me", error);
      });
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

  const contextCallback = useCallback((res) => {
    console.log(res);
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
  }, []);

  const settingsCallback = useCallback((res) => {
    console.log(res);
    setStatus("settings", "fulfilled");
    set("settings", res.data);
  }, []);

  useMondayListenerEffect("context", contextCallback);
  useMondayListenerEffect("settings", settingsCallback);

  if (Object.values(statuses).every((status) => status === "fulfilled")) {
    return <AppContext.Provider value={map}>{children}</AppContext.Provider>;
  }
  return (
    <LinearProgressBar
      min={0}
      max={100}
      value={loadingPercent}
      ariaLabel="Application is loading"
    />
  );
};

export const useBoardId = (): string => {
  return useContext(AppContext).context.boardId;
};

export const useMe = (): User => {
  return useContext(AppContext).me;
};
