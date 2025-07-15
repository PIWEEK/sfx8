import { useState } from "react";
import { PlaySolid, PauseSolid, Download } from "iconoir-react";

import { useKeyPress } from "../../hooks/useKeyPress";
import SfxPlayer from "../SfxPlayer";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";

import styles from "./SfxControls.module.css";

function PlayButton() {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  useKeyPress({
    key: "Space",
    callback: togglePlayback,
    preventDefault: true,
  });

  return (
    <>
      <IconButton
        icon={isPlaying ? PauseSolid : PlaySolid}
        onClick={togglePlayback}
      />
      <SfxPlayer isPlaying={isPlaying} />
    </>
  );
}

export default function SfxControls() {
  return (
    <header className={styles.container}>
      <section className={styles.container}>
        <section className={styles.playbackControls}>
          <PlayButton />
        </section>
        <section className={styles.fileControls}>
          <Button icon={Download}>Download</Button>
        </section>
      </section>
    </header>
  );
}
