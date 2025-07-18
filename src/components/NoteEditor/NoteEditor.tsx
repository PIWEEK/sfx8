import { useRef, useCallback, useState, useMemo, useContext } from "react";
import styles from "./NoteEditor.module.css";

import SfxContext, { NOTE_COUNT, PITCH_COUNT } from "../../context/sfx-context";
import { noteName } from "../../utils/notes";

const NOTE_GAP = 8;
const NOTE_SIZE = 8;

function Note({
  note,
  index,
  onDelete,
}: {
  note: number;
  index: number;
  onDelete: (index: number) => void;
}) {
  const y = 260 - note * 4;
  const x = index * (NOTE_SIZE + NOTE_GAP);

  const handleRightClick = (event: React.MouseEvent<SVGRectElement>) => {
    event.preventDefault();
    if (onDelete && typeof onDelete === "function") {
      onDelete(index);
    }
  };

  return (
    <g transform={`translate(${x}, ${0})`} onContextMenu={handleRightClick}>
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

function SpeedControl() {
  const { speed, setSpeed } = useContext(SfxContext);

  return (
    <p>
      Speed{" "}
      <input
        type="number"
        min={0}
        max={255}
        defaultValue={speed}
        onChange={(e) => setSpeed(Number(e.target.value))}
      />
    </p>
  );
}

function NoteEditor() {
  const svgRef = useRef<SVGSVGElement>(null);
  const isMouseDown = useRef(false);

  const { notes, setNotes } = useContext(SfxContext);

  const [displayNote, setDisplayNote] = useState<number | undefined>(undefined);

  const humanizedDisplayNote = useMemo(() => {
    if (displayNote === undefined) return undefined;
    return noteName(displayNote);
  }, [displayNote]);

  function mouseToViewportXY(event: React.MouseEvent<SVGSVGElement>) {
    const { clientX, clientY } = event;
    const { left, top } = svgRef.current?.getBoundingClientRect() ?? {
      left: 0,
      top: 0,
    };
    const x = clientX - left;
    const y = clientY - top;

    return { x, y };
  }

  function xyToNoteSlot(x: number, y: number) {
    const index = Math.max(
      0,
      Math.min(NOTE_COUNT - 1, Math.floor(x / (NOTE_SIZE + NOTE_GAP)))
    );
    const pitch = Math.max(
      0,
      Math.min(PITCH_COUNT - 1, Math.floor((260 - y) / 4))
    );
    return { index, pitch };
  }

  const addNoteAt = useCallback(
    (index: number, pitch: number) => {
      const newNotes = [...notes];
      newNotes[index] = pitch;

      setNotes(newNotes);
    },
    [notes, setNotes]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      const { x, y } = mouseToViewportXY(event);
      const { index, pitch } = xyToNoteSlot(x, y);
      setDisplayNote(pitch);

      if (!isMouseDown.current) return;
      addNoteAt(index, pitch);
    },
    [addNoteAt, setDisplayNote]
  );

  const handleMouseClick = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      isMouseDown.current = true;

      const { x, y } = mouseToViewportXY(event);
      const { index, pitch } = xyToNoteSlot(x, y);
      addNoteAt(index, pitch);
    },
    [addNoteAt]
  );

  const deleteNoteAt = useCallback(
    (index: number) => {
      const newNotes = [...notes];
      newNotes[index] = undefined;
      setNotes(newNotes);
    },
    [notes, setNotes]
  );

  return (
    <section className={styles.container}>
      <svg
        className={styles.viewport}
        ref={svgRef}
        onMouseDown={handleMouseClick}
        onMouseUp={() => (isMouseDown.current = false)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => (isMouseDown.current = false)}
      >
        {notes.map((note, index) =>
          note !== undefined ? (
            <Note
              note={note}
              key={index}
              index={index}
              onDelete={(index) => deleteNoteAt(index)}
            />
          ) : null
        )}
      </svg>
      <footer className={styles.footer}>
        <p>{humanizedDisplayNote}</p>
        <SpeedControl />
      </footer>
    </section>
  );
}

export default NoteEditor;
