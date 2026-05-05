export interface Point {
  x: number;
  y: number;
}

export interface RingNote {
  note: string;
  frequency: number;
}

export interface RingLayout {
  id: "left" | "right";
  label: string;
  center: Point;
  innerRadius: number;
  outerRadius: number;
  notes: RingNote[];
}

export interface RingHit {
  ringId: RingLayout["id"];
  note: RingNote;
  sectorIndex: number;
  distance: number;
  angle: number;
}

export const CHROMATIC_NOTES = [
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
] as const;

const A4_FREQUENCY = 440;
const A4_MIDI = 69;

const noteToMidi = (noteIndex: number, octave: number) => (octave + 1) * 12 + noteIndex;

const midiToFrequency = (midi: number) =>
  Number((A4_FREQUENCY * 2 ** ((midi - A4_MIDI) / 12)).toFixed(2));

export const createChromaticScale = (octave: number): RingNote[] =>
  CHROMATIC_NOTES.map((note, index) => ({
    note: `${note}${octave}`,
    frequency: midiToFrequency(noteToMidi(index, octave)),
  }));

export const getRingHit = (point: Point, ring: RingLayout): RingHit | null => {
  const dx = point.x - ring.center.x;
  const dy = point.y - ring.center.y;
  const distance = Math.hypot(dx, dy);

  if (distance < ring.innerRadius || distance > ring.outerRadius) {
    return null;
  }

  const angle = (Math.atan2(dy, dx) + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
  const sectorIndex = Math.floor((angle / (Math.PI * 2)) * ring.notes.length) % ring.notes.length;

  return {
    ringId: ring.id,
    note: ring.notes[sectorIndex],
    sectorIndex,
    distance,
    angle,
  };
};

export const getNoteLabelPosition = (
  ring: RingLayout,
  sectorIndex: number,
  radius = (ring.innerRadius + ring.outerRadius) / 2,
): Point => {
  const angle = (sectorIndex + 0.5) * ((Math.PI * 2) / ring.notes.length) - Math.PI / 2;

  return {
    x: ring.center.x + Math.cos(angle) * radius,
    y: ring.center.y + Math.sin(angle) * radius,
  };
};
