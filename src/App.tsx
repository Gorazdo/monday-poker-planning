import Button from "monday-ui-react-core/dist/Button";
import EditableInput from "monday-ui-react-core/dist/EditableInput";
import EditableHeading from "monday-ui-react-core/dist/EditableHeading";
import { Avatar } from "./components/Avatar";
import { Grid } from "./components/Grid";
import { useBoardUsers } from "./hooks/useBoardUsers";
import { PlayingCard } from "./components/PlayingCard";
function App() {
  const { value: users } = useBoardUsers();
  console.log({ EditableInput, EditableHeading });
  return (
    <div className="App">
      <EditableInput value="Edit H2 tooltip" tooltip="Click to edit" />
      <code>{JSON.stringify(users)}</code>
      <Button>Start planning</Button>
      <Grid variant="row">
        <PlayingCard value={3} label="3" variant="face" />
        <PlayingCard value={3} label="3" variant="back" />
        <PlayingCard value={3} label="3" variant="back" />
        <PlayingCard value={100} label="100" variant="face" />
        <PlayingCard value={1 / 2} label="1/2" variant="face" />
      </Grid>
      <Grid variant="row">
        {users?.map((user) => (
          <Avatar key={user.id} url={user.photo_thumb} name={user.name} />
        ))}
      </Grid>
    </div>
  );
}

export default App;
