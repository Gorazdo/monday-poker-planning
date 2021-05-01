import { Board } from "../Board";
import { CardPickerPane } from "../CardPickerPane";
import { StickyLayout } from "../../library/StickyLayout";

export const PlayingBoard = () => {
  return <StickyLayout topSlot={<Board />} bottomSlot={<CardPickerPane />} />;
};
