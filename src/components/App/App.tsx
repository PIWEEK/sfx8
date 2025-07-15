import styles from "./App.module.css";
import { SfxProvider } from "../../context/SfxProvider";
import { useKeyPress } from "../../hooks/useKeyPress";

import SfxControls from "../SfxControls";
import NoteEditor from "../NoteEditor";
import { Pacman } from "iconoir-react";

function App() {
  const handleSpacebarPress = () => {
    console.log("Spacebar pressed!");
    // Add your spacebar callback logic here
  };

  useKeyPress({
    key: "Space",
    callback: handleSpacebarPress,
    preventDefault: true,
  });

  return (
    <SfxProvider>
      <h1 className={styles.title}>
        <Pacman width={24} /> SFX-8
      </h1>
      <main className={styles.container}>
        <SfxControls />
        <header className={styles.toolbar}>
          <p>
            Speed <input type="number" min={0} max={255} defaultValue={0} />
          </p>
        </header>
        <NoteEditor />
      </main>
    </SfxProvider>
  );
}

export default App;
