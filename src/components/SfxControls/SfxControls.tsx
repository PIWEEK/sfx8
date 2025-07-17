import { useCallback, useContext, useState, useRef, useEffect } from "react";
import { PlaySolid, PauseSolid, Download, XmarkCircle } from "iconoir-react";

import { useKeyPress } from "../../hooks/useKeyPress";
import SfxPlayer from "../SfxPlayer";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";

import styles from "./SfxControls.module.css";
import SynthContext from "../../context/synth-context";
import SfxContext from "../../context/sfx-context";
import { mergeNotes } from "../../utils/notes";

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
  const { reset, notes, speed } = useContext(SfxContext);
  const { exportToWav } = useContext(SynthContext);
  const [isExporting, setIsExporting] = useState(false);

  const handleResetClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      reset();
    },
    [reset]
  );

  const handleDownloadClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (isExporting) return;

      setIsExporting(true);

      try {
        const mergedNotes = mergeNotes(notes);
        const blob = await exportToWav(mergedNotes, speed);

        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sfx8-export-${new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/:/g, "-")}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Export failed:", error);
        alert("Failed to export audio. Please try again.");
      } finally {
        setIsExporting(false);
      }
    },
    [exportToWav, notes, speed, isExporting]
  );

  return (
    <header className={styles.container}>
      <section className={styles.container}>
        <section className={styles.playbackControls}>
          <PlayButton />
        </section>
        <section className={styles.fileControls}>
          <Button icon={XmarkCircle} onClick={handleResetClick}>
            Reset
          </Button>
          <Button
            icon={Download}
            onClick={handleDownloadClick}
            disabled={isExporting}
          >
            {isExporting ? "Exporting..." : "Download"}
          </Button>
        </section>
      </section>
    </header>
  );
}
