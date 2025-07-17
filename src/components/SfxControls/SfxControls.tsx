import { useContext, useState } from "react";
import { PlaySolid, PauseSolid, Download } from "iconoir-react";

import { useKeyPress } from "../../hooks/useKeyPress";
import SfxPlayer from "../SfxPlayer";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";

import styles from "./SfxControls.module.css";
import { SynthProvider } from "../../context/SynthProvider";
import SynthContext from "../../context/synth-context";

function PlayButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { synth, init: initSynth } = useContext(SynthContext);

  const togglePlayback = async () => {
    const nextIsPlaying = !isPlaying;

    if (nextIsPlaying && !synth) {
      await initSynth();
    }

    setIsPlaying(nextIsPlaying);
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
    <SynthProvider>
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
    </SynthProvider>
  );
}
