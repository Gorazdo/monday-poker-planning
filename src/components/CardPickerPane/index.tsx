import classes from "./index.module.css";
import Label from "monday-ui-react-core/dist/Label";
import Button from "monday-ui-react-core/dist/Button";
import { useSettings } from "../../contexts/AppContext/useSettings";
import { PlayingCard } from "../../library/PlayingCard";
import { Typography } from "../../library/Typography";
import { Grid } from "../../library/Grid";
import { useContext, useEffect, useState } from "react";
import { Card } from "../../constants/cards";
import { pickCard } from "../../services/game/pickCard";
import { useBoardId } from "../../contexts/AppContext";
import { useMySpace } from "../../contexts/BoardContext/useMySpace";
import { BoardContext, useModeratorItem } from "../../contexts/BoardContext";
import { updateRow } from "../../services/updateRow";
import { useIAmModerator, useMyItem } from "../../contexts/GameContext";
import { useAsyncFn } from "react-use";
import { NewGameCreation } from "../NewGameCreation";
import { usePhase, useRound } from "../../contexts/BoardContext/useRound";

export const CardPickerPane = () => {
  const { cardsSequence } = useSettings();
  const boardId = useBoardId();
  const myItem = useMyItem();
  const [selected, setSelected] = useState<Card["value"]>(null);

  const [, boardActions] = useContext(BoardContext);
  const moderatorItem = useModeratorItem();
  console.log("CardPickerPane", { moderatorItem, myItem });

  const [{ loading }, becomeModeratorFn] = useAsyncFn(async () => {
    if (moderatorItem !== null) {
      await updateRow(boardId, moderatorItem.id, {
        voting_status: "Joined",
      });
    }
    const result = await updateRow(boardId, myItem.id, {
      voting_status: "Moderator",
    });
    console.log(result);
  }, [boardId, moderatorItem, myItem, boardActions.set]);

  const iAmModerator = useIAmModerator();

  const phase = usePhase(moderatorItem);
  useEffect(() => {
    setSelected(null);
  }, [phase]);
  if (phase === null) {
    return null;
  }
  if (phase.startsWith("Discussion")) {
    return (
      <div>
        <Typography variant="h3" gutterBottom>
          Let's discuss the numbers!{" "}
          <span className={classes.label}>
            <Label text="Discussion phase" />
          </span>
        </Typography>
      </div>
    );
  }
  if (phase.startsWith("Round")) {
    if (iAmModerator) {
      return (
        <div>
          <Typography variant="h3" gutterBottom>
            Players is making their choice{" "}
            <span className={classes.label}>
              <Label text="Voting phase" />
            </span>
          </Typography>
        </div>
      );
    }
    return (
      <div>
        <Typography variant="h3" gutterBottom>
          Choose your card{" "}
          <span className={classes.label}>
            <Label text="Voting phase" />
          </span>
        </Typography>
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
          <NewGameCreation />
        </div>
      );
    }
    return (
      <div>
        <Button onClick={becomeModeratorFn} loading={loading}>
          Become a moderator
        </Button>
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
