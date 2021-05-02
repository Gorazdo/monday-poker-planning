import { Vote } from "../constants/cards";
import {
  VotingStatusType,
  VOTING_STATUSES,
  VOTING_STATUS_COLUMN_PROPS,
} from "./createColumn";

export type BoardType =
  | "default_template" // a default newly created board
  | "empty" // a board created via API
  | "readme" // a board created via API and filled with demo
  | "prepared" //
  | "planning_poker" // correctly set up board
  | "danger" // a board with real data
  | "unknown";

export type AccountInfo = {
  id: string;
  name: string;
  slug: string;
};

export type Board = {
  id: string;
  name: string;
  owner: {
    account: AccountInfo;
  };
};

export type BoardItem = {
  id: string;
  name: string;
  creator: {
    id: number;
    name: string;
  };
};

export type BoardItemWithValues = BoardItem & {
  values: Record<string, ItemValue>;
};

export type BoardItemWithValuesAndGroup = BoardItem & {
  values: Record<string, ItemValue>;
  group: Pick<BoardGroup, "id" | "title">;
};

export type ItemValue = {
  id: string;
  value: null | string | Record<string, any>;
  additional_info: null | string | Record<string, any>;
  text: string;
  type: ColumnType;
};

export type BoardItemWithGroup = BoardItem & {
  group: Pick<BoardGroup, "id" | "title">;
};

export type BoardKind = "public" | "private" | "share";

export type BoardColumn = {
  id: string;
  title: string;
  type: string;
  archived: string;
  settings_str: string;
  pos: null | string;
  width: null | number;
};

export type BoardGroup = {
  id: string;
  title: string;
  color: string;
  position?: string;
};

export type BoardSummaryType = {
  id: string;
  name: string;
  columns: Pick<BoardColumn, "id">[];
  items: BoardItem[];
  groups: BoardGroup[];
};

export type User = {
  id: number;
  is_admin: boolean;
  is_pending: boolean;
  is_view_only: boolean;
  is_guest: boolean;
  name: string;
  title: null | string;
  photo_thumb: string;
};

export type GameStatus = "Round 1" | "Round 2" | "Round 3" | "Session ended";

export type RowValues = {
  voting_status: VotingStatusType;
  round_1: number;
  round_2: number;
  round_3: number;
  player: number | string;
  vote: Vote;
  game_status: GameStatus;
};

export type Player = {
  voting_status?: RowValues["voting_status"];
  name: User["name"];
  id: User["id"];
  vote: null | Vote;
};

export type ColumnType =
  | "auto_number"
  | "checkbox"
  | "country"
  | "color_picker"
  | "creation_log"
  | "date"
  | "dropdown"
  | "email"
  | "file"
  | "hour"
  | "item_id"
  | "last_updated"
  | "link"
  | "location"
  | "long_text"
  | "numbers"
  | "people"
  | "phone"
  | "progress"
  | "rating"
  | "status"
  | "team"
  | "tags"
  | "text"
  | "timeline"
  | "time_tracking"
  | "vote"
  | "week"
  | "world_clock"
  | "integration";

export type StatusMap = Record<string, "pending" | "fulfilled" | Error>;

export type MondayEvent = {
  type: "change_column_values" | string;
  boardId: number;
  itemIds: number[];
};
