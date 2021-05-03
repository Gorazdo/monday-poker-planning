import { StatusMap } from "../services/types";
import { StatusType } from "../state/types";

export const useLoadingStatus = (
  statuses: StatusMap | StatusType[]
): number => {
  const values = Object.values(statuses);
  const total = values.length;
  const fulfilled = values.filter((status) => status === "fulfilled").length;
  return fulfilled / total;
};

export const useLoadingPercent = (
  statuses: StatusMap | StatusType[]
): number => {
  const value = useLoadingStatus(statuses);
  return Math.round(value * 100);
};
