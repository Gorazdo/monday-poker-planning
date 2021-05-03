import { createSelector } from "reselect";
import { RootState } from "../store";

export const selectAppStatus = (state: RootState) => {
  return [state.context.status, state.me.status, state.settings.status];
};

export const selectAppReady = createSelector(selectAppStatus, (statuses) =>
  statuses.every((status) => status === "fulfilled")
);
