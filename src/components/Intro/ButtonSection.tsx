import classes from "./index.module.css";
import Button from "monday-ui-react-core/dist/Button";
import Loader from "monday-ui-react-core/dist/Loader";
import { useAsync, useAsyncFn } from "react-use";
import { createBoard } from "../../services/createBoard";
import { useEffect } from "react";
import MoveArrowRight from "monday-ui-react-core/dist/icons/MoveArrowRight";

export const ButtonSection = ({ severity }) => {
  const [{ value, loading, error }, createNewBoard] = useAsyncFn(
    async () => await createBoard("Poker Planning Board")
  );
  // console.log(value, window);
  return (
    <div className={classes.buttons}>
      {severity === "success" ? (
        <Button size="large">Start!</Button>
      ) : (
        <>
          <Button
            loading={loading}
            onClick={() => {
              if (loading) {
                return;
              }
              createNewBoard();
            }}
          >
            Create a New Board{" "}
            <MoveArrowRight className={classes.buttonRightIcon} />
          </Button>
          <Button kind="tertiary" size="small" disabled>
            Use Current Board <i>&nbsp;(soon)</i>
          </Button>
        </>
      )}
    </div>
  );
};
