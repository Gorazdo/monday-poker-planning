import { monday } from "../services/monday";

export const useStorage = () => monday.storage.instance;

// round, user: value

export const pickCard = (round, user, value) =>
  monday.storage.instance.setItem(`${round}_${user}`, value);
