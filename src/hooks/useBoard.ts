import { useAsync } from "react-use";
import { monday } from "../services/monday";

export const useBoardContext = () => {
  return useAsync(async () => {
    return await fetchContext();
    // in real board
    // boardId: 1249871037
    // boardIds: [1249871037]
    // boardViewId: 22780000
    // instanceId: 22780000
    // instanceType: "board_view"
    // theme: "light"
    // user: {id: "21754841", isAdmin: false, isGuest: false, isViewOnly: false}
    // viewMode: "fullScreen"
    // workspaceId: -1

    // in preview mode
    // boardIds: [1249871037]
    // editMode: true
    // instanceId: -1
    // instanceType: "board_view"
    // itemIds: undefined
    // theme: "light"
    // user: {id: "21749286", isAdmin: true, isGuest: false, isViewOnly: false}
    // viewMode: "fullscreen"
  }, []);
};

const fetchContext = async () => {
  const response = await monday.get("context");
  return response.data;
};

type Group = {
  id: string;
  title: string;
  color: string;
};

const fetchBoardGroups = async (id: number): Promise<Group[]> => {
  const response = await monday.api(`#graphql
    {
      boards(ids: 1249871037) {
        groups { 
          id 
          title 
          color 
        }
      }
    }
  `);
  return response.data.boards[0].groups;
};

type Item = {
  id: string;
  name: string;
  creator: {
    id: number;
    name: string;
  };
};

const fetchBoardItems = async (id: number): Promise<Item[]> => {
  const response = await monday.api(`#graphql
    {
      boards(ids: ${id}) {
        items { 
          id 
          name 
          creator {
            id
            name
          }
        }
      }
    }
  `);
  return response.data.boards[0].items;
};

type BoardSummaryType = {
  id: string;
  name: string;
  items: Item[];
  groups: Group[];
};

export const fetchBoardSummary = async (): Promise<BoardSummaryType> => {
  const { boardId, boardIds } = await fetchContext();
  const id = boardId ?? boardIds[0];

  const response = await monday.api(`#graphql
    {
      boards(ids: ${id}) {
        name
        items { 
          id 
          name 
          creator {
            id
            name
          }
        }
        groups { 
          id 
          title 
          color 
        }
      }
    }
  `);

  return response.data.boards[0];
};

export const useBoardSummary = () => useAsync(fetchBoardSummary, []);
