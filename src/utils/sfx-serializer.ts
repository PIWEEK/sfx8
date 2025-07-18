// Each note uses 8 bits (1 byte):
// - 7 bits for pitch index (0-127, but we only use 0-63)
// - 1 bit to indicate if the slot has a note (0 = empty, 1 = has note)
// Speed uses 1 byte at the beginning (0-255)
const PITCH_BITS = 7;

const PITCH_MASK = (1 << PITCH_BITS) - 1;
const HAS_NOTE_MASK = 1 << PITCH_BITS;

// Serializes an array of notes and speed into a compact string for URL sharing
export function serializeSfx(
  notes: (number | undefined)[],
  speed: number
): string {
  const buffer = new Uint8Array(33).fill(0x00); // 1 byte for speed + 32 bytes for notes

  // Set speed at the beginning
  buffer[0] = speed & 0xff;

  // Set notes starting from index 1
  for (const [index, value] of notes.entries()) {
    if (value === undefined) continue;
    buffer[index + 1] = (value & PITCH_MASK) | HAS_NOTE_MASK;
  }

  // Convert to base64 for URL-safe encoding
  return btoa(String.fromCharCode(...buffer));
}

// Deserializes a string back into an object with speed and array of note pitches / undefined
export function deserializeSfx(serialized: string): {
  speed: number;
  notes: (number | undefined)[];
} {
  const notes: (number | undefined)[] = new Array(32).fill(undefined);

  // Decode base64 to bytes
  const bytes = new Uint8Array(
    atob(serialized)
      .split("")
      .map((char) => char.charCodeAt(0))
  );

  if (bytes.length !== 33) {
    throw new Error("Invalid serialized SFX");
  }

  // Extract speed from first byte
  const speed = bytes[0];

  // Extract notes starting from index 1
  for (const [index, value] of bytes.slice(1).entries()) {
    const hasNote = (value & HAS_NOTE_MASK) !== 0;
    notes[index] = hasNote ? value & PITCH_MASK : undefined;
  }

  return { speed, notes };
}
