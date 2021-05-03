import Button from "monday-ui-react-core/dist/Button";
import { useSelector } from "react-redux";
import { useAsyncFn } from "react-use";

import { Grid } from "../../library/Grid";
import { revealCard } from "../../services/game/revealCard";
import { updateRow } from "../../services/updateRow";
import {
  selectActivePlayers,
  selectGameStatus,
  selectModeratorItemId,
  selectRound,
  selectVotingPlayers,
} from "../../state/boardSlice";
import { selectBoardId } from "../../state/contextSlice";

export const GameSessionControls = () => {
  const boardId = useSelector(selectBoardId);
  const players = useSelector(selectActivePlayers);
  const voters = useSelector(selectVotingPlayers);

  const moderatorItemId = useSelector(selectModeratorItemId);
  const phase = useSelector(selectGameStatus);
  const round = useSelector(selectRound);

  const [endSessionState, endSessionHandler] = useAsyncFn(async () => {
    // refetchFn();

    await updateRow(boardId, moderatorItemId, {
      game_status: "Session ended",
    });
  }, [boardId, moderatorItemId]);

  const [, revealCardsHandler] = useAsyncFn(async () => {
    if (round === 1) {
      await updateRow(boardId, moderatorItemId, {
        game_status: "Discussion 1",
      });
    }
    if (round === 2) {
      await updateRow(boardId, moderatorItemId, {
        game_status: "Discussion 2",
      });
    }
    if (round === 3) {
      await updateRow(boardId, moderatorItemId, {
        game_status: "Discussion 3",
      });
    }

    await Promise.all(
      players.map((player) =>
        revealCard(round, {
          boardId,
          itemId: player.itemId,
          userId: player.id,
        })
      )
    );
  }, [players, boardId, moderatorItemId]);

  const [, newRoundHandler] = useAsyncFn(async () => {
    await Promise.all(
      voters.map((player) =>
        updateRow(boardId, player.itemId, {
          voting_status: "Voting",
        })
      )
    );

    if (round === 1) {
      await updateRow(boardId, moderatorItemId, {
        game_status: "Round 2",
      });
    }
    if (round === 2) {
      await updateRow(boardId, moderatorItemId, {
        game_status: "Round 3",
      });
    }
    // refetchFn();
  }, [voters, boardId, moderatorItemId]);

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
