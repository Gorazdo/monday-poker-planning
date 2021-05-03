import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { Intro } from "./components/Intro";
import { useLoadingPercent } from "./hooks/useLoadingStatus";
import { useMondayListenerEffect } from "./hooks/useMondayListenerEffect";
import { FullScreenLoader } from "./library/FullScreenLoader";
import { contextSlice } from "./state/contextSlice";
import { fetchMeThunk } from "./state/meSlice";
import { selectAppReady, selectAppStatus } from "./state/selectors";
import { settingsSlice } from "./state/settingsSlice";
import { useAppDispatch } from "./state/store";
import { fetchUsersThunk } from "./state/usersSlice";

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchMeThunk());
    dispatch(fetchUsersThunk());
  }, []);

  const contextCallback = useCallback((response) => {
    dispatch(contextSlice.actions.setContext(response.data));
  }, []);

  const settingsCallback = useCallback((response) => {
    dispatch(settingsSlice.actions.setSettings(response.data));
  }, []);

  useMondayListenerEffect("context", contextCallback);
  useMondayListenerEffect("settings", settingsCallback);
  const statuses = useSelector(selectAppStatus);

  const loadingPercent = useLoadingPercent(statuses);
  const isFulfilled = useSelector(selectAppReady);
  if (isFulfilled) {
    return <Intro />;
  }
  return (
    <FullScreenLoader
      statuses={statuses}
      label="Our dealer is almost here..."
      percent={loadingPercent}
    />
  );
}

export default App;
