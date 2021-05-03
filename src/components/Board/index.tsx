import clsx from "clsx";
import { useMeasure } from "react-use";
import classes from "./index.module.css";
import { useUsers } from "../../contexts/BoardContext/useUsers";
import { usePlayers } from "../../hooks/usePlayers";
import { Toolbar } from "../Toolbar";
import { UserPlayingCard, UserPlayingCardStub } from "./UserPlayingCard";
import { useModeratorItem } from "../../contexts/BoardContext";
import { usePhase } from "../../contexts/BoardContext/useRound";
import { extractVote } from "../../services/game/revealCard";
import { useSelector } from "react-redux";
import { selectViewMode } from "../../state/contextSlice";

export const Board = () => {
  const viewMode = useSelector(selectViewMode);
  return (
    <section
      className={clsx(classes.root, {
        [classes.rootSplit]: viewMode === "split",
      })}
    >
      {viewMode === "fullScreen" && <Toolbar />}
      <InteractiveBoard />
    </section>
  );
};

const InteractiveBoard = () => {
  const players = usePlayers();
  const users = useUsers();

  const moderatorItem = useModeratorItem();
  const phase = usePhase(moderatorItem);
  console.log({ players, users });
  const [ref, { width }] = useMeasure();
  return (
    <div ref={ref} className={classes.cardBoard}>
      {users.length === 0 && (
        <>
          <UserPlayingCardStub />
          <UserPlayingCardStub />
        </>
      )}
      {users
        .map((user) => ({
          ...user,
          voting_status: players[user.id]?.voting_status,
          sortkey: generateSortKey(user, players),
        }))
        .sort((a, b) => a.sortkey - b.sortkey)
        .map((user, index, users) => {
          const joined = user.id in players;
          const vote = extractVote(players[user.id]?.vote);
          // const minmax = getMinMax(users, players);
          return (
            <UserPlayingCard
              key={user.id}
              user={user}
              vote={vote}
              style={{
                width: 120,
                transform: joined
                  ? `translateX(${(120 + 20) * index}px)`
                  : `translateX(${width - 120 - index * 10}px)`,
              }}
              joined={joined}
              phase={phase}
              voting_status={players[user.id]?.voting_status}
            />
          );
        })}
    </div>
  );
};

const getMinMax = (users, players): null | [number, number] => {
  const votes = users
    .map((user) => players[user.id]?.vote ?? null)
    .filter((vote) => {
      if (vote === null) {
        return false;
      }
      return Number.isFinite(Number(vote));
    });

  if (votes.length < 2) {
    return null;
  }
  const min = Math.min(...votes);
  const max = Math.max(...votes);
  if (min === max) {
    return null;
  }
  return [min, max];
};

const getTransform = (minmax: null | [number, number], vote): string => {
  if (minmax === null || vote === null) {
    return "";
  }
  if (minmax.includes(Number(vote))) {
    return "translateY(-10px)";
  }
  return "";
};

const generateSortKey = (user, players) => {
  //players[user.id]?.voting_status
  if (!players[user.id]) {
    return 1000000000 + user.id;
  }
  if (players[user.id].voting_status === "Moderator") {
    return 0;
  }
  return user.id;
};
