import classes from "./index.module.css";
import { Typography } from "../../library/Typography";
import { BoardContext, useModeratorItem } from "../../contexts/BoardContext";
import { useContext } from "react";
import { useViewMode } from "../../contexts/AppContext/useViewMode";
export const Toolbar = () => {
  const moderatorItem = useModeratorItem();
  const [{ group }] = useContext(BoardContext);
  const viewMode = useViewMode();
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
