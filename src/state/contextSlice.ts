import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { StatusType } from "./types";

interface ContextState {
  status: StatusType;
  data?: {
    boardId: string;
    theme: string | "light";
    viewMode: "fullScreen" | "split";
  };
}

const initialState: ContextState = {
  status: "pending",
};

export const contextSlice = createSlice({
  name: "context",
  initialState: initialState,
  reducers: {
    setContext: (state, action) => {
      state.status = "fulfilled";
      state.data = {
        boardId: action.payload.boardId ?? action.payload.boardIds[0],
        theme: action.payload.theme,
        viewMode: action.payload.viewMode,
      };
    },
  },
});

const sliceSelector = (state: RootState) => state.context;

export const selectBoardId = createSelector(
  sliceSelector,
  (slice) => slice.data.boardId
);

export const selectViewMode = createSelector(
  sliceSelector,
  (slice) => slice.data.viewMode
);
