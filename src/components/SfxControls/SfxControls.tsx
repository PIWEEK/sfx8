import styles from "./SfxControls.module.css";
import { PlaySolid, PauseSolid, Download } from "iconoir-react";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";

export default function SfxControls() {
  return (
    <header className={styles.container}>
      <section className={styles.container}>
        <section className={styles.playbackControls}>
          <IconButton icon={PlaySolid} />
        </section>
        <section className={styles.fileControls}>
          <Button icon={Download}>Download</Button>
        </section>
      </section>
    </header>
  );
}
