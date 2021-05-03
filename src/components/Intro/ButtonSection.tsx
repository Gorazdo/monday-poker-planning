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
import { useBoardId } from "../../contexts/AppContext";
import { PP_BOARD_NAME } from "../../constants/boards";

const generateBoardName = () => {
  return getRandomEmojie() + " " + PP_BOARD_NAME;
};

export const ButtonSection = ({ severity }) => {
  const currentBoardId = useBoardId();
  const [createdBoard, createNewBoard] = useAsyncFn(async () => {
    const board = await createBoard(generateBoardName());
    await addReadmeInfo(board.id);
    return board;
  });

  const [preparedBoard, prepareCurrentBoard] = useAsyncFn(async () => {
    await prepareDefaultTemplateBoard(currentBoardId);
    return;
  });

  // console.log(value, window);
  return (
    <div className={classes.buttons}>
      {severity === "success" ? (
        <Button
          loading={preparedBoard.loading}
          size="large"
          onClick={() => {
            if (preparedBoard.loading) {
              return;
            }
            prepareCurrentBoard();
          }}
        >
          Start!
        </Button>
      ) : (
        <>
          <Button
            loading={createdBoard.loading}
            onClick={() => {
              if (createdBoard.loading) {
                return;
              }
              if (createdBoard.value) {
                const boardUrl = makeBoardUrl(createdBoard.value);
                window.open(boardUrl, "tab");
              } else {
                createNewBoard();
              }
            }}
          >
            {createdBoard.value ? "Go to The Board" : "Create a New Board"}
            {createdBoard.value && (
              <MoveArrowRight className={classes.buttonRightIcon} />
            )}
          </Button>
          <Button kind="tertiary" size="small" disabled>
            Use Current Board <i>&nbsp;(soon)</i>
          </Button>
        </>
      )}
    </div>
  );
};

export const StartFromDefaultBoardButton = () => {
  const currentBoardId = useBoardId();
  const [{ value, loading }, prepareCurrentBoard] = useAsyncFn(async () => {
    await prepareDefaultTemplateBoard(currentBoardId);
    return;
  }, [currentBoardId]);

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
