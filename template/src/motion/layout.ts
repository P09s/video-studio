// The layout system every scene follows, from the research on title-safe areas and on-screen reading.
// - Safe area: text settles inside the central 90% of the frame (broadcast title-safe); it may enter from outside.
// - Grid: 12 columns inside the safe area. Text owns one side (columns 1-6), the picture the other.
// - One main phrase per screen, 3 to 6 words per line, on one shared baseline.
// - Reading time: hold a line at least 0.5 s per word, plus 0.5 s after it lands.

export const FRAME = { width: 1920, height: 1080 };

/** Title-safe margins (5% each side, so 90% of the frame). */
export const SAFE = { x: 96, y: 54 };

const GUTTER = 32;
const COLUMN = (FRAME.width - 2 * SAFE.x - 11 * GUTTER) / 12;

/** Left edge of column `n` (1 to 12), in pixels. */
export const col = (n: number) => SAFE.x + (n - 1) * (COLUMN + GUTTER);

/** Width spanned by columns `from` to `to`, inclusive. */
export const span = (from: number, to: number) => col(to) + COLUMN - col(from);

/** Type scale (px at 1080p). One display line per screen; supporting text is at most `body`. */
export const TYPE = { display: 112, title: 84, body: 44, caption: 30 };

/** Frames a line of `words` words should stay readable at 30 fps. */
export const holdFrames = (words: number) => Math.ceil((words * 0.5 + 0.5) * 30);

// --- 9:16 (1080 x 1920), from the Reels and Shorts safe zones.
/** The text band at the top, and the bottom of the picture area: under `bottom` the apps draw their caption, name
 * and buttons. The right-hand button column (x over 900, y 900-1700) is kept clear too. */
export const VERTICAL = { x: 72, top: 230, width: 1080 - 144, bottom: 1520 };

/** Frames per beat of a track at `bpm`, at 30 fps (124 BPM: 14.5). Cut on multiples of it. */
export const beat = (bpm: number) => (60 / bpm) * 30;
