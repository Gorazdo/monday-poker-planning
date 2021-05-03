import Button from "monday-ui-react-core/dist/Button";
import { Board } from "../Board";
import { CardPickerPane } from "../CardPickerPane";
import { StickyLayout } from "../../library/StickyLayout";
import { BoardProvider } from "../../contexts/BoardContext";
import { useBoardId } from "../../contexts/AppContext";
import { GameProvider } from "../../contexts/GameContext";
import classes from "./index.module.css";
import { useViewMode } from "../../contexts/AppContext/useViewMode";
import { Toolbar } from "../Toolbar";

export const PlayingBoard = ({ boardType }) => {
  const boardId = useBoardId();

  return (
    <BoardProvider boardType={boardType} boardId={boardId}>
      <Wrapper />
    </BoardProvider>
  );
};

const Wrapper = () => {
  const viewMode = useViewMode();
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
