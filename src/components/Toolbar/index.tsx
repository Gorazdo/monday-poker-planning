import classes from "./index.module.css";
import { Typography } from "../../library/Typography";
import { BoardContext, useModeratorItem } from "../../contexts/BoardContext";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { selectViewMode } from "../../state/contextSlice";
export const Toolbar = () => {
  const moderatorItem = useModeratorItem();
  const [{ group }] = useContext(BoardContext);
  const viewMode = useSelector(selectViewMode);
  return (
    <div className={classes.toolbar}>
      <div className={viewMode === "split" && classes.split}>
        <Typography variant="h2">
          {!group ? "Loading..." : group.title}
        </Typography>
        <Typography variant="p" gutterBottom>
          {moderatorItem?.values?.game_status?.text}
        </Typography>
      </div>
    </div>
  );
};
