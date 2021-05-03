import LinearProgressBar from "monday-ui-react-core/dist/LinearProgressBar";
import { Grid } from "../Grid";
import { Typography } from "../Typography";
import classes from "./index.module.css";

export const FullScreenLoader = ({ label, percent }) => {
  return (
    <div className={classes.root}>
      <Grid variant="center" className={classes.loaderSize}>
        <Typography variant="h4">{label}</Typography>
        <LinearProgressBar
          min={0}
          max={100}
          value={percent}
          ariaLabel={label}
        />
      </Grid>
    </div>
  );
};
