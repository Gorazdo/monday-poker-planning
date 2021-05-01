import { StatusMap } from "../services/types";

export const useLoadingStatus = (statuses: StatusMap): number => {
  const values = Object.values(statuses);
  const total = values.length;
  const fulfilled = values.filter((status) => status === "fulfilled").length;
  return fulfilled / total;
};

export const useLoadingPercent = (statuses: StatusMap): number => {
  const value = useLoadingStatus(statuses);
  return Math.round(value * 100);
};
