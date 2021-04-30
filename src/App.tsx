import { Grid } from "./components/Grid";
import { PlayingCard } from "./components/PlayingCard";
import { Intro } from "./components/Intro";
import { AppProvider } from "./contexts/AppContext";

function App() {
  return (
    <AppProvider>
      <div className="App">
        <Intro />
        <Grid variant="row">
          <PlayingCard
            onChange={console.log}
            value={3}
            label="3"
            variant="face"
          />
          <PlayingCard
            onChange={console.log}
            value={3}
            label="3"
            variant="back"
          />
          <PlayingCard
            onChange={console.log}
            value={3}
            label="3"
            variant="back"
          />
          <PlayingCard
            onChange={console.log}
            value={100}
            label="100"
            variant="face"
          />
          <PlayingCard
            onChange={console.log}
            value={1 / 2}
            label="1/2"
            variant="face"
          />
        </Grid>
      </div>
    </AppProvider>
  );
}

export default App;
