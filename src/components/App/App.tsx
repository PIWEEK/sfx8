import styles from "./App.module.css";
import { SfxProvider } from "../../context/SfxProvider";
import { useContext } from "react";
import SfxContext from "../../context/sfx-context";

import SfxControls from "../SfxControls";
import NoteEditor from "../NoteEditor";
import { Pacman } from "iconoir-react";

function SpeedControl() {
  const { speed, setSpeed } = useContext(SfxContext);

  return (
    <p>
      Speed{" "}
      <input
        type="number"
        min={0}
        max={255}
        value={speed}
        onChange={(e) => setSpeed(Number(e.target.value))}
      />
    </p>
  );
}

function App() {
  return (
    <SfxProvider>
      <h1 className={styles.title}>
        <Pacman width={24} /> SFX-8
      </h1>
      <main className={styles.container}>
        <SfxControls />
        <header className={styles.toolbar}>
          <SpeedControl />
        </header>
        <NoteEditor />
      </main>
    </SfxProvider>
  );
}

export default App;
