import styles from "./App.module.css";
import { Pacman } from "iconoir-react";

function App() {
  return (
    <>
      <h1 className={styles.title}>
        <Pacman width={24} /> SFX-8
      </h1>
      <main className={styles.container}></main>
    </>
  );
}

export default App;
