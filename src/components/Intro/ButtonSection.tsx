import classes from "./index.module.css";
import Button from "monday-ui-react-core/dist/Button";
import { useAsyncFn } from "react-use";
import {
  createBoard,
  addReadmeInfo,
  prepareDefaultTemplateBoard,
} from "../../services/createBoard";
import MoveArrowRight from "monday-ui-react-core/dist/icons/MoveArrowRight";
import { getRandomEmojie } from "../../utils/getRandomEmojie";
import { makeBoardUrl } from "../../utils/makeBoardUrl";
import { PP_BOARD_NAME } from "../../constants/boards";
import { useSelector } from "react-redux";
import { selectBoardId } from "../../state/contextSlice";

const generateBoardName = () => {
  return getRandomEmojie() + " " + PP_BOARD_NAME;
};

export const StartFromDefaultBoardButton = () => {
  const boardId = useSelector(selectBoardId);
  const [{ value, loading }, prepareCurrentBoard] = useAsyncFn(async () => {
    await prepareDefaultTemplateBoard(boardId);
    return;
  }, [boardId]);

  return (
    <Button
      loading={loading}
      size="large"
      onClick={() => {
        if (loading) {
          return;
        }
        prepareCurrentBoard();
      }}
    >
      Start!
    </Button>
  );
};

export const CreateNewBoardButton = () => {
  const [{ loading, value }, createNewBoard] = useAsyncFn(async () => {
    const board = await createBoard(generateBoardName());
    await addReadmeInfo(board.id);
    return board;
  });
  return (
    <Button
      loading={loading}
      size="large"
      onClick={() => {
        if (loading) {
          return;
        }
        if (value) {
          const boardUrl = makeBoardUrl(value);
          window.open(boardUrl, "tab");
        } else {
          createNewBoard();
        }
      }}
    >
      {value ? "Go to The Board" : "Create a New Board"}
      {value && <MoveArrowRight className={classes.buttonRightIcon} />}
    </Button>
  );
};
