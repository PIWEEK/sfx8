import { createContext } from "react";
import { PolySynth, getContext, Synth } from "tone";

import { noteName, type Note } from "../utils/notes";

export class SfxSynth {
  #synth: PolySynth;

  constructor() {
    this.#synth = buildSynth();
  }

  async play(notes: Note[], speed: number) {
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
    const startTime = context.currentTime + 0.1; // Add 100ms silence before sequence starts

    // Calculate time per beat based on tempo
    const secondsPerBeat = 60 / tempo;

    // Schedule each merged note using PolySynth
    notes.forEach(({ pitch, startIndex, duration }) => {
      const timeInSeconds = startTime + startIndex * secondsPerBeat;
      const note = noteName(pitch);

      // Use PolySynth to trigger the note with proper duration
      this.#synth.triggerAttackRelease(
        note,
        duration * secondsPerBeat,
        timeInSeconds
      );
    });
  }

  stop() {
    // Stop all notes and dispose the synth
    this.#synth.dispose();

    // Create a fresh synth for the next sequence
    this.#synth = buildSynth();
  }
}

function buildSynth(): PolySynth {
  const synth = new PolySynth(Synth, {
    oscillator: {
      type: "pulse",
      width: 0.5,
      volume: -20,
    },
    envelope: {
      attack: 0.01, // Quick attack
      decay: 0, // No decay
      sustain: 1, // Sustain at full volume
      release: 0.1, // Quick release
    },
  }).toDestination();

  return synth;
}

const SynthContext = createContext<{
  synth: SfxSynth | null;
  init: () => Promise<void>;
}>({
  synth: null,
  init: async () => {
    throw new Error("Context not initialized");
  },
});

export default SynthContext;
