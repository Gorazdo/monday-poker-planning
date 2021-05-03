import { useContext, useMemo } from "react";
import { Card, EXTRA_CARDS, FIBONACCHI, SCRUM } from "../constants/cards";

import { useSelector } from "react-redux";
import { selectSequenceType } from "../state/settingsSlice";
import { RootState } from "../state/store";

const SEQUENCE_SETTING_MAP = {
  Scrum: SCRUM,
  Fibonacci: FIBONACCHI,
};

const useSequence = (setting?: RootState["settings"]["sequence"]) => {
  return useMemo(() => {
    const baseSequence = SEQUENCE_SETTING_MAP[setting] ?? FIBONACCHI;
    const cardsSequence = [
      ...baseSequence.map((number) => numberToCard(number)),
      ...EXTRA_CARDS,
    ];
    return cardsSequence;
  }, []);
};

export const useCardsSequence = () => {
  const sequenceType = useSelector(selectSequenceType);
  const cardsSequence = useSequence(sequenceType);
  return useMemo(
    () => ({
      cardsSequence,
      cardsMap: cardsSequence.reduce((acc, card) => {
        acc[card.value] = card;
        return acc;
      }, {}),
    }),
    [cardsSequence]
  );
};

const numberToCard = (number: number) => ({
  value: number,
  label: number.toLocaleString(),
});
