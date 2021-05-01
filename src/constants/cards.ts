export const FIBONACCHI = [1, 2, 3, 5, 8, 13, 21, 34];
export const SCRUM = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100];

export const EXTRA_CARDS: Card[] = [
  { value: "infinity", label: "∞", fontSize: 40 },
  { value: "what", label: "What?", fontSize: 18 },
  { value: "coffee-break", label: "I need some Coffee", fontSize: 18 },
];

export type Card = {
  value: number | "infinity" | "coffee-break" | "what";
  fontSize?: number;
  label: string;
};

export const CARD_BACKS = [
  "violet",
  "blue",
  "yellow",
  "pink",
  "green",
  "violet",
];
