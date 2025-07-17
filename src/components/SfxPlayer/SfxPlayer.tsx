import { useEffect, useContext, useMemo } from "react";
import SfxContext from "../../context/sfx-context";
import SynthContext from "../../context/synth-context";
import { mergeNotes } from "../../utils/notes";

export default function SfxPlayer({ isPlaying }: { isPlaying: boolean }) {
  const { notes, speed } = useContext(SfxContext);
  const { synth } = useContext(SynthContext);

  const mergedNotes = useMemo(() => mergeNotes(notes), [notes]);

  useEffect(() => {
    if (synth === null) return;

    if (isPlaying) {
      synth.play(mergedNotes, speed);
    } else {
      synth.stop();
    }
  }, [isPlaying, notes, speed, synth]);

  return <></>;
}
