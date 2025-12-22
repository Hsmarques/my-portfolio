import { createSignal, createEffect, onCleanup, For } from "solid-js";

interface PianoKeyboardProps {
  onNoteOn: (frequency: number) => void;
  onNoteOff: (frequency: number) => void;
}

// Note frequencies for two octaves starting at C3
const NOTES = [
  // Lower octave (C3-B3)
  { note: "C3", frequency: 130.81, key: "1", isBlack: false },
  { note: "C#3", frequency: 138.59, key: "q", isBlack: true },
  { note: "D3", frequency: 146.83, key: "2", isBlack: false },
  { note: "D#3", frequency: 155.56, key: "w", isBlack: true },
  { note: "E3", frequency: 164.81, key: "3", isBlack: false },
  { note: "F3", frequency: 174.61, key: "4", isBlack: false },
  { note: "F#3", frequency: 185.0, key: "e", isBlack: true },
  { note: "G3", frequency: 196.0, key: "5", isBlack: false },
  { note: "G#3", frequency: 207.65, key: "r", isBlack: true },
  { note: "A3", frequency: 220.0, key: "6", isBlack: false },
  { note: "A#3", frequency: 233.08, key: "t", isBlack: true },
  { note: "B3", frequency: 246.94, key: "7", isBlack: false },
  // Upper octave (C4-C5)
  { note: "C4", frequency: 261.63, key: "z", isBlack: false },
  { note: "C#4", frequency: 277.18, key: "s", isBlack: true },
  { note: "D4", frequency: 293.66, key: "x", isBlack: false },
  { note: "D#4", frequency: 311.13, key: "d", isBlack: true },
  { note: "E4", frequency: 329.63, key: "c", isBlack: false },
  { note: "F4", frequency: 349.23, key: "v", isBlack: false },
  { note: "F#4", frequency: 369.99, key: "g", isBlack: true },
  { note: "G4", frequency: 392.0, key: "b", isBlack: false },
  { note: "G#4", frequency: 415.3, key: "h", isBlack: true },
  { note: "A4", frequency: 440.0, key: "n", isBlack: false },
  { note: "A#4", frequency: 466.16, key: "j", isBlack: true },
  { note: "B4", frequency: 493.88, key: "m", isBlack: false },
  { note: "C5", frequency: 523.25, key: ",", isBlack: false },
];

const WHITE_KEYS = NOTES.filter((n) => !n.isBlack);
const BLACK_KEYS = NOTES.filter((n) => n.isBlack);

// Position mapping for black keys (percentage from left)
// 14 white keys total, each ~7.14% width
const getBlackKeyPosition = (note: string): number => {
  const positions: Record<string, number> = {
    "C#3": 5.5,
    "D#3": 12.5,
    "F#3": 26.5,
    "G#3": 33.5,
    "A#3": 40.5,
    "C#4": 54.5,
    "D#4": 61.5,
    "F#4": 75.5,
    "G#4": 82.5,
    "A#4": 89.5,
  };
  return positions[note] ?? 0;
};

