import { useContext } from "react";
import { BoardContext } from "../contexts/BoardContext";
import { Player, User } from "../services/types";

export const usePlayers = (): Record<User["id"], Player> => {
  const [{ items, round }] = useContext(BoardContext);
  return Object.values(items).reduce((players, item) => {
    const voting_status = item.values.voting_status.text;
    const vote = item.values[`round_${round}`].value;
    players[item.creator.id] = {
      id: item.creator.id,
      name: item.creator.name,
      voting_status,
      vote,
    };
    console.log([item.creator.name, voting_status, vote]);
    return players;
  }, {});
};
