import { createContext } from "react";
import { PulseOscillator, Frequency, getContext } from "tone";

import { noteName } from "../utils/notes";

export class Synth {
  #pulse: PulseOscillator;

  constructor() {
    this.#pulse = buildOscillator();
  }

  async play(notes: (number | undefined)[], speed: number) {
    // Stop any existing sequence
    this.stop();

    // Convert speed to tempo (0-255 range to 60-1080 BPM range)
    const tempo = 60 + speed * 6;

    // Filter out undefined notes
    const validNotes = notes.filter((note) => !!note);

    if (validNotes.length === 0) {
      return;
    }

    const context = getContext();
    const startTime = context.currentTime;

    // Calculate time per beat based on tempo
    const secondsPerBeat = 60 / tempo;

    // Start the oscillator early to avoid glitches
    this.#pulse.start(startTime);

    // Schedule each note using musical time notation
    notes.forEach((pitch, index) => {
      if (pitch !== undefined) {
        // Each step is one beat (quarter note)
        const beatsFromStart = index * 1;
        const timeInSeconds = startTime + beatsFromStart * secondsPerBeat;

        const note = noteName(pitch);
        const frequency = Frequency(note).toFrequency();

        this.#pulse.frequency.setValueAtTime(frequency, timeInSeconds);

        // Use volume control instead of start/stop for smoother transitions
        // and avoid a crackling sound when the note is played
        this.#pulse.volume.setValueAtTime(-20, timeInSeconds);
        this.#pulse.volume.setValueAtTime(
          -Infinity,
          timeInSeconds + 1 * secondsPerBeat
        );
      }
    });

    // Stop the oscillator after the last note
    const totalDuration = validNotes.length * secondsPerBeat;
    this.#pulse.stop(startTime + totalDuration + 0.1);
  }

  stop() {
    // Dispose the oscillator to clear ALL scheduled events
    // This is necessary because Web Audio API scheduled events persist even after stop()
    this.#pulse.dispose();

    // Create a fresh oscillator for the next sequence
    this.#pulse = buildOscillator();
  }
}

function buildOscillator(): PulseOscillator {
  const oscillator = new PulseOscillator().toDestination();
  oscillator.volume.value = -20;
  oscillator.width.value = 0.5;
  oscillator.frequency.value = 440;
  return oscillator;
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
