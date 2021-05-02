import { BoardItemWithValues } from "../services/types";

export const processItemValues = (item): BoardItemWithValues => {
  const { column_values, ...restItem } = item;
  return {
    ...restItem,
    values: column_values.reduce((acc, item) => {
      acc[item.id] = {
        id: item.id, // columnId
        value: JSON.parse(item.value),
        additional_info: JSON.parse(item.additional_info),
        text: item.text,
        type: item.type, // column type
      };
      return acc;
    }, {}),
  };
};
