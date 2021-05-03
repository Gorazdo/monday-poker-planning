import { useEffect, useState } from "react";
import { prepareNewlyCreatedBoard } from "../../services/createBoard";
import {
  createColumnCreator,
  SESSION_DURATION_COLUMN_PROPS,
  STORY_POINTS_COLUMN_PROPS,
  VOTING_STATUS_COLUMN_PROPS,
} from "../../services/createColumn";
import { fetchColumns } from "../../services/fetchColumns";
import { normalizeById } from "../../utils/normalizers";

export const useBoardInitialization = ({ boardType, boardId, setStatus }) => {
  const [hasPrepared, setHasPrepared] = useState(
    boardType === "planning_poker"
  );
  useEffect(() => {
    if (hasPrepared) {
      setStatus("prepared", "fulfilled");
    }
  }, [hasPrepared]);
  useEffect(() => {
    if (hasPrepared) {
      fetchColumns(boardId).then((columns) => {
        if (columns.length < 9) {
          console.error("Planning Poker App: Missing columns");
          console.log(columns);
          const normalizedColumns = normalizeById(columns);
          // const createColumn = createColumnCreator(boardId);
          // if (!normalizedColumns["voting_status"]) {
          //   createColumn("Voting Status", "status", VOTING_STATUS_COLUMN_PROPS);
          // }
          // if (!normalizedColumns["session_duration"]) {
          //   createColumn(
          //     "Session Duration",
          //     "numbers",
          //     SESSION_DURATION_COLUMN_PROPS
          //   );
          // }
          // if (!normalizedColumns["round_1"]) {
          //   createColumn("Round 1", "numbers", STORY_POINTS_COLUMN_PROPS);
          // }
          // if (!normalizedColumns["round_2"]) {
          //   createColumn("Round 2", "numbers", STORY_POINTS_COLUMN_PROPS);
          // }
          // if (!normalizedColumns["round_3"]) {
          //   createColumn("Round 3", "numbers", STORY_POINTS_COLUMN_PROPS);
          // }
        }
      });
    }
  }, [boardId]);

  useEffect(() => {});
  useEffect(() => {
    if (boardType === "readme" && !hasPrepared) {
      prepareNewlyCreatedBoard(boardId).then((res) => {
        console.log("prepareNewlyCreatedBoard", res);
        setHasPrepared(true);
      });
    } else {
      console.log("board has prepared", { boardType, hasPrepared });
    }
  }, [boardId, boardType, hasPrepared]);
};
