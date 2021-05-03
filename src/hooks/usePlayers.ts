import { useContext } from "react";
import { BoardContext } from "../contexts/BoardContext";
import { useRound } from "../contexts/BoardContext/useRound";
import { Player, User } from "../services/types";

export const usePlayers = (): Record<User["id"], Player> => {
  const [{ items }] = useContext(BoardContext);
  const round = useRound();
  return Object.values(items).reduce((players, item) => {
    const voting_status = item.values.voting_status?.text;
    const vote = item.values[`round_${round}`]?.value;
    if (!item.creator) {
      return players;
    }
    players[item.creator.id] = {
      id: item.creator.id,
      name: item.creator.name,
      voting_status,
      vote,
    };
    return players;
  }, {});
};
