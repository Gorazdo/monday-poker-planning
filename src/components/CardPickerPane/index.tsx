import classes from "./index.module.css";
import Label from "monday-ui-react-core/dist/Label";
import { useSettings } from "../../contexts/AppContext/useSettings";
import { PlayingCard } from "../../library/PlayingCard";
import { Typography } from "../../library/Typography";
import { Grid } from "../../library/Grid";
import { useState } from "react";
import { Card } from "../../constants/cards";
import { pickCard } from "../../services/game/pickCard";

export const CardPickerPane = () => {
  const { cardsSequence } = useSettings();
  const [selected, setSelected] = useState<Card["value"]>(5);
  return (
    <div className={classes.root}>
      <Typography variant="h3" gutterBottom>
        Choose your card <Label text="Voting phase" />
      </Typography>
      <Grid variant="cardsPicker">
        {cardsSequence.map((item) => (
          <div key={item.value} style={{ minWidth: 80 }}>
            <PlayingCard
              {...item}
              selected={item.value === selected}
              variant="face"
              onChange={(value) => {
                setSelected(value);
                pickCard(123, 123, 2, {});
              }}
            />
          </div>
        ))}
      </Grid>
    </div>
  );
};
