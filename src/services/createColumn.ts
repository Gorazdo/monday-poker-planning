import { stringifyJsonForGql } from "../utils";
import { monday } from "./monday";
import { Board, BoardColumn, ColumnType } from "./types";

type PartialColumnType = Pick<BoardColumn, "id" | "settings_str">;

export const createColumnCreator = (boardId: Board["id"]) => async (
  title: string,
  type: ColumnType,
  defaults: any = {}
): Promise<PartialColumnType> => {
  const stringifiedDefaults = stringifyJsonForGql(defaults);
  const response = await monday.api(`#graphql
    mutation {
      create_column (board_id: ${boardId}, title: "${title}", column_type: ${type}, defaults: ${stringifiedDefaults}) {
        id
        settings_str
      }
    }
  `);
  return response.data.create_column;
};

export const STORY_POINTS = {
  function: "median",
  unit: { symbol: "custom", custom_unit: " SP", direction: "right" },
};

export const VOTING_STATUSES = {
  labels: {
    "0": "Ready",
    "1": "Voting",
    "2": "Voted",
    "3": "Absent today",
  },
  labels_colors: {
    "0": { color: "#9AADBD", border: "#9AADBD", var_name: "winter" },
    "1": { color: "#00c875", border: "#00c875", var_name: "lime-green" },
    "2": { color: "#037f4c", border: "#037f4c", var_name: "grass-green" },
    "3": { color: "#AD967A", border: "#AD967A", var_name: "corona" },
  },
};
