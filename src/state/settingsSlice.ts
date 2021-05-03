import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { StatusType } from "./types";

type ViewSettingsState = {
  sequence: "Scrum" | "Fibonacci";
  status: StatusType;
};

const initialState: ViewSettingsState = {
  sequence: "Fibonacci",
  status: "pending",
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState: initialState,
  reducers: {
    setSettings: (state, action) => {
      state.status = "fulfilled";
      state.sequence = action.payload.sequence;
    },
  },
});

const sliceSelector = (state: RootState) => state.settings;
export const selectSequenceType = createSelector(sliceSelector, (slice) => {
  return slice.sequence;
});
