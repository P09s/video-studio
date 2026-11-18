// The videos' UI sounds, by what they mark on screen. Chosen by measurement (length, brightness, pitch
// direction, where the peak is): a soft low pop for a finger tap, a real mouse click, a rising two-note chime
// for success, a cascade of glass notes for rows building in. All from Kenney's CC0 packs
// (public/audio/LICENSES.md). `lead` starts a sound early by that many frames, so a sound whose peak comes late
// peaks on the frame of the event.
import { Audio, Sequence, staticFile } from 'remotion';

export const SOUNDS = {
  tap: { file: 'select_006', volume: 0.6 },
  key: { file: 'click_002', volume: 0.22 },
  key2: { file: 'click_003', volume: 0.22 },
  sent: { file: 'drop_001', volume: 0.45 },
  reply: { file: 'drop_004', volume: 0.5 },
  card: { file: 'maximize_009', volume: 0.45 },
  success: { file: 'confirmation_004', volume: 0.55, lead: 5 },
  row1: { file: 'glass_006', volume: 0.32 },
  row2: { file: 'glass_001', volume: 0.32 },
  row3: { file: 'glass_002', volume: 0.32 },
  row4: { file: 'glass_005', volume: 0.32 },
  row5: { file: 'glass_003', volume: 0.32 },
  ring: { file: 'toggle_004', volume: 0.35 },
  arrive: { file: 'question_003', volume: 0.5 },
  click: { file: 'mouseclick1', volume: 0.8 },
  release: { file: 'mouserelease1', volume: 0.6 },
  line: { file: 'drop_003', volume: 0.4 },
  strike: { file: 'scratch_001', volume: 0.3 },
  reveal: { file: 'glass_004', volume: 0.45 },
  live: { file: 'toggle_002', volume: 0.4 },
  chip: { file: 'pluck_002', volume: 0.22 },
  // Made here with ffmpeg (public/audio/LICENSES.md): a heart-monitor beep (1000 Hz) and a marker stroke.
  beep: { file: 'monitor_beep', volume: 0.9 },
  marker: { file: 'marker_stroke', volume: 0.35 },
} as const;

export type Sound = keyof typeof SOUNDS;
export const ROWS: Sound[] = ['row1', 'row2', 'row3', 'row4', 'row5'];

/** One sound at a frame of the whole video. `pitch` shifts it in semitones (by playback rate), so a sound that
 * repeats can rise or vary instead of repeating identically. */
export function Cue({ at, sound, volume = 1, pitch = 0 }: { at: number; sound: Sound; volume?: number; pitch?: number }) {
  const s = SOUNDS[sound];
  const lead = 'lead' in s ? s.lead : 0;
  return (
    <Sequence from={Math.max(0, at - lead)} layout="none">
      <Audio src={staticFile(`audio/sfx/${s.file}.wav`)} volume={s.volume * volume} playbackRate={2 ** (pitch / 12)} />
    </Sequence>
  );
}
