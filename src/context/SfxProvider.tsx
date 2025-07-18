import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import SfxContext, { NOTE_COUNT } from "./sfx-context";
import { serializeSfx } from "../utils/sfx-serializer";

interface SfxProviderProps {
  children: ReactNode;
}

// LocalStorage keys
const STORAGE = {
  NOTES: "sfx8_notes",
  SPEED: "sfx8_speed",
} as const;

// Helper function to get data from localStorage
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  if (stored === null) return defaultValue;
  const parsed = JSON.parse(stored);

  // Special handling for notes array to convert null back to undefined,
  // so starting notes are empty (rather than 0)
  if (key === STORAGE.NOTES && Array.isArray(parsed)) {
    return parsed.map((value) => (value === null ? undefined : value)) as T;
  }

  return parsed;
};

// Helper function to save data to localStorage
const saveToStorage = <T,>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const SfxProvider = ({ children }: SfxProviderProps) => {
  const [notes, setNotes] = useState<(number | undefined)[]>(() =>
    getFromStorage(STORAGE.NOTES, new Array(NOTE_COUNT).fill(undefined))
  );
  const [speed, setSpeed] = useState<number>(() =>
    getFromStorage(STORAGE.SPEED, 128)
  );

  const reset = () => {
    setNotes(new Array(NOTE_COUNT).fill(undefined));
    setSpeed(128);
  };

  useEffect(() => {
    saveToStorage(STORAGE.NOTES, notes);
  }, [notes]);

  useEffect(() => {
    saveToStorage(STORAGE.SPEED, speed);
  }, [speed]);

  const serialize = () => {
    return serializeSfx(notes, speed);
  };

  return (
    <SfxContext.Provider
      value={{ notes, setNotes, speed, setSpeed, reset, serialize }}
    >
      {children}
    </SfxContext.Provider>
  );
};
