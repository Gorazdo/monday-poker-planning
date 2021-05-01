import { useContext } from "react";
import { AppContext } from ".";
import { Card, EXTRA_CARDS, FIBONACCHI } from "../../constants/cards";

type Settings = {
  cardsSequence: Card[];
};

export const useSettings = (): Settings => {
  const settings = useContext(AppContext);
  return {
    cardsSequence: [...FIBONACCHI.map(numberToCard), ...EXTRA_CARDS],
  };
};

const numberToCard = (number: number) => ({
  value: number,
  label: String(number),
});
