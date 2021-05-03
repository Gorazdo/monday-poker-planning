import { useContext } from "react";
import { AppContext, ViewMode } from ".";

export const useViewMode = (): ViewMode => {
  const { context } = useContext(AppContext);
  return context?.viewMode ?? "fullScreen";
};
