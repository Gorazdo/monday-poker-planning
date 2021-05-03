import { useModeratorItem } from ".";
import { RoundNumber } from "../../constants/cards";
import { GameStatus } from "../../services/types";

export const useRound = (): RoundNumber => {
  const moderatorItem = useModeratorItem();
  const phase = usePhase(moderatorItem);
  if (phase === null) {
    return 1;
  }
  if (phase.startsWith("Round") || phase.startsWith("Discussion")) {
    return Number(phase.split(" ")[1]) as RoundNumber;
  }
  return 1;
};

export const usePhase = (moderatorItem): null | GameStatus => {
  try {
    return moderatorItem.values.game_status.value;
  } catch {
    return null;
  }
};
