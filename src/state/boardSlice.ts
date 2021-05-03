import {
  createSlice,
  createSelector,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RoundNumber, Vote } from "../constants/cards";
import { VotingStatusType } from "../services/createColumn";
import { fetchGroupItemsAndValues } from "../services/fetchBoardItemsAndValues";
import { BoardItemWithValues, GameStatus } from "../services/types";
import { RootState } from "./store";
import { StatusType } from "./types";
import { selectUsers } from "./usersSlice";
import { selectMe } from "./meSlice";

interface BoardState {
  status: StatusType;
  game_status?: GameStatus;
  moderatorId?: number;
  moderatorItemId?: string;
  group?: {
    id: string;
    title: string;
  };
}

type Item = {
  id: string;
  userId: number;
  userName: string;
  voting_status: VotingStatusType;
  votes: Record<RoundNumber, Vote>;
};

const itemsAdapter = createEntityAdapter<Item>();

export const fetchCurrentItemsThunk = createAsyncThunk<
  BoardItemWithValues[],
  { boardId: string; groupId: string },
  {}
>(
  "board/fetchItems",
  async ({ boardId, groupId }, thunkApi) => {
    const state = thunkApi.getState();
    const data = await fetchGroupItemsAndValues(boardId, groupId);
    return data;
  },
  {
    condition: (stub, { getState }: any) => {
      const { context, board } = getState();
      if (!context || !board.group) {
        return false;
      }
    },
  }
);

const initialState: BoardState = {
  status: "pending",
};

export const boardSlice = createSlice({
  name: "board",
  initialState: itemsAdapter.getInitialState(initialState),
  reducers: {
    setGroup: (state, action) => {
      state.group = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder.addCase(fetchCurrentItemsThunk.fulfilled, (state, action) => {
      const payload = action.payload as BoardItemWithValues[];
      const moderator = payload.find((item) => {
        return item.values.voting_status.text === "Moderator";
      });
      state.status = "fulfilled";
      if (moderator) {
        state.moderatorId = moderator.creator.id;
        state.moderatorItemId = moderator.id;
        state.game_status = moderator.values.game_status.text as GameStatus;
      }
      const processedItems = payload.map((item) => {
        return {
          id: item.id,
          userId: item.creator.id,
          userName: item.creator.name,
          voting_status: item.values.voting_status.text as VotingStatusType,
          votes: {
            1: item.values.round_1.value as Vote,
            2: item.values.round_2.value as Vote,
            3: item.values.round_3.value as Vote,
          },
        };
      });
      itemsAdapter.setAll(state, processedItems);
    }),
});

const sliceSelector = (state: RootState) => state.board;

export const selectBoardStatus = createSelector(
  sliceSelector,
  (board) => board.status
);
export const selectGroup = createSelector(sliceSelector, (board) => {
  return board.group;
});
export const selectGroupId = createSelector(sliceSelector, (board) => {
  return board.group?.id;
});

export const selectRound = createSelector(sliceSelector, (board) => {
  if (!board.game_status) {
    return 1;
  }
  if (
    board.game_status.startsWith("Round") ||
    board.game_status.startsWith("Discussion")
  ) {
    return Number(board.game_status.split(" ")[1]) as RoundNumber;
  }
  return 1;
});

export const selectGameStatus = createSelector(sliceSelector, (board) => {
  return board.game_status ?? null;
});

export const selectModeratorId = createSelector(sliceSelector, (board) => {
  return board.moderatorId;
});

export const selectModeratorItemId = createSelector(sliceSelector, (board) => {
  return board.moderatorItemId;
});

export const selectPlayers = createSelector(
  sliceSelector,
  selectUsers,
  selectRound,
  (board, users, round): Player[] => {
    const boardItems = Object.values(board.entities);
    return users.map((user) => {
      const userItem = boardItems.find((item) => item.userId === user.id);
      if (!userItem) {
        // user if offline
        return {
          id: user.id,
          joined: false,
          voting_status: "Left",
          sortkey: 1000000000 + user.id,
          vote: null,
        };
      }
      return {
        id: user.id,
        joined: true,
        itemId: userItem.id,
        voting_status: userItem.voting_status,
        sortkey: userItem.voting_status === "Moderator" ? 0 : user.id,
        vote: userItem.votes[round],
      };
    });
  }
);

export const selectActivePlayers = createSelector(selectPlayers, (players) => {
  return players.filter((player) => player.joined);
});

export const selectActivePlayersCount = createSelector(
  selectActivePlayers,
  (players) => {
    return players.length;
  }
);

export const selectVotingPlayers = createSelector(
  selectActivePlayers,
  selectModeratorId,
  (players, moderatorId) => {
    return players.filter((player) => player.id !== moderatorId);
  }
);

export const selectMyItemId = createSelector(
  selectActivePlayers,
  selectMe,
  (players, me) => {
    return players.find((player) => player.id === me.id)?.itemId;
  }
);

export const selectIAmModerator = createSelector(
  selectModeratorId,
  selectMe,
  (moderatorId, me) => {
    return moderatorId && me.id === moderatorId;
  }
);

type Player = {
  id: number;
  joined: boolean;
  voting_status: VotingStatusType;
  sortkey: number;
  vote: Vote;
  itemId?: string;
};
