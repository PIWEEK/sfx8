import { createContext } from "react";
import { PolySynth, getContext, Synth } from "tone";

import { noteName, type Note } from "../utils/notes";

export class SfxSynth {
  #synth: PolySynth;
  #onComplete: (() => void) | null = null;

  constructor() {
    this.#synth = buildSynth();
  }

  async play(notes: Note[], speed: number, onComplete?: () => void) {
    // Stop any existing sequence
    this.stop();

    // Store the completion callback
    this.#onComplete = onComplete || null;

    // Convert speed to tempo (0-255 range to 60-1080 BPM range)
    const tempo = 60 + speed * 6;

    // Filter out undefined notes
    const validNotes = notes.filter((note) => !!note);

    if (validNotes.length === 0) {
      // If no notes, call completion immediately
      if (this.#onComplete) {
        this.#onComplete();
      }
      return;
    }

    const context = getContext();
    const startTime = context.currentTime + 0.1; // Add 100ms silence before sequence starts

    // Calculate time per beat based on tempo
    const secondsPerBeat = 60 / tempo;

    // Schedule each merged note using PolySynth
    validNotes.forEach(({ pitch, startIndex, duration }) => {
      const timeInSeconds = startTime + startIndex * secondsPerBeat;
      const note = noteName(pitch);

      // Use PolySynth to trigger the note with proper duration
      this.#synth.triggerAttackRelease(
        note,
        duration * secondsPerBeat,
        timeInSeconds
      );
    });

    // Calculate when the sequence will finish and schedule the completion callback
    const latestEndTime = Math.max(
      ...validNotes.map(
        (note) => (note.startIndex + note.duration) * secondsPerBeat
      )
    );
    const totalDuration = latestEndTime + 0.1; // Add buffer for the initial delay

    // Schedule the completion callback using the recommended Tone.js API
    context.transport.schedule(() => {
      if (this.#onComplete) {
        this.#onComplete();
      }
    }, startTime + totalDuration);
  }

  stop() {
    const context = getContext();

    // Stop the transport using the recommended API
    context.transport.stop();
    context.transport.cancel();

    // Stop all notes and dispose the synth
    this.#synth.dispose();

    // Create a fresh synth for the next sequence
    this.#synth = buildSynth();

    // Clear the callback
    this.#onComplete = null;
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
      attack: 0.05, // More pronounced attack for distinct note starts
      decay: 0.1, // Add some decay to create note separation
      sustain: 0.8, // Slightly lower sustain for more dynamic sound
      release: 0.15, // Slightly longer release for smoother note endings
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
