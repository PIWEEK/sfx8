// Each note uses 8 bits (1 byte):
// - 7 bits for pitch index (0-127, but we only use 0-63)
// - 1 bit to indicate if the slot has a note (0 = empty, 1 = has note)
const PITCH_BITS = 7;

const PITCH_MASK = (1 << PITCH_BITS) - 1;
const HAS_NOTE_MASK = 1 << PITCH_BITS;

// Serializes an array of notes into a compact string for URL sharing
export function serializeSfx(notes: (number | undefined)[]): string {
  const buffer = new Uint8Array(32).fill(0x00);

  for (const [index, value] of notes.entries()) {
    if (value === undefined) continue;
    buffer[index] = (value & PITCH_MASK) | HAS_NOTE_MASK;
  }

  // Convert to base64 for URL-safe encoding
  return btoa(String.fromCharCode(...buffer));
}

// Deserializes a string back into an array of note pitches / undefined
export function deserializeSfx(serialized: string): (number | undefined)[] {
  const result: (number | undefined)[] = new Array(32).fill(undefined);

  // Decode base64 to bytes
  const bytes = new Uint8Array(
    atob(serialized)
      .split("")
      .map((char) => char.charCodeAt(0))
  );

  if (bytes.length !== 32) {
    throw new Error("Invalid serialized SFX");
  }

  for (const [index, value] of bytes.entries()) {
    const hasNote = (value & HAS_NOTE_MASK) !== 0;
    result[index] = hasNote ? value & PITCH_MASK : undefined;
  }

  return result;
}
