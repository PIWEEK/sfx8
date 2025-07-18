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

  // Convert to base64 and URL encode it properly
  const binaryString = Array.from(buffer, (byte) =>
    String.fromCharCode(byte)
  ).join("");
  const base64 = btoa(binaryString);
  const result = encodeURIComponent(base64);
  return result;
}

// Deserializes a string back into an object with speed and array of note pitches / undefined
export function deserializeSfx(serialized: string): {
  speed: number;
  notes: (number | undefined)[];
} {
  const notes: (number | undefined)[] = new Array(32).fill(undefined);

  // URL decode the input first
  const decodedSerialized = decodeURIComponent(serialized);
  const binaryString = atob(decodedSerialized);

  // Decode base64 to bytes
  if (binaryString.length !== 33) {
    throw new Error(
      "Invalid serialized SFX: expected 33 bytes, got " + binaryString.length
    );
  }

  const bytes = new Uint8Array(binaryString.length);
  for (const [index, byte] of binaryString.split("").entries()) {
    bytes[index] = byte.charCodeAt(0);
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
