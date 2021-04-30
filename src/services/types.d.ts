export type AccountInfo = {
  id: string;
  name: string;
  slug: string;
};

export type BoardItem = {
  id: string;
  name: string;
  creator: {
    id: number;
    name: string;
  };
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
