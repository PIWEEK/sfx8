// Get the note name out of the given index, by incrementing one semitone per step
// The value range is 0 for C1 to 63 for D#6 (included)
// The return value is a string like "C1", "C#1", "D1", etc.
export function noteName(pitchIndex: number) {
  const note = pitchIndex % 12;
  const octave = Math.floor(pitchIndex / 12) + 1;
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

export interface Note {
  pitch: number;
  startIndex: number;
  duration: number;
}

export function mergeNotes(raw_notes: (number | undefined)[]): Note[] {
  const mergedNotes: Note[] = [];

  if (raw_notes.length === 0) {
    return mergedNotes;
  }

  let currentPitch = raw_notes[0];
  let currentStartIndex = 0;
  let currentDuration = 1; // 1 beat per note

  for (let i = 1; i < raw_notes.length; i++) {
    if (raw_notes[i] === currentPitch && currentPitch !== undefined) {
      // Same note, extend duration
      currentDuration++;
    } else {
      // Different note or undefined, save the previous merged note
      if (currentPitch !== undefined) {
        mergedNotes.push({
          pitch: currentPitch,
          startIndex: currentStartIndex,
          duration: currentDuration,
        });
      }
      // Start new note
      currentPitch = raw_notes[i];
      currentStartIndex = i;
      currentDuration = 1;
    }
  }

  // Don't forget the last note
  if (currentPitch !== undefined) {
    mergedNotes.push({
      pitch: currentPitch,
      startIndex: currentStartIndex,
      duration: currentDuration,
    });
  }

  return mergedNotes;
}
