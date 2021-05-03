import classes from "./index.module.css";
import { Typography } from "../../library/Typography";
import { useSelector } from "react-redux";
import { selectViewMode } from "../../state/contextSlice";
import { selectGameStatus, selectGroup } from "../../state/boardSlice";
export const Toolbar = () => {
  const gameStatus = useSelector(selectGameStatus);
  const group = useSelector(selectGroup);
  const viewMode = useSelector(selectViewMode);
  return (
    <div className={classes.toolbar}>
      <div className={viewMode === "split" && classes.split}>
        <Typography variant="h2">{group?.title ?? "Loading..."}</Typography>
        <Typography variant="p" gutterBottom>
          {gameStatus}
        </Typography>
      </div>
    </div>
  );
};
