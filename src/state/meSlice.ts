import {
  createSelector,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { fetchMe } from "../services/fetchMe";
import { User } from "../services/types";
import { RootState } from "./store";
import { StatusType } from "./types";

interface MeState {
  status: StatusType;
  user?: User;
}

const initialState: MeState = {
  status: "pending",
};

export const fetchMeThunk = createAsyncThunk("me/fetch", async () => {
  const me = await fetchMe();
  return me;
});

export const meSlice = createSlice({
  name: "me",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchMeThunk.pending, (state) => {
        // we do nothing here
      })
      .addCase(fetchMeThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.user = action.payload;
      })
      .addCase(fetchMeThunk.rejected, (state, action) => {
        state.status = action.error;
      }),
});

const sliceSelector = (state: RootState) => state.me;

export const selectMe = createSelector(sliceSelector, (slice) => {
  return slice.user;
});
