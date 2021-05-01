import { createContext } from "react";
import { mondayColors } from "../../utils/getColor";

export const ThemeContext = createContext({});

const MONDAY_GRID_UNIT = 8;
export const ThemeProvider = ({ children }) => {
  const value = {
    colors: mondayColors,
    spacing,
    unit: MONDAY_GRID_UNIT,
  };
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

const spacing = (spacing: number, px = true): string | number => {
  if (px) {
    return MONDAY_GRID_UNIT * spacing + "px";
  }
  return MONDAY_GRID_UNIT * spacing;
};
