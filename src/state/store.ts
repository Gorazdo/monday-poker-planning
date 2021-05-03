import { configureStore } from "@reduxjs/toolkit";
import { useDispatch as useReduxDispatch } from "react-redux";
import rootReducer from "./rootReducer";

const preloadedState = {};

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  preloadedState,
});

export type RootState = ReturnType<typeof rootReducer>;

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept("./rootReducer", () => {
    const newRootReducer = require("./rootReducer").default;
    console.log(newRootReducer);
    store.replaceReducer(newRootReducer);
  });
}

export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => useReduxDispatch<AppDispatch>();
