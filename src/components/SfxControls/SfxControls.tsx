import { useCallback, useContext, useState, useRef, useEffect } from "react";
import { PlaySolid, PauseSolid, XmarkCircle } from "iconoir-react";

import { useKeyPress } from "../../hooks/useKeyPress";
import SfxPlayer from "../SfxPlayer";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";

import styles from "./SfxControls.module.css";
import SynthContext from "../../context/synth-context";
import SfxContext from "../../context/sfx-context";

function PlayButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { synth, init: initSynth } = useContext(SynthContext);
  const onCompleteRef = useRef<(() => void) | null>(null);

  const togglePlayback = async () => {
    const nextIsPlaying = !isPlaying;

    if (nextIsPlaying && !synth) {
      await initSynth();
    }

    setIsPlaying(nextIsPlaying);
  };

  const handlePlaybackComplete = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Keep the ref updated with the current callback
  useEffect(() => {
    onCompleteRef.current = handlePlaybackComplete;
  }, [handlePlaybackComplete]);

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
      <SfxPlayer
        isPlaying={isPlaying}
        onPlaybackComplete={onCompleteRef.current || handlePlaybackComplete}
      />
    </>
  );
}

export default function SfxControls() {
  const { reset } = useContext(SfxContext);

  const handleResetClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      reset();
    },
    [reset]
  );

  return (
    <header className={styles.container}>
      <PlayButton />
      <Button icon={XmarkCircle} onClick={handleResetClick}>
        Reset
      </Button>
    </header>
  );
}
