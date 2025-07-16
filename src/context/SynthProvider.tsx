import * as Tone from "tone";
import { useState, type ReactNode } from "react";
import SynthContext, { Synth } from "./synth-context";

interface SynthProviderProps {
  children: ReactNode;
}

export const SynthProvider = ({ children }: SynthProviderProps) => {
  const [synth, setSynth] = useState<Synth | null>(null);

  const init = async () => {
    await Tone.start();
    setSynth(new Synth());
  };

  return <SynthContext value={{ synth, init }}>{children}</SynthContext>;
};
