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
};

export type BoardSummaryType = {
  id: string;
  name: string;
  items: BoardItem[];
  groups: BoardGroup[];
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