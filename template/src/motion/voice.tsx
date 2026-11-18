// Voiceover lines made by scripts/voice.mjs. Import the lengths file of a voice set, then place each line with
// <VoiceLine> and time shots with framesOf():
//
//   import lengths from '../../public/audio/voice/example/lengths.json';
//   <VoiceLine set="example" id="hook" at={12} />
//   const hookEnd = 12 + framesOf(lengths, 'hook', fps);
//
// Rules (skills/launch-video/rules/sound.md): leave at least 6 frames between lines, never let two overlap, and
// duck the music under speech with musicVolumeUnder().
import { Audio, Sequence, staticFile } from 'remotion';

type Lengths = { lengths: Record<string, number> };

/** One voice line, starting at frame `at` of the whole video. */
export function VoiceLine({ set, id, at, volume = 1 }: { set: string; id: string; at: number; volume?: number }) {
  return (
    <Sequence from={at} layout="none">
      <Audio src={staticFile(`audio/voice/${set}/${id}.wav`)} volume={volume} />
    </Sequence>
  );
}

/** How many frames a line lasts, rounded up. */
export function framesOf(file: Lengths, id: string, fps: number): number {
  const seconds = file.lengths[id];
  if (seconds === undefined) throw new Error(`No voice line "${id}": run scripts/voice.mjs again`);
  return Math.ceil(seconds * fps);
}

/** The music volume at a frame: `base` normally, `under` while any line plays, with 6-frame ramps. Pass the
 * lines as [start frame, length in frames]. Use as <Audio volume={(f) => musicVolumeUnder(f, lines)} />. */
export function musicVolumeUnder(frame: number, lines: [number, number][], base = 0.4, under = 0.16): number {
  let v = base;
  for (const [start, length] of lines) {
    const end = start + length;
    if (frame >= start - 6 && frame <= end + 6) {
      const into = Math.min(1, (frame - (start - 6)) / 6, (end + 6 - frame) / 6);
      v = Math.min(v, base - (base - under) * Math.max(0, into));
    }
  }
  return v;
}
