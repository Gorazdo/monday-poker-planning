import Button from "monday-ui-react-core/dist/Button";
import { useContext } from "react";
import { useAsyncFn } from "react-use";
import { useBoardId } from "../../contexts/AppContext";
import { BoardContext, useModeratorItem } from "../../contexts/BoardContext";
import { usePhase, useRound } from "../../contexts/BoardContext/useRound";

import { Grid } from "../../library/Grid";
import { revealCard } from "../../services/game/revealCard";
import { updateRow } from "../../services/updateRow";

export const GameSessionControls = () => {
  const boardId = useBoardId();
  const [{ items }] = useContext(BoardContext);

  const moderatorItem = useModeratorItem();
  const phase = usePhase(moderatorItem);

  const round = useRound();
  const [endSessionState, endSessionHandler] = useAsyncFn(async () => {
    // refetchFn();

    await updateRow(boardId, moderatorItem.id, {
      game_status: "Session ended",
    });
  }, [boardId, moderatorItem?.id]);

  const [, revealCardsHandler] = useAsyncFn(async () => {
    if (round === 1) {
      await updateRow(boardId, moderatorItem.id, {
        game_status: "Discussion 1",
      });
    }
    if (round === 2) {
      await updateRow(boardId, moderatorItem.id, {
        game_status: "Discussion 2",
      });
    }
    if (round === 3) {
      await updateRow(boardId, moderatorItem.id, {
        game_status: "Discussion 3",
      });
    }

    await Promise.all(
      Object.values(items).map((item) =>
        revealCard(round, {
          boardId,
          itemId: item.id,
          userId: item.creator.id,
        })
      )
    );
    // refetchFn();
  }, [items, boardId, moderatorItem?.id]);

  const [, newRoundHandler] = useAsyncFn(async () => {
    await Promise.all(
      Object.values(items)
        .filter((item) => item.id !== moderatorItem.id)
        .map((item) =>
          updateRow(boardId, item.id, {
            voting_status: "Voting",
          })
        )
    );

    if (round === 1) {
      await updateRow(boardId, moderatorItem.id, {
        game_status: "Round 2",
      });
    }
    if (round === 2) {
      await updateRow(boardId, moderatorItem.id, {
        game_status: "Round 3",
      });
    }
    // refetchFn();
  }, [items, boardId, moderatorItem?.id]);

  return (
    <Grid variant="row">
      {phase.startsWith("Discussion") && round !== 3 && (
        <Button onClick={newRoundHandler}>New round</Button>
      )}
      {phase.startsWith("Round") && round !== 3 && (
        <Button onClick={revealCardsHandler}>Reveal Cards</Button>
      )}
      {phase.startsWith("Round") === false && (
        <Button
          kind="secondary"
          loading={endSessionState.loading}
          onClick={endSessionHandler}
        >
          End Session
        </Button>
      )}
    </Grid>
  );
};
