import AttentionBox from "monday-ui-react-core/dist/AttentionBox";
import LinearProgressBar from "monday-ui-react-core/dist/LinearProgressBar";
import { Grid } from "../Grid";
import { Typography } from "../Typography";
import classes from "./index.module.css";

export const FullScreenLoader = ({ label, statuses, percent }) => {
  const error = Object.values(statuses).find(
    (status) => status instanceof Error
  ) as Error | undefined;
  if (error) {
    return (
      <div className={classes.root}>
        <AttentionBox
          type="danger"
          title={`${error.name}: ${error.message}`}
          text="Try to refresh a page or run the App in a proper environment"
        />
      </div>
    );
  }
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
