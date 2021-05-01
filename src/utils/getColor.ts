import colors from "monday-ui-react-core/dist/assets/colors.json";

type ColorName = keyof typeof colors;

export const getColor = (colorName: ColorName) => {
  return colors[colorName];
};

export const mondayColors = colors as Record<ColorName, string>;
