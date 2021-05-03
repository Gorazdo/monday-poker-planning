import classes from "./index.module.css";
import Label from "monday-ui-react-core/dist/Label";
import AttentionBox from "monday-ui-react-core/dist/AttentionBox";
import { PlayingCard } from "../../library/PlayingCard";
import { Typography } from "../../library/Typography";
import { Grid } from "../../library/Grid";
import { useContext, useEffect, useState } from "react";
import { Card } from "../../constants/cards";
import { pickCard } from "../../services/game/pickCard";
import { useMySpace } from "../../contexts/BoardContext/useMySpace";
import { BoardContext, useModeratorItem } from "../../contexts/BoardContext";
import { updateRow } from "../../services/updateRow";
import { useIAmModerator, useMyItem } from "../../contexts/GameContext";
import { useAsyncFn } from "react-use";
import { NewGameCreation } from "../NewGameCreation";
import { usePhase, useRound } from "../../contexts/BoardContext/useRound";
import { GameSessionControls } from "../GameSessionControls";
import { GameStatus } from "../../services/types";
import { usePlayers } from "../../hooks/usePlayers";
import { useSelector } from "react-redux";
import { selectBoardId, selectViewMode } from "../../state/contextSlice";
import { useCardsSequence } from "../../hooks/useCardsSequence";

export const CardPickerPane = () => {
  const { cardsSequence } = useCardsSequence();
  const boardId = useSelector(selectBoardId);
  const myItem = useMyItem();
  const [selected, setSelected] = useState<Card["value"]>(null);
  const players = usePlayers();
  const [, boardActions] = useContext(BoardContext);
  const moderatorItem = useModeratorItem();
  console.log("CardPickerPane", { moderatorItem, myItem });

  const [{ loading }, becomeModeratorFn] = useAsyncFn(async () => {
    if (moderatorItem) {
      // we mark current moderator as a player
      await updateRow(boardId, moderatorItem.id, {
        voting_status: "Joined",
      });

      // we mark ourself as a moderator and copy value of previous moderator
      await updateRow(boardId, myItem.id, {
        voting_status: "Moderator",
        game_status: moderatorItem.values.game_status.value as GameStatus,
      });
    } else {
      // there was no moderator, so we simply mark ourself as one
      await updateRow(boardId, myItem.id, {
        voting_status: "Moderator",
      });
    }
  }, [boardId, moderatorItem, myItem, boardActions.set]);

  const iAmModerator = useIAmModerator();

  const viewMode = useSelector(selectViewMode);
  const phase = usePhase(moderatorItem);

  useEffect(() => {
    setSelected(null);
  }, [phase]);

  if (phase === null) {
    return (
      <AttentionBox
        title="Something went wrong"
        text="Please, press [Manual Refresh] button"
      />
    );
  }
  if (phase.startsWith("Discussion")) {
    return (
      <div>
        <Typography variant="h3" className={classes.typography}>
          Let's discuss the numbers!{" "}
          <span className={classes.label}>
            <Label text="Discussion phase" />
          </span>
        </Typography>
        {iAmModerator && <GameSessionControls />}
      </div>
    );
  }
  if (phase.startsWith("Round")) {
    if (iAmModerator) {
      if (Object.values(players).length === 1) {
        return (
          <div>
            <Typography variant="h3" className={classes.typography}>
              Waiting for others{" "}
              <span className={classes.label}>
                <Label text="Invite them" />
              </span>
            </Typography>
            <Typography variant="h5">
              Tip: Share the URL of this page with your teammates
            </Typography>
          </div>
        );
      }
      return (
        <div>
          <Typography variant="h3" className={classes.typography}>
            Players is making their choice{" "}
            <span className={classes.label}>
              <Label text="Voting phase" />
            </span>
          </Typography>
          <GameSessionControls />
        </div>
      );
    }
    return (
      <div>
        {viewMode !== "split" && (
          <Typography variant="h3" className={classes.typography}>
            Choose your card{" "}
            <span className={classes.label}>
              <Label text="Voting phase" />
            </span>
          </Typography>
        )}
        <Grid variant="cardsPicker">
          {cardsSequence.map((item) => (
            <PickCard
              key={item.value}
              item={item}
              selected={selected}
              setSelected={setSelected}
            />
          ))}
        </Grid>
      </div>
    );
  }

  if (phase === "Session ended") {
    if (iAmModerator) {
      return (
        <div>
          <Typography variant="h3" className={classes.typography}>
            Are you ready for a new game?{" "}
            <span className={classes.label}>
              <Label text="New round" />
            </span>
          </Typography>
          <NewGameCreation />
        </div>
      );
    }
    return (
      <div>
        <Typography variant="h3" className={classes.typography}>
          You can take control!{" "}
          <span className={classes.label}>
            <Label text="New game?" />
          </span>
        </Typography>
        <NewGameCreation />
      </div>
    );
  }
  return <div>Unknown phase: {phase}</div>;
};

const PickCard = ({ item, selected, setSelected }) => {
  const { boardId, userId, itemId } = useMySpace();
  const round = useRound();
  return (
    <div key={item.value} style={{ minWidth: 80 }}>
      <PlayingCard
        {...item}
        selected={item.value === selected}
        variant="face"
        onChange={(value) => {
          setSelected(value);
          pickCard(round, value, {
            boardId,
            userId,
            itemId,
          }).catch((error) => {
            // error case we unselect
            setSelected(null);
          });
        }}
      />
    </div>
  );
};
