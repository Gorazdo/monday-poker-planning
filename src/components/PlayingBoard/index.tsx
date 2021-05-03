import Button from "monday-ui-react-core/dist/Button";
import { Board } from "../Board";
import { CardPickerPane } from "../CardPickerPane";
import { StickyLayout } from "../../library/StickyLayout";
import { BoardProvider } from "../../contexts/BoardContext";
import { GameProvider } from "../../contexts/GameContext";
import classes from "./index.module.css";
import { Toolbar } from "../Toolbar";
import { useSelector } from "react-redux";
import { selectViewMode } from "../../state/contextSlice";

export const PlayingBoard = ({ boardType }) => {
  return (
    <BoardProvider boardType={boardType}>
      <Wrapper />
    </BoardProvider>
  );
};

const Wrapper = () => {
  const viewMode = useSelector(selectViewMode);
  return (
    <GameProvider>
      <StickyLayout
        topSlot={<Board />}
        bottomSlot={
          <div className={classes.root}>
            {viewMode === "split" && <Toolbar />}
            <CardPickerPane />
            <Button
              kind="secondary"
              size="small"
              className={classes.manualButton}
              onClick={() => window.location.reload()}
            >
              Manual Refresh
            </Button>
          </div>
        }
      />
    </GameProvider>
  );
};
