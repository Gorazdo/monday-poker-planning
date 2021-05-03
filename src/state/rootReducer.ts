import { combineReducers } from "@reduxjs/toolkit";
import { boardSlice } from "./boardSlice";
import { contextSlice } from "./contextSlice";
import { meSlice } from "./meSlice";
import { settingsSlice } from "./settingsSlice";
import { usersSlice } from "./usersSlice";

const rootReducer = combineReducers({
  me: meSlice.reducer,
  board: boardSlice.reducer,
  users: usersSlice.reducer,
  context: contextSlice.reducer,
  settings: settingsSlice.reducer,
});

export default rootReducer;
