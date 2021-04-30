import classes from "./index.module.css";
import AttentionBox from "monday-ui-react-core/dist/AttentionBox";
import { PopupContent } from "../PopupContent";
import { Typography } from "../Typography";
import { InlineTooltip } from "../InlineTooltip";
import { plural } from "../../hooks/usePlural";
import { useUniqueAuthors } from "./useUniqueAuthors";
import { useSeverity } from "./useSeverity";
import { ButtonSection } from "./ButtonSection";
import { useAsync } from "react-use";
import { fetchBoardSummary } from "../../services/fetchBoardSummary";
import { useBoardId } from "../../contexts/AppContext";

export const Intro = () => {
  const boardId = useBoardId();
  const { value, loading, error } = useAsync(async () => {
    return await fetchBoardSummary(boardId);
  }, [boardId]);
  return (
    <section>
      {value && (
        <div className={classes.popupWrapper}>
          <BoardSummary {...value} />
        </div>
      )}
    </section>
  );
};

const BoardSummary = ({ name, items, groups }) => {
  const authors = useUniqueAuthors(items);
  const severity = useSeverity({ items, groups, authors });

  return (
    <PopupContent>
      <Typography variant="h1" gutterBottom>
        {severity === "success" ? (
          <>
            This <Board name={name} /> is ready!
          </>
        ) : (
          <>
            This <Board name={name} /> seems&nbsp;to&nbsp;be in&nbsp;use
          </>
        )}
      </Typography>
      <Typography variant="h3">How to use our app safely?</Typography>
      <ol>
        <li>Create a New Board</li>
        <li>Add our app on the New Board</li>
        <li>Have fun!</li>
      </ol>
      <AttentionBox
        title={
          severity === "success"
            ? "The app will store data in this board"
            : "All data will be cleared"
        }
        text={`
            Our plugin uses the whole board to keep data. All existing data (
              ${plural("items", items)}, ${plural("groups", groups)} created by 
              ${plural("creators", authors)}
            ) will be cleared and overritten by Planning Poker App
          `}
        type={severity}
      />
      <ButtonSection severity={severity} />
    </PopupContent>
  );
};

const Board = ({ name }) => (
  <InlineTooltip content={`“${name}”`}>board</InlineTooltip>
);
