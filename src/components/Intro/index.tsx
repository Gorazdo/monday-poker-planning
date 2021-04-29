import AttentionBox from "monday-ui-react-core/dist/AttentionBox";
import { useBoardSummary } from "../../hooks/useBoard";
import { Typography } from "../Typography";

export const Intro = () => {
  const { value, loading, error } = useBoardSummary();
  return (
    <section>
      <AttentionBox
        title={loading ? "We gather information..." : "Important"}
        text="Test"
        type="primary"
      />
      {value && <BoardSummary {...value} />}
      <Typography variant="h1">Hi!</Typography>
      <Typography variant="p" gutterBottom>
        Let's prepare your board first
      </Typography>
      <Typography variant="p" gutterBottom>
        We will modify your board
      </Typography>
    </section>
  );
};

const BoardSummary = ({ name, items, groups }) => {
  console.log(items, groups);
  const uniqueCreators = Array.from(
    new Set(
      items.filter((item) => item.creator).map((item) => item.creator.name)
    )
  );
  if (uniqueCreators.length === 1) {
    if (
      (items.length === 5 && groups.length === 2) ||
      (items.length === 0 && groups.length === 0)
    ) {
      return (
        <>
          <Typography variant="h1">{name}</Typography>
          <Typography variant="h2">
            We found {items.length} items in {groups.length} groups
          </Typography>
          <Typography variant="h3">Looks like it's an empty board</Typography>
        </>
      );
    }
    return (
      <>
        <Typography variant="h1">{name}</Typography>
        <Typography variant="h2">
          We found {items.length} items in {groups.length} groups
        </Typography>
        <Typography variant="h3">
          All of these items were created by {uniqueCreators[0]}
        </Typography>
      </>
    );
  }
  return (
    <>
      <Typography variant="h1">{name}</Typography>
      <Typography variant="h2">
        We found {items.length} items in {groups.length} groups
      </Typography>
      <Typography variant="h3">
        Items are created by {uniqueCreators.length} persons:{" "}
        {uniqueCreators.join(", ")}
      </Typography>
      <Typography variant="h3">
        Looks like it's better to create a new board, otherwise you will loose
        all your data
      </Typography>
    </>
  );
};
