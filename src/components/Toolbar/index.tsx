import classes from "./index.module.css";
import { Typography } from "../../library/Typography";
import { BoardContext } from "../../contexts/BoardContext";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { selectViewMode } from "../../state/contextSlice";
import { selectGameStatus } from "../../state/boardSlice";
export const Toolbar = () => {
  const gameStatus = useSelector(selectGameStatus);
  const [{ group }] = useContext(BoardContext);
  const viewMode = useSelector(selectViewMode);
  return (
    <div className={classes.toolbar}>
      <div className={viewMode === "split" && classes.split}>
        <Typography variant="h2">
          {!group ? "Loading..." : group.title}
        </Typography>
        <Typography variant="p" gutterBottom>
          {gameStatus}
        </Typography>
      </div>
    </div>
  );
};
