import { createContext } from "react";
import { PolySynth, getContext, Synth, Recorder } from "tone";

import { noteName, type Note } from "../utils/notes";

export class SfxSynth {
  #synth: PolySynth;
  #onComplete: (() => void) | null = null;

  constructor() {
    this.#synth = buildSynth().toDestination();
  }

  // Shared helper method for preparing playback data
  #preparePlayback(notes: Note[], speed: number) {
    // Convert speed to tempo (0-255 range to 60-1080 BPM range)
    const tempo = 60 + speed * 6;

    // Filter out undefined notes
    const validNotes = notes.filter((note) => !!note);

    // Calculate time per beat based on tempo
    const secondsPerBeat = 60 / tempo;

    // Use transport-relative timing instead of absolute audio context time
    const startTime = 0.1; // Add 100ms silence before sequence starts

    // Calculate when the sequence will finish
    const latestEndTime = Math.max(
      ...validNotes.map(
        (note) => (note.startIndex + note.duration) * secondsPerBeat
      )
    );
    const totalDuration = latestEndTime + 0.1; // Add buffer for the initial delay

    return { validNotes, secondsPerBeat, startTime, totalDuration };
  }

  async play(notes: Note[], speed: number, onComplete?: () => void) {
    // Store the completion callback
    this.#onComplete = onComplete || null;

    const { validNotes, secondsPerBeat, startTime, totalDuration } =
      this.#preparePlayback(notes, speed);

    if (validNotes.length === 0) {
      if (this.#onComplete) {
        this.#onComplete();
      }
      return;
    }

    const context = getContext();

    // Stop any existing sequence before starting a new one
    context.transport.stop();
    context.transport.cancel();
    // Reset transport time to 0 to ensure consistent timing
    context.transport.position = 0;

    // Schedule each merged note using transport.schedule
    validNotes.forEach(({ pitch, startIndex, duration }) => {
      const timeInSeconds = startTime + startIndex * secondsPerBeat;
      const note = noteName(pitch);

      // Schedule the note using transport instead of direct triggerAttackRelease
      context.transport.schedule((time) => {
        this.#synth.triggerAttackRelease(note, duration * secondsPerBeat, time);
      }, timeInSeconds);
    });

    // Schedule the completion callback using the recommended Tone.js API
    context.transport.schedule(() => {
      if (this.#onComplete) {
        this.#onComplete!();
      }
    }, startTime + totalDuration);

    if (context.transport.state !== "started") {
      context.transport.start();
    }
  }

  async exportToWav(notes: Note[], speed: number): Promise<Blob> {
    const { validNotes, secondsPerBeat, startTime, totalDuration } =
      this.#preparePlayback(notes, speed);

    if (validNotes.length === 0) {
      throw new Error("No notes to export");
    }

    // Create a fresh synth and recorder
    const recordingSynth = buildSynth();
    const recorder = new Recorder();

    // Connect synth to recorder
    recordingSynth.connect(recorder);

    // Start recording
    recorder.start();

    // Play the notes
    validNotes.forEach(({ pitch, startIndex, duration }) => {
      const timeInSeconds = startTime + startIndex * secondsPerBeat;
      const note = noteName(pitch);

      setTimeout(() => {
        recordingSynth.triggerAttackRelease(note, duration * secondsPerBeat);
      }, timeInSeconds * 1000);
    });

    // Wait for recording to complete
    const recordingDuration = (startTime + totalDuration) * 1000;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        recorder
          .stop()
          .then((blob: Blob) => {
            recordingSynth.dispose();
            resolve(blob);
          })
          .catch((error: Error) => {
            console.error("Export: Recording failed:", error);
            recordingSynth.dispose();
            reject(error);
          });
      }, recordingDuration + 1000); // Add 1 second buffer
    });
  }

  stop() {
    const context = getContext();

    // Stop the transport using the recommended API
    context.transport.stop();
    context.transport.cancel();

    // Stop all notes and dispose the synth
    this.#synth.dispose();

    // Clear the callback
    this.#onComplete = null;

    // Create a fresh synth for the next sequence
    this.#synth = buildSynth().toDestination();
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
  });

  return synth;
}

const SynthContext = createContext<{
  synth: SfxSynth | null;
  init: () => Promise<SfxSynth>;
  exportToWav: (notes: Note[], speed: number) => Promise<Blob>;
}>({
  synth: null,
  init: async () => {
    throw new Error("Context not initialized");
  },
  exportToWav: async () => {
    throw new Error("Context not initialized");
  },
});

export default SynthContext;
