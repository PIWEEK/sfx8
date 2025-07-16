import { useState } from "react";
import type { ReactNode } from "react";
import SfxContext, { NOTE_COUNT } from "./sfx-context";

interface SfxProviderProps {
  children: ReactNode;
}

export const SfxProvider = ({ children }: SfxProviderProps) => {
  const [notes, setNotes] = useState<(number | undefined)[]>(
    Array(NOTE_COUNT).fill(undefined)
  );
  const [speed, setSpeed] = useState<number>(200);

  return (
    <SfxContext value={{ notes, setNotes, speed, setSpeed }}>
      {children}
    </SfxContext>
  );
};
