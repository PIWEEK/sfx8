import * as Tone from "tone";
import { useState, type ReactNode } from "react";
import SynthContext, { SfxSynth } from "./synth-context";
import { type Note } from "../utils/notes";

interface SynthProviderProps {
  children: ReactNode;
}

export const SynthProvider = ({ children }: SynthProviderProps) => {
  const [synth, setSynth] = useState<SfxSynth | null>(null);

  // Modified init to return the SfxSynth instance
  const init = async (): Promise<SfxSynth> => {
    await Tone.start();
    const newSynth = new SfxSynth();
    setSynth(newSynth);
    return newSynth;
  };

  const exportToWav = async (notes: Note[], speed: number): Promise<Blob> => {
    let synthInstance = synth;
    if (!synthInstance) {
      synthInstance = await init();
    }
    return synthInstance.exportToWav(notes, speed);
  };

  return (
    <SynthContext value={{ synth, init, exportToWav }}>{children}</SynthContext>
  );
};
