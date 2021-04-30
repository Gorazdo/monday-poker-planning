const EMOJIES = [
  "⛵️",
  "🚂",
  "🚲",
  "🏠",
  "🎇",
  "🚀",
  "🚗",
  "🌄",
  "🌠",
  "🌌",
  "🧭",
  "⏱",
  "🧲",
  "🎉",
  "🎎",
  "🧸",
  "🧮",
  "🃏",
  "🎴",
];

const getRandomInteger = (max: number): number => {
  return Math.floor(Math.random() * max);
};

export const getRandomEmojie = () => {
  return EMOJIES[getRandomInteger(EMOJIES.length)];
};
