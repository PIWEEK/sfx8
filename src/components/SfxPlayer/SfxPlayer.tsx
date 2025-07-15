import * as Tone from "tone";
import { useEffect, useContext, useRef } from "react";
import SfxContext from "../../context/sfx-context";

class Synth {
  #pulse: Tone.PulseOscillator;

  constructor() {
    this.#pulse = new Tone.PulseOscillator().toDestination();
    this.#pulse.volume.value = -20;
  }

  play(notes: (number | undefined)[], speed: number) {
    this.#pulse.frequency.value = 440;
    this.#pulse.start();
  }

  stop() {
    this.#pulse.stop();
  }
}

export default function SfxPlayer({ isPlaying }: { isPlaying: boolean }) {
  const synth = useRef<Synth>(new Synth());
  const { notes, speed } = useContext(SfxContext);

  useEffect(() => {
    if (isPlaying) {
      synth.current.play(notes, speed);
    } else {
      synth.current.stop();
    }
  }, [isPlaying, notes, speed]);

  return <></>;
}
