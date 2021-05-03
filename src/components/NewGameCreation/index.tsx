import EditableInput from "monday-ui-react-core/dist/EditableInput";
import Button from "monday-ui-react-core/dist/Button";
import { useState } from "react";
import { createGroup } from "../../services/createGroup";
import { useAsyncFn } from "react-use";
import { useMyItem } from "../../contexts/GameContext";
import { Grid } from "../../library/Grid";
import classes from "./index.module.css";
import { updateRow } from "../../services/updateRow";
import { useSetBoardContext } from "../../contexts/BoardContext/useSetBoardContext";
import { useSelector } from "react-redux";
import { selectBoardId } from "../../state/contextSlice";

export const NewGameCreation = () => {
  const [state, setState] = useState("");
  const setBoardContext = useSetBoardContext();
  const boardId = useSelector(selectBoardId);
  const myItem = useMyItem();
  const [{ loading }, startNewGameHandler] = useAsyncFn(async () => {
    console.log("New Game Is Loading", loading);
    if (loading || !state) {
      return;
    }
    const group = await createGroup(boardId, state);
    console.log(group);
    const row = await updateRow(boardId, myItem.id, {
      game_status: "New Game",
    });
    setBoardContext("group", group);

    console.log(row);
  }, [boardId, myItem.id, state, setBoardContext]);
  return (
    <Grid>
      <div className={classes.inputWrapper}>
        <EditableInput
          value={state}
          aria-label="The subject of planning session"
          ariaLabel={undefined}
          className={classes.input}
          onKeyPress={(event) => {
            if (event.code === "Enter" && event.target.value.length > 2) {
              startNewGameHandler();
            }
          }}
          onChange={(phrase) => {
            setState(phrase);
          }}
          placeholder="Please, enter the subject of planning session"
        />
        <Button loading={loading} onClick={startNewGameHandler}>
          Start New Game
        </Button>
      </div>
    </Grid>
  );
};
