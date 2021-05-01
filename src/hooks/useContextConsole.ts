import { useLoadingPercent } from "./useLoadingStatus";

export const useConsole = (name, status, map) => {
  console.groupCollapsed(
    `${name} is rerendered | ${useLoadingPercent(status)}%`
  );
  console.log("New state:", map);
  console.log("Statuses:", status);
  console.groupEnd();
};
