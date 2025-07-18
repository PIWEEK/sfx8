import styles from "./App.module.css";
import { SfxProvider } from "../../context/SfxProvider";
import { SynthProvider } from "../../context/SynthProvider";

import SfxControls from "../SfxControls";
import NoteEditor from "../NoteEditor";
import { Pacman } from "iconoir-react";
import FileControls from "../FileControls";

function App() {
  return (
    <SynthProvider>
      <SfxProvider>
        <h1 className={styles.title}>
          <Pacman width={24} /> SFX-8
        </h1>
        <main className={styles.container}>
          <SfxControls />
          <NoteEditor />
          <footer>
            <FileControls />
          </footer>
        </main>
      </SfxProvider>
    </SynthProvider>
  );
}

export default App;
