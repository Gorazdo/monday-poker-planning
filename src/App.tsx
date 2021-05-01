import { Intro } from "./components/Intro";
import { AppProvider } from "./contexts/AppContext";
import { ThemeProvider } from "./contexts/Theme";

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Intro />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
