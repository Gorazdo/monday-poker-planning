import Button from "monday-ui-react-core/dist/Button";
import { Avatar } from "./components/Avatar";
import { Grid } from "./components/Grid";
import { useBoardUsers } from "./hooks/useBoardUsers";
import { PlayingCard } from "./components/PlayingCard";
import { useEffect } from "react";
import { monday } from "./services/monday";
import { pickCard } from "./hooks/useStorage";
import { Intro } from "./components/Intro";

function App() {
  const { value: users } = useBoardUsers();
  useEffect(() => {
    monday.listen("events", (res) => {
      console.log("events", res);
    });
    monday.listen("itemIds", (res) => {
      console.log("itemIds", res);
    });
    monday.listen("context", (res) => {
      console.log("context", res);
    });
    monday.listen("settings", (res) => {
      console.log("settings", res);
    });
  }, []);

  const handleChange = (value, state) => {
    pickCard(1, 123, value).then(console.log).catch(console.warn);
    monday.execute("openItemCard", { itemId: 1 });
  };
  return (
    <div className="App">
      <Intro />
      <code>{JSON.stringify(users)}</code>
      <Button>Start planning</Button>
      <Grid variant="row">
        <PlayingCard
          onChange={handleChange}
          value={3}
          label="3"
          variant="face"
        />
        <PlayingCard
          onChange={handleChange}
          value={3}
          label="3"
          variant="back"
        />
        <PlayingCard
          onChange={handleChange}
          value={3}
          label="3"
          variant="back"
        />
        <PlayingCard
          onChange={handleChange}
          value={100}
          label="100"
          variant="face"
        />
        <PlayingCard
          onChange={handleChange}
          value={1 / 2}
          label="1/2"
          variant="face"
        />
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
