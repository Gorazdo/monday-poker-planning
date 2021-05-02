import { useContext, useMemo } from "react";
import { AppContext } from ".";
import { Card, EXTRA_CARDS, FIBONACCHI, SCRUM } from "../../constants/cards";

type Settings = {
  cardsSequence: Card[];
  cardsMap: Record<string, Card>;
};

const SEQUENCE_SETTING_MAP = {
  Scrum: SCRUM,
  Fibonacchi: FIBONACCHI,
};

const useSequence = (setting?: string) => {
  return useMemo(() => {
    const baseSequence = SEQUENCE_SETTING_MAP[setting] ?? FIBONACCHI;
    const cardsSequence = [
      ...baseSequence.map((number) => numberToCard(number)),
      ...EXTRA_CARDS,
    ];
    return cardsSequence;
  }, []);
};

export const useSettings = (): Settings => {
  const settings = useContext(AppContext);
  const cardsSequence = useSequence();
  return {
    cardsSequence,
    cardsMap: cardsSequence.reduce((acc, card) => {
      acc[card.value] = card;
      return acc;
    }, {}),
  };
};

const numberToCard = (number: number) => ({
  value: number,
  label: number.toLocaleString(),
});
