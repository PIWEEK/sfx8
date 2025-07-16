import { createContext } from "react";
import { PulseOscillator, Frequency, getContext } from "tone";

import { noteName } from "../utils/notes";

export class Synth {
  #pulse: PulseOscillator;

  constructor() {
    this.#pulse = new PulseOscillator().toDestination();
    this.#pulse.volume.value = -10;
  }

  async play(notes: (number | undefined)[], speed: number) {
    // Stop any existing sequence
    this.stop();

    // Convert speed to tempo (0-255 range to reasonable BPM range)
    const tempo = 60 + speed * 0.75; // 60-250 BPM range

    // Filter out undefined notes
    const validNotes = notes.filter((note) => !!note);

    if (validNotes.length === 0) {
      return;
    }

    const context = getContext();
    const startTime = context.currentTime;

    // Calculate time per beat based on tempo
    const secondsPerBeat = 60 / tempo;

    // Schedule each note using musical time notation
    notes.forEach((pitch, index) => {
      if (pitch !== undefined) {
        // Each step is one beat (quarter note)
        const beatsFromStart = index * 1;
        const timeInSeconds = startTime + beatsFromStart * secondsPerBeat;

        const note = noteName(pitch);
        const frequency = Frequency(note).toFrequency();

        // Each note lasts 1 beat (quarter note)
        this.#pulse.frequency.setValueAtTime(frequency, timeInSeconds);
        this.#pulse.start(timeInSeconds);
        this.#pulse.stop(timeInSeconds + 1 * secondsPerBeat);
      }
    });
  }

  stop() {
    // Stop the oscillator
    this.#pulse.stop();
  }
}

const SynthContext = createContext<{
  synth: Synth | null;
  init: () => Promise<void>;
}>({
  synth: null,
  init: async () => {
    throw new Error("Context not initialized");
  },
});

export default SynthContext;
