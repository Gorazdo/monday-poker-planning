import { useEffect, useState } from "react";
import { useCounter } from "react-use";
import { useAppDispatch } from "../state/store";

export const useReoccuringDispatch = (action, timeout = 7000) => {
  const dispatch = useAppDispatch();
  const [counter, { inc }] = useCounter(1);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(action).then(() => {
        inc();
      });
    }, timeout);
    return () => {
      return clearTimeout(timeoutId);
    };
  }, [dispatch, counter, inc, timeout]);
};
