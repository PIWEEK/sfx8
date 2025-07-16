import { useEffect, useContext } from "react";
import SfxContext from "../../context/sfx-context";
import SynthContext from "../../context/synth-context";

export default function SfxPlayer({ isPlaying }: { isPlaying: boolean }) {
  const { notes, speed } = useContext(SfxContext);
  const { synth } = useContext(SynthContext);

  useEffect(() => {
    if (synth === null) return;

    if (isPlaying) {
      synth.play(notes, speed);
    } else {
      synth.stop();
    }
  }, [isPlaying, notes, speed, synth]);

  return <></>;
}
