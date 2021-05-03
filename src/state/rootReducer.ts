import { combineReducers } from "@reduxjs/toolkit";
import { contextSlice } from "./contextSlice";
import { meSlice } from "./meSlice";
import { settingsSlice } from "./settingsSlice";

const rootReducer = combineReducers({
  me: meSlice.reducer,
  context: contextSlice.reducer,
  settings: settingsSlice.reducer,
});

export default rootReducer;
