import {
  createSlice,
  createSelector,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { fetchUsers } from "../services/fetchUsers";
import { User } from "../services/types";
import { RootState } from "./store";
import { StatusType } from "./types";

interface UsersState {
  status: StatusType;
}

const usersAdapter = createEntityAdapter<User>();

const initialState: UsersState = {
  status: "pending",
};

export const fetchUsersThunk = createAsyncThunk("users/fetch", async () => {
  const me = await fetchUsers();
  return me;
});

export const usersSlice = createSlice({
  name: "users",
  initialState: usersAdapter.getInitialState(initialState),
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        // we do nothing here
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.status = "fulfilled";
        usersAdapter.setAll(state, action.payload);
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.status = action.error;
      }),
});

const sliceSelector = (state: RootState) => state.users;

const userSelectors = usersAdapter.getSelectors();

export const selectUsers = createSelector(sliceSelector, (slice) => {
  return userSelectors.selectAll(slice);
});

export const selectUserById = userSelectors.selectById;
