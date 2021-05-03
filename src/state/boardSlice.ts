import {
  createSlice,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { RoundNumber, Vote } from "../constants/cards";
import { VotingStatusType } from "../services/createColumn";
import { GameStatus } from "../services/types";
import { RootState } from "./store";
import { StatusType } from "./types";

interface BoardState {
  status: StatusType;
  game_status?: GameStatus;
  moderatorId?: number;
  group?: {
    id: string;
    title: string;
  };
}

type Item = {
  id: string;
  userId: string;
  userName: string;
  voting_status: VotingStatusType;
  votes: Record<RoundNumber, Vote>;
};

const itemsAdapter = createEntityAdapter<Item>();

const initialState: BoardState = {
  status: "pending",
};

export const boardSlice = createSlice({
  name: "board",
  initialState: itemsAdapter.getInitialState(initialState),
  reducers: {},
});

const sliceSelector = (state: RootState) => state.board;
