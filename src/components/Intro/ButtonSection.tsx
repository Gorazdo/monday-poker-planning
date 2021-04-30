import classes from "./index.module.css";
import Button from "monday-ui-react-core/dist/Button";
import { useAsyncFn } from "react-use";
import { createBoard } from "../../services/createBoard";
import MoveArrowRight from "monday-ui-react-core/dist/icons/MoveArrowRight";
import { getRandomEmojie } from "../../utils/getRandomEmojie";
import { makeBoardUrl } from "../../utils/makeBoardUrl";

const generateBoardName = () => {
  return getRandomEmojie() + " Poker Planning Board";
};

export const ButtonSection = ({ severity }) => {
  const [{ value, loading }, createNewBoard] = useAsyncFn(
    async () => await createBoard(generateBoardName())
  );

  console.log(value);

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
              if (!value) {
                createNewBoard();
              }
              if (value) {
                const boardUrl = makeBoardUrl(value);
                window.open(boardUrl, "tab");
              }
            }}
          >
            {value ? "Go to The Board" : "Create a New Board"}
            {value && <MoveArrowRight className={classes.buttonRightIcon} />}
          </Button>
          <Button kind="tertiary" size="small" disabled>
            Use Current Board <i>&nbsp;(soon)</i>
          </Button>
        </>
      )}
    </div>
  );
};
