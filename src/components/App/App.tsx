import styles from "./App.module.css";
import { SfxProvider } from "../../context/SfxProvider";

import NoteEditor from "../NoteEditor";
import { Pacman } from "iconoir-react";

function App() {
  return (
    <SfxProvider>
      <h1 className={styles.title}>
        <Pacman width={24} /> SFX-8
      </h1>
      <main className={styles.container}>
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
