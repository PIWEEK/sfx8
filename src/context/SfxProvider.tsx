import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import SfxContext, { NOTE_COUNT } from "./sfx-context";
import { serializeSfx, deserializeSfx } from "../utils/sfx-serializer";

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

// Helper function to get URL parameters
const getUrlParam = (param: string): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

// Helper function to initialize data with priority: URL param > localStorage > default
const initializeData = () => {
  const defaultNotes = new Array(NOTE_COUNT).fill(undefined);
  const defaultSpeed = 128;

  // Try to load from URL parameter first
  const sfxParam = getUrlParam("sfx");
  if (sfxParam) {
    try {
      const { speed, notes } = deserializeSfx(sfxParam);
      return { notes, speed };
    } catch (error) {
      console.warn("Failed to deserialize SFX from URL parameter:", error);
      // Fall through to localStorage
    }
  }

  // Fallback to localStorage
  const storedNotes = getFromStorage(STORAGE.NOTES, defaultNotes);
  const storedSpeed = getFromStorage(STORAGE.SPEED, defaultSpeed);

  return { notes: storedNotes, speed: storedSpeed };
};

export const SfxProvider = ({ children }: SfxProviderProps) => {
  const [notes, setNotes] = useState<(number | undefined)[]>(() => {
    const { notes } = initializeData();
    return notes;
  });

  const [speed, setSpeed] = useState<number>(() => {
    const { speed } = initializeData();
    return speed;
  });

  // Initialize localStorage with the loaded data
  useEffect(() => {
    saveToStorage(STORAGE.NOTES, notes);
    saveToStorage(STORAGE.SPEED, speed);
  }, []); // Only run once on mount

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
