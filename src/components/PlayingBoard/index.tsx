import Button from "monday-ui-react-core/dist/Button";
import { Board } from "../Board";
import { CardPickerPane } from "../CardPickerPane";
import { StickyLayout } from "../../library/StickyLayout";
import { BoardProvider } from "../../contexts/BoardContext";
import { useBoardId } from "../../contexts/AppContext";
import { GameProvider } from "../../contexts/GameContext";
import classes from "./index.module.css";

export const PlayingBoard = ({ boardType }) => {
  const boardId = useBoardId();

  return (
    <BoardProvider boardType={boardType} boardId={boardId}>
      <Wrapper />
    </BoardProvider>
  );
};

const Wrapper = () => {
  const handleClick = () => {};
  return (
    <GameProvider>
      <StickyLayout
        topSlot={<Board />}
        bottomSlot={
          <div className={classes.root}>
            <CardPickerPane />
            <Button kind="tertiary" onClick={() => window.location.reload()}>
              Manual Refresh
            </Button>
          </div>
        }
      />
    </GameProvider>
  );
};
