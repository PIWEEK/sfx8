import { createContext } from "react";

export const NOTE_COUNT = 32;
export const PITCH_COUNT = 64;

const SfxContext = createContext<{
  notes: (number | undefined)[];
  speed: number;
  setSpeed: (value: number) => void;
  setNotes: (value: (number | undefined)[]) => void;
  reset: () => void;
  serialize: () => string;
}>({
  notes: new Array(NOTE_COUNT).fill(undefined),
  speed: 128,
  setSpeed: () => {},
  setNotes: () => {},
  reset: () => {},
  serialize: () => "",
});

export default SfxContext;
