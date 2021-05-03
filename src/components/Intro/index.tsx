import AttentionBox from "monday-ui-react-core/dist/AttentionBox";
import Loader from "monday-ui-react-core/dist/Loader";
import { useAsync } from "react-use";
import classes from "./index.module.css";
import { PopupContent } from "../../library/PopupContent";
import { Typography } from "../../library/Typography";
import { InlineTooltip } from "../../library/InlineTooltip";
import { CreateNewBoardButton } from "./ButtonSection";
import { fetchBoardSummary } from "../../services/fetchBoardSummary";
import { useBoardId } from "../../contexts/AppContext";
import { detectBoardType } from "../../utils/detectBoardType";
import { Grid } from "../../library/Grid";
import { PlayingBoard } from "../PlayingBoard";
import { FullScreenLoader } from "../../library/FullScreenLoader";

export const Intro = () => {
  const boardId = useBoardId();
  const { value, loading, error } = useAsync(async () => {
    return await fetchBoardSummary(boardId);
  }, [boardId]);

  if (loading && !value) {
    return <FullScreenLoader label="Distributing the cards..." percent={100} />;
  }
  if (value) {
    const boardType = detectBoardType(value);
    return <StrategySwitcher boardSummaryData={value} boardType={boardType} />;
  }
  return (
    <AttentionBox
      title={error?.name ?? "Unknown Error"}
      text={error?.message ?? "Please, refresh a page"}
      type="danger"
    />
  );
};

const StrategySwitcher = ({ boardSummaryData, boardType }) => {
  const { name } = boardSummaryData;
  if (boardType === "readme" || boardType === "planning_poker") {
    // User has run app after reading Readme group
    // We need to clean up readme stuff and populate board
    // and show real application
    return <PlayingBoard boardType={boardType} />;
  }
  // if (boardType === "danger") {
  return (
    <div className={classes.popupWrapper}>
      <PopupContent>
        <img src="/assets/upset.svg" className={classes.illustration} />
        <Typography variant="h1" gutterBottom className={classes.title}>
          This <Board name={name} /> seems <br /> to&nbsp;be in&nbsp;use
        </Typography>
        <Typography variant="h3">How to use our app safely?</Typography>
        <ol>
          <li>Create a New Board (or click below)</li>
          <li>Add our app on the New Board</li>
          <li>Have fun!</li>
        </ol>
        <Grid variant="center">
          <CreateNewBoardButton />
        </Grid>
      </PopupContent>
    </div>
  );
  // }
  // if (boardType === "default_template") {
  //   return (
  //     <div className={classes.popupWrapper}>
  //       <PopupContent>
  //         <Typography variant="h1" gutterBottom>
  //           This <Board name={name} /> looks like created from scratch!
  //         </Typography>
  //         <AttentionBox
  //           title={"All data will be cleared"}
  //           text={`
  //           Our plugin uses the whole board to keep data. All existing data (
  //             ${plural("items", boardSummaryData.items)}, ${plural(
  //             "groups",
  //             boardSummaryData.groups
  //           )} created by
  //             ${plural("creators", boardSummaryData.authors)}
  //           ) will be cleared and overritten by Planning Poker App
  //         `}
  //         />
  //         <Grid variant="center">
  //           <StartFromDefaultBoardButton />
  //         </Grid>
  //       </PopupContent>
  //     </div>
  //   );
  // }
  // return (
  //   <div className={classes.popupWrapper}>
  //     <PopupContent>
  //       <Typography variant="h1" gutterBottom>
  //         Board type is {boardType}
  //       </Typography>
  //       <AttentionBox
  //         title="Ooops! Something is wrong"
  //         text="Please, create a new Default Board, and then add the application to it again!"
  //         type="danger"
  //       />
  //     </PopupContent>
  //   </div>
  // );
};

const Board = ({ name }) => (
  <InlineTooltip content={`“${name}”`}>board</InlineTooltip>
);
