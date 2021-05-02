import { Board } from "../Board";
import { CardPickerPane } from "../CardPickerPane";
import { StickyLayout } from "../../library/StickyLayout";
import { BoardProvider } from "../../contexts/BoardContext";
import { useBoardId } from "../../contexts/AppContext";
import { GameProvider } from "../../contexts/GameContext";

export const PlayingBoard = ({ boardType }) => {
  const boardId = useBoardId();
  return (
    <BoardProvider boardType={boardType} boardId={boardId}>
      <Wrapper />
    </BoardProvider>
  );
};

const Wrapper = () => {
  return (
    <GameProvider>
      <StickyLayout topSlot={<Board />} bottomSlot={<CardPickerPane />} />
    </GameProvider>
  );
};
