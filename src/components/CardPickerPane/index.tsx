import classes from "./index.module.css";
import Label from "monday-ui-react-core/dist/Label";
import AttentionBox from "monday-ui-react-core/dist/AttentionBox";
import { PlayingCard } from "../../library/PlayingCard";
import { Typography } from "../../library/Typography";
import { Grid } from "../../library/Grid";
import { useEffect, useState } from "react";
import { Card } from "../../constants/cards";
import { pickCard } from "../../services/game/pickCard";
import { NewGameCreation } from "../NewGameCreation";
import { GameSessionControls } from "../GameSessionControls";
import { useSelector } from "react-redux";
import { selectBoardId, selectViewMode } from "../../state/contextSlice";
import { useCardsSequence } from "../../hooks/useCardsSequence";
import {
  selectBoardStatus,
  selectGameStatus,
  selectModeratorId,
  selectModeratorItemId,
  selectActivePlayersCount,
  selectRound,
  selectIAmModerator,
  selectMyItemId,
} from "../../state/boardSlice";
import { selectMe } from "../../state/meSlice";

export const CardPickerPane = () => {
  const { cardsSequence } = useCardsSequence();
  const [selected, setSelected] = useState<Card["value"]>(null);
  const activePlayersCount = useSelector(selectActivePlayersCount);
  const moderatorId = useSelector(selectModeratorId);
  const moderatorItemId = useSelector(selectModeratorItemId);
  console.log("CardPickerPane", { moderatorId, moderatorItemId });

  const iAmModerator = useSelector(selectIAmModerator);

  const viewMode = useSelector(selectViewMode);
  const phase = useSelector(selectGameStatus);
  const boardStatus = useSelector(selectBoardStatus);

  useEffect(() => {
    setSelected(null);
  }, [phase]);

  if (boardStatus === "pending") {
    return null;
  }
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
      if (activePlayersCount < 2) {
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
  const myItemId = useSelector(selectMyItemId);
  const boardId = useSelector(selectBoardId);
  const me = useSelector(selectMe);
  const round = useSelector(selectRound);
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
            userId: me.id,
            itemId: myItemId,
          }).catch((error) => {
            // error case we unselect
            setSelected(null);
          });
        }}
      />
    </div>
  );
};
