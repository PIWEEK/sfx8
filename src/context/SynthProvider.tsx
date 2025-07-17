import * as Tone from "tone";
import { useState, type ReactNode } from "react";
import SynthContext, { SfxSynth } from "./synth-context";

interface SynthProviderProps {
  children: ReactNode;
}

export const SynthProvider = ({ children }: SynthProviderProps) => {
  const [synth, setSynth] = useState<SfxSynth | null>(null);

  const init = async () => {
    await Tone.start();
    setSynth(new SfxSynth());
  };

  return <SynthContext value={{ synth, init }}>{children}</SynthContext>;
};
