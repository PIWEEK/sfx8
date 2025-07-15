import { useRef, useCallback, useState, useMemo } from "react";
import styles from "./NoteEditor.module.css";
import { noteName } from "../../utils/notes";

const NOTE_COUNT = 32;
const NOTE_GAP = 8;
const NOTE_SIZE = 8;

function Note({
  note,
  index,
  onMouseOver,
}: {
  note: number;
  index: number;
  onMouseOver?: (event: { note: number }) => void;
}) {
  const y = 260 - note * 4;
  const x = index * (NOTE_SIZE + NOTE_GAP);

  const handleMouseOver = useCallback(() => {
    if (onMouseOver && typeof onMouseOver === "function") {
      onMouseOver({ note });
    }
  }, [note, onMouseOver]);

  return (
    <g transform={`translate(${x}, ${0})`} onMouseOver={handleMouseOver}>
      {/* Invisible hit area for mouse events */}
      <rect width={NOTE_SIZE + NOTE_GAP} height={260} fill="transparent" />
      <rect
        x={NOTE_GAP / 2}
        y={y - NOTE_SIZE}
        width={NOTE_SIZE}
        height={NOTE_SIZE}
        fill="var(--accent-color)"
      />
      <rect
        x={NOTE_GAP / 2}
        y={y}
        width={NOTE_SIZE}
        height={260 - y}
        fill="var(--alt-main-color-secondary)"
      />
    </g>
  );
}

function NoteEditor() {
  const svgRef = useRef<SVGSVGElement>(null);
  const isMouseDown = useRef(false);

  const [displayNote, setDisplayNote] = useState<number | undefined>(undefined);

  const humanizedDisplayNote = useMemo(() => {
    if (displayNote === undefined) return undefined;
    return noteName(displayNote);
  }, [displayNote]);

  // init the notes array with 32 empty slots
  const [notes, _] = useState<(number | undefined)[]>(() => {
    const data: (number | undefined)[] = Array.from(
      { length: NOTE_COUNT },
      () => undefined
    );
    data[0] = 0; // C0
    data[1] = 1;
    data[2] = 2;
    data[3] = 5;
    data[4] = 7;
    data[5] = 9;
    data[6] = 11;
    data[7] = 12;
    data[8] = 16;
    data[9] = 18;
    data[10] = 20;
    data[11] = 22;
    data[31] = 63; // D#5
    return data;
  });

  function addNoteAt(_x: number, _y: number) {
    // TODO: Implement this
  }

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      if (!isMouseDown.current) return;

      const { clientX, clientY } = event;
      const { left, top } = svgRef.current?.getBoundingClientRect() ?? {
        left: 0,
        top: 0,
      };
      const x = clientX - left;
      const y = clientY - top;
      addNoteAt(x, y);
    },
    [addNoteAt]
  );

  const handleNoteOver = useCallback((event: { note: number }) => {
    setDisplayNote(event.note);
  }, []);

  return (
    <section className={styles.container}>
      <svg
        className={styles.viewport}
        ref={svgRef}
        onMouseDown={() => (isMouseDown.current = true)}
        onMouseUp={() => (isMouseDown.current = false)}
        onMouseMove={handleMouseMove}
      >
        {notes.map((note, index) =>
          note !== undefined ? (
            <Note
              note={note}
              key={index}
              index={index}
              onMouseOver={handleNoteOver}
            />
          ) : null
        )}
      </svg>
      <footer className={styles.footer}>
        <p>{humanizedDisplayNote}</p>
      </footer>
    </section>
  );
}

export default NoteEditor;
