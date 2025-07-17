import { createContext } from "react";
import { PolySynth, getContext, Synth, Recorder } from "tone";

import { noteName, type Note } from "../utils/notes";

export class SfxSynth {
  #synth: PolySynth;
  #recorder: Recorder;
  #onComplete: (() => void) | null = null;

  constructor() {
    this.#synth = buildSynth().toDestination();
    this.#recorder = new Recorder();
  }

  async play(notes: Note[], speed: number, onComplete?: () => void) {
    // Store the completion callback
    this.#onComplete = onComplete || null;

    // Convert speed to tempo (0-255 range to 60-1080 BPM range)
    const tempo = 60 + speed * 6;

    // Filter out undefined notes
    const validNotes = notes.filter((note) => !!note);

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

    // Use transport-relative timing instead of absolute audio context time
    const startTime = 0.1; // Add 100ms silence before sequence starts

    // Calculate time per beat based on tempo
    const secondsPerBeat = 60 / tempo;

    // Schedule each merged note using transport.schedule
    validNotes.forEach(({ pitch, startIndex, duration }) => {
      const timeInSeconds = startTime + startIndex * secondsPerBeat;
      const note = noteName(pitch);

      // Schedule the note using transport instead of direct triggerAttackRelease
      context.transport.schedule((time) => {
        this.#synth.triggerAttackRelease(note, duration * secondsPerBeat, time);
      }, timeInSeconds);
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
        this.#onComplete!();
      }
    }, startTime + totalDuration);

    if (context.transport.state !== "started") {
      context.transport.start();
    }
  }

  async exportToWav(notes: Note[], speed: number): Promise<Blob> {
    const context = getContext();

    // Ensure the audio context is started
    if (context.state !== "running") {
      await context.resume();
    }

    // Convert speed to tempo (0-255 range to 60-1080 BPM range)
    const tempo = 60 + speed * 6;

    // Filter out undefined notes
    const validNotes = notes.filter((note) => !!note);

    if (validNotes.length === 0) {
      throw new Error("No notes to export");
    }

    // Calculate time per beat based on tempo
    const secondsPerBeat = 60 / tempo;

    // Calculate total duration
    const latestEndTime = Math.max(
      ...validNotes.map(
        (note) => (note.startIndex + note.duration) * secondsPerBeat
      )
    );
    const totalDuration = latestEndTime + 0.5; // Add more buffer for recording

    // Create a fresh synth for recording without connecting to destination
    const recordingSynth = buildSynth();

    // Connect the recording synth to the recorder
    recordingSynth.connect(this.#recorder);

    // Start recording
    this.#recorder.start();

    // Stop any existing sequence
    context.transport.stop();
    context.transport.cancel();
    context.transport.position = 0;

    const startTime = 0.1;

    // Schedule each note using the recording synth
    validNotes.forEach(({ pitch, startIndex, duration }) => {
      const timeInSeconds = startTime + startIndex * secondsPerBeat;
      const note = noteName(pitch);

      context.transport.schedule((time) => {
        recordingSynth.triggerAttackRelease(
          note,
          duration * secondsPerBeat,
          time
        );
      }, timeInSeconds);
    });

    // Start transport
    context.transport.start();

    // Wait for the recording to complete using a timeout based on actual duration
    return new Promise((resolve, reject) => {
      const recordingDuration = (startTime + totalDuration) * 1000; // Convert to milliseconds
      setTimeout(() => {
        context.transport.stop();
        context.transport.cancel();

        // Stop recording and get the blob
        this.#recorder
          .stop()
          .then((blob) => {
            console.log("Recording stopped, blob size:", blob.size);
            recordingSynth.dispose();
            resolve(blob);
          })
          .catch((error) => {
            console.error("Error stopping recording:", error);
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
