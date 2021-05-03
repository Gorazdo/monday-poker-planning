import clsx from "clsx";
import { useMeasure } from "react-use";
import classes from "./index.module.css";
import { Toolbar } from "../Toolbar";
import { UserPlayingCard, UserPlayingCardStub } from "./UserPlayingCard";
import { extractVote } from "../../services/game/revealCard";
import { useSelector } from "react-redux";
import { selectViewMode } from "../../state/contextSlice";
import { selectPlayers } from "../../state/boardSlice";

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
  const players = useSelector(selectPlayers);
  const [ref, { width }] = useMeasure();
  return (
    <div ref={ref} className={classes.cardBoard}>
      {players.length === 0 && (
        <>
          <UserPlayingCardStub />
          <UserPlayingCardStub />
        </>
      )}
      {players
        .sort((a, b) => a.sortkey - b.sortkey)
        .map((player, index) => {
          const vote = extractVote(player.vote);
          return (
            <UserPlayingCard
              key={player.id}
              vote={vote}
              userId={player.id}
              style={{
                width: 120,
                transform: player.joined
                  ? `translateX(${(120 + 20) * index}px)`
                  : `translateX(${width - 120 - index * 10}px)`,
              }}
              joined={player.joined}
              voting_status={player.voting_status}
            />
          );
        })}
    </div>
  );
};
