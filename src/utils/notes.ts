// Get the note name out of the given index, by incrementing one semitone per step
// The value range is 0 for C0 to 63 for D#5 (included)
// The return value is a string like "C0", "C#0", "D0", etc.
export function noteName(index: number) {
  const note = index % 12;
  const octave = Math.floor(index / 12) + 1;
  const noteName = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ][note];
  return `${noteName}${octave}`;
}
