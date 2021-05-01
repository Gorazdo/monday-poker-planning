import { Board } from "../Board";
import { CardPickerPane } from "../CardPickerPane";
import { StickyLayout } from "../../library/StickyLayout";
import { BoardProvider } from "../../contexts/BoardContext";

export const PlayingBoard = ({ boardType }) => {
  return (
    <StickyLayout
      topSlot={
        <BoardProvider boardType={boardType}>
          <Board />
        </BoardProvider>
      }
      bottomSlot={<CardPickerPane />}
    />
  );
};