export default function PianoKeyboard(props: PianoKeyboardProps) {
  const [activeKeys, setActiveKeys] = createSignal<Set<string>>(new Set());

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) return;

    const note = NOTES.find((n) => n.key === e.key.toLowerCase());
    if (note && !activeKeys().has(note.note)) {
      e.preventDefault();
      setActiveKeys((prev) => new Set([...prev, note.note]));
      props.onNoteOn(note.frequency);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    const note = NOTES.find((n) => n.key === e.key.toLowerCase());
    if (note) {
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(note.note);
        return next;
      });
      props.onNoteOff(note.frequency);
    }
  };

  const handleNoteStart = (note: typeof NOTES[0]) => {
    if (!activeKeys().has(note.note)) {
      setActiveKeys((prev) => new Set([...prev, note.note]));
      props.onNoteOn(note.frequency);
    }
  };

  const handleNoteEnd = (note: typeof NOTES[0]) => {
    if (activeKeys().has(note.note)) {
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(note.note);
        return next;
      });
      props.onNoteOff(note.frequency);
    }
  };

  createEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    onCleanup(() => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    });
  });

  return (
    <div class="flex flex-col items-center gap-3">
      {/* Keyboard hints */}
      <div class="flex flex-col items-center gap-1">
        <p class="text-[9px] text-gray-500 tracking-wide">
          Lower octave: <span class="text-gray-400 font-mono">1 2 3 4 5 6 7</span> (white) <span class="text-gray-400 font-mono">Q W E R T</span> (black)
        </p>
        <p class="text-[9px] text-gray-500 tracking-wide">
          Upper octave: <span class="text-gray-400 font-mono">Z X C V B N M ,</span> (white) <span class="text-gray-400 font-mono">S D G H J</span> (black)
        </p>
      </div>

      {/* Piano keyboard container */}
      <div
        class="relative select-none w-full max-w-2xl"
        style={{ height: "120px" }}
      >
        {/* White keys */}
        <div class="absolute inset-0 flex gap-px">
          <For each={WHITE_KEYS}>
            {(note) => {
              const isActive = () => activeKeys().has(note.note);
              return (
                <button
                  type="button"
                  class="relative flex-1 rounded-b transition-all duration-75"
                  style={{
                    background: isActive()
                      ? "linear-gradient(to bottom, #e8e0d0 0%, #D4AF37 100%)"
                      : "linear-gradient(to bottom, #fafafa 0%, #e8e0d0 100%)",
                    "box-shadow": isActive()
                      ? "inset 0 2px 8px rgba(0,0,0,0.3), 0 0 12px rgba(212, 175, 55, 0.6)"
                      : "inset 0 -4px 8px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.2)",
                    transform: isActive() ? "translateY(2px)" : "translateY(0)",
                    border: "1px solid #bbb",
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleNoteStart(note);
                  }}
                  onMouseUp={() => handleNoteEnd(note)}
                  onMouseLeave={() => handleNoteEnd(note)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleNoteStart(note);
                  }}
                  onTouchEnd={() => handleNoteEnd(note)}
                  aria-label={`Play ${note.note}`}
                >
                  <span
                    class="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-mono uppercase"
                    style={{ color: isActive() ? "#1a1a1a" : "#999" }}
                  >
                    {note.key}
                  </span>
                </button>
              );
            }}
          </For>
        </div>

        {/* Black keys */}
        <For each={BLACK_KEYS}>
          {(note) => {
            const isActive = () => activeKeys().has(note.note);
            const leftPos = () => getBlackKeyPosition(note.note);

            return (
              <button
                type="button"
                class="absolute top-0 rounded-b transition-all duration-75 z-10"
                style={{
                  left: `${leftPos()}%`,
                  width: "5.5%",
                  height: "65px",
                  background: isActive()
                    ? "linear-gradient(to bottom, #444 0%, #D4AF37 100%)"
                    : "linear-gradient(to bottom, #333 0%, #111 100%)",
                  "box-shadow": isActive()
                    ? "inset 0 2px 4px rgba(0,0,0,0.5), 0 0 12px rgba(212, 175, 55, 0.6)"
                    : "inset 0 -2px 4px rgba(255,255,255,0.1), 0 4px 8px rgba(0,0,0,0.5)",
                  transform: isActive() ? "translateY(2px)" : "translateY(0)",
                  border: "1px solid #222",
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNoteStart(note);
                }}
                onMouseUp={(e) => {
                  e.stopPropagation();
                  handleNoteEnd(note);
                }}
                onMouseLeave={() => handleNoteEnd(note)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNoteStart(note);
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  handleNoteEnd(note);
                }}
                aria-label={`Play ${note.note}`}
              >
                <span
                  class="absolute bottom-1 left-1/2 -translate-x-1/2 text-[7px] font-mono uppercase"
                  style={{ color: isActive() ? "#1a1a1a" : "#555" }}
                >
                  {note.key}
                </span>
              </button>
            );
          }}
        </For>
      </div>
    </div>
  );
}
