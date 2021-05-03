import Button from "monday-ui-react-core/dist/Button";
import classes from "./index.module.css";
import { Typography } from "../../library/Typography";
import { Grid } from "../../library/Grid";
import { PlayingCard } from "../../library/PlayingCard";
import { useUsers } from "../../contexts/BoardContext/useUsers";
import { Avatar } from "../../library/Avatar";
import { CARD_BACKS, Vote } from "../../constants/cards";
import { useBoardId } from "../../contexts/AppContext";
import { usePlayers } from "../../hooks/usePlayers";
import clsx from "clsx";
import { useAsyncFn, useMeasure } from "react-use";
import { revealCard } from "../../services/game/revealCard";
import { useContext, useState } from "react";
import { BoardContext, useModeratorItem } from "../../contexts/BoardContext";
import { useIAmModerator } from "../../contexts/GameContext";
import { updateRow } from "../../services/updateRow";
import { useSettings } from "../../contexts/AppContext/useSettings";
import { usePhase, useRound } from "../../contexts/BoardContext/useRound";

const useCardBack = (index: number): typeof CARD_BACKS[number] => {
  return CARD_BACKS[index % CARD_BACKS.length];
};

export const Board = () => {
  const boardId = useBoardId();
  const [{ group, items }] = useContext(BoardContext);

  const moderatorItem = useModeratorItem();
  const phase = usePhase(moderatorItem);

  const round = useRound();
  const [endSessionState, endSessionHandler] = useAsyncFn(async () => {
    await updateRow(boardId, moderatorItem.id, {
      game_status: "Session ended",
    });
  }, [boardId, moderatorItem?.id]);

  const [revealed, setRevealed] = useState(false);

  const [, revealCardsHandler] = useAsyncFn(async () => {
    if (round === 1) {
      await updateRow(boardId, moderatorItem.id, {
        game_status: "Discussion 1",
      });
    }
    if (round === 2) {
      await updateRow(boardId, moderatorItem.id, {
        game_status: "Discussion 2",
      });
    }
    if (round === 3) {
      await updateRow(boardId, moderatorItem.id, {
        game_status: "Discussion 3",
      });
    }

    await Promise.all(
      Object.values(items).map((item) =>
        revealCard(round, {
          boardId,
          itemId: item.id,
          userId: item.creator.id,
        })
      )
    );
    setRevealed(true);
  }, [items, boardId, moderatorItem?.id]);

  const [, newRoundHandler] = useAsyncFn(async () => {
    await Promise.all(
      Object.values(items)
        .filter((item) => item.id !== moderatorItem.id)
        .map((item) =>
          updateRow(boardId, item.id, {
            voting_status: "Voting",
          })
        )
    );

    if (round === 1) {
      await updateRow(boardId, moderatorItem.id, {
        game_status: "Round 2",
      });
    }
    if (round === 2) {
      await updateRow(boardId, moderatorItem.id, {
        game_status: "Round 3",
      });
    }
  }, [items, boardId, moderatorItem?.id]);

  const iAmModerator = useIAmModerator();

  return (
    <section className={classes.root}>
      <div className={classes.toolbar}>
        <div>
          <Typography variant="h2">
            {!group ? "Loading..." : group.title}
          </Typography>
          <Typography variant="p" gutterBottom>
            {moderatorItem?.values?.game_status?.text}
          </Typography>
        </div>
        {iAmModerator && phase !== "Session ended" && (
          <Grid variant="row">
            <Button
              kind="secondary"
              loading={endSessionState.loading}
              onClick={endSessionHandler}
            >
              End Session
            </Button>
            {phase.startsWith("Discussion") && round !== 3 && (
              <Button onClick={newRoundHandler}>New round</Button>
            )}
            {phase.startsWith("Round") && round !== 3 && (
              <Button onClick={revealCardsHandler}>Reveal Cards</Button>
            )}
          </Grid>
        )}
      </div>
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
          console.log(vote);
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
  const cardBack = useCardBack(user.id + 3);
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
