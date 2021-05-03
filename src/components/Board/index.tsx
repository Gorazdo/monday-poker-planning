import classes from "./index.module.css";
import { Typography } from "../../library/Typography";
import { PlayingCard } from "../../library/PlayingCard";
import { useUsers } from "../../contexts/BoardContext/useUsers";
import { Avatar } from "../../library/Avatar";
import { CARD_BACKS, Vote } from "../../constants/cards";
import { usePlayers } from "../../hooks/usePlayers";
import clsx from "clsx";
import { useMeasure } from "react-use";
import { useContext } from "react";
import { BoardContext, useModeratorItem } from "../../contexts/BoardContext";
import { useSettings } from "../../contexts/AppContext/useSettings";
import { Toolbar } from "../Toolbar";
import { useViewMode } from "../../contexts/AppContext/useViewMode";

const useCardBack = (
  index: number,
  voting_status
): typeof CARD_BACKS[number] | "king" => {
  if (voting_status === "Moderator") {
    return "king";
  }
  return CARD_BACKS[index % CARD_BACKS.length];
};

export const Board = () => {
  const viewMode = useViewMode();
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
        .map((user, index) => {
          const joined = user.id in players;
          const vote = players[user.id]?.vote ?? null;
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
              voting_status={players[user.id]?.voting_status}
            />
          );
        })}
    </div>
  );
};

const UserPlayingCard = ({ user, joined, vote, voting_status, style }) => {
  const cardBack = useCardBack(user.id + 3, voting_status);
  const { variant, label, value } = usePlayingCardProps(vote, voting_status);
  return (
    <div
      className={clsx(classes.userCard, {
        [classes.userCardJoined]: joined,
      })}
      style={style}
    >
      <PlayingCard
        value={value}
        label={label}
        variant={variant}
        backCover={`/cards/${cardBack}.svg`}
        voting_status={voting_status}
      />
      <div
        className={clsx(classes.userCardAvatarWrapper, {
          [classes.userCardAvatarWrapperModerator]:
            voting_status === "Moderator",
        })}
      >
        <Avatar
          url={user.photo_thumb}
          name={user.name}
          className={classes.userCardAvatar}
        />
      </div>
    </div>
  );
};

const usePlayingCardProps = (
  vote: Vote | null,
  voting_status
): {
  variant: "back" | "face";
  label?: string;
  value?: Vote;
} => {
  const { cardsMap } = useSettings();
  if (vote === null || voting_status === "Moderator") {
    return {
      variant: "back",
    };
  }

  return {
    ...cardsMap[vote],
    variant: "face",
  };
};

const UserPlayingCardStub = () => {
  return (
    <div className={classes.userCard}>
      <PlayingCard value={0} label="0" variant="back" />
      <div className={classes.userCardAvatarWrapper}>
        <Avatar url="" name="" className={classes.userCardAvatar} />
      </div>
    </div>
  );
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
