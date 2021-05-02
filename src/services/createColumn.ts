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

export const STORY_POINTS_COLUMN_PROPS = {
  function: "median",
  unit: { symbol: "custom", custom_unit: " SP", direction: "right" },
} as const;

export const VOTING_STATUS_COLUMN_PROPS = {
  done_colors: [2],
  color_mapping: {
    "0": 7,
    "1": 9,
    "2": 1,
    "3": 4,
    "4": 105,
    "6": 2,
    "7": 12,
    "9": 0,
    "12": 6,
    "14": 3,
    "104": 14,
    "105": 104,
  },
  labels: {
    "0": "Joined",
    "1": "Voting",
    "2": "Voted",
    "3": "Pending",
    "4": "Left",
    "5": "Moderator",
    "6": "",
  },
  labels_positions_v2: {
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
  },
  labels_colors: {
    "0": { color: "#579bfc", border: "#4387E8", var_name: "bright-blue" },
    "1": { color: "#FFCB00", border: "#C0AB1B", var_name: "yellow" },
    "2": { color: "#00c875", border: "#00B461", var_name: "green-shadow" },
    "3": { color: "#a25ddc", border: "#9238AF", var_name: "purple" },
    "4": { color: "#9AADBD", border: "#9AADBD", var_name: "winter" },
    "5": { color: "#e2445c", border: "#CE3048", var_name: "red-shadow" },
    "6": { color: "#c4c4c4", border: "#B0B0B0", var_name: "grey" },
  },
} as const;

export const VOTING_STATUSES = Object.values(VOTING_STATUS_COLUMN_PROPS.labels);

export type VotingStatusType = typeof VOTING_STATUSES[number];
