import { useEffect, useState } from "react";
import { prepareNewlyCreatedBoard } from "../../services/createBoard";

export const useBoardInitialization = ({ boardType, boardId }) => {
  const [hasPrepared, setHasPrepared] = useState(
    boardType === "planning_poker"
  );
  useEffect(() => {
    if (boardType === "readme" && !hasPrepared) {
      prepareNewlyCreatedBoard(boardId).then((res) => {
        setHasPrepared(true);
      });
    } else {
      console.log("board has prepared", { boardType, hasPrepared });
    }
  }, [boardId, boardType, hasPrepared]);
};
