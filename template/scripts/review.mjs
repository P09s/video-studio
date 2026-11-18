// Automatic review of a rendered launch video, run before anyone watches it.
//
//   node scripts/review.mjs out/promo-v1-master.mp4 [--max 30] [--shot 5] [--still 1]
//
// Checks (thresholds from the launch-video skill's rules):
//   - length: at most --max seconds, when given
//   - pacing: no shot longer than --shot seconds (cuts found with ffmpeg's scene detection); up to a second over
//     warns, more fails; the last shot (the call to action) may hold
//   - dead air: no stretch over --still seconds where the picture does not change (ffmpeg freezedetect);
//     the last 3 seconds may hold still, for the call to action
//   - black frames: none, except a fade at the very start or end
//   - loudness: -14 LUFS integrated (+-1), true peak at or under -1 dBTP
// Writes out/review/<name>/: report.md, report.json, and sheet.png (one frame a second, with the safe area drawn
// on it: title-safe 90% for 16:9, the Reels/Shorts zone for 9:16). Exits 1 if any check fails.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

// A full ffmpeg build (Homebrew's, or any with scdet, freezedetect and ebur128). Remotion's bundled one lacks them.
const FFMPEG = process.env.FFMPEG ?? 'ffmpeg';
const FFPROBE = process.env.FFPROBE ?? 'ffprobe';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : fallback;
};
if (!file) {
  console.error('Usage: node scripts/review.mjs <video.mp4> [--max seconds] [--shot seconds] [--still seconds]');
  process.exit(2);
}
const MAX = opt('max', null);
const SHOT = opt('shot', 5);
const STILL = opt('still', 1);
const HOLD = 3; // the call to action may hold this long at the end

const probe = JSON.parse(execFileSync(FFPROBE, ['-v', 'error', '-show_entries', 'format=duration:stream=width,height,codec_type', '-of', 'json', file], { encoding: 'utf8' }));
const duration = Number(probe.format.duration);
const video = probe.streams.find((s) => s.codec_type === 'video');
const vertical = video.height > video.width;

/** Runs ffmpeg with a filter and returns its log (filters print what they find to stderr). */
function log(argsList) {
  const result = spawnSync(FFMPEG, ['-hide_banner', '-nostats', ...argsList, '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return `${result.stdout}${result.stderr}`;
}

// Cuts: scene changes. Calibrated on story-v6 against its known cuts: a hard cut scores 14-49, a push between
// two light shots only 1.5-4.6, and other motion in our films stays under 1.2, so the threshold is 1.4. A push
// scores on several frames in a row, so detections closer than 0.4 s merge into one cut.
const sceneLog = log(['-i', file, '-an', '-vf', 'scdet=threshold=1.4,metadata=print']);
const rawCuts = [...sceneLog.matchAll(/lavfi\.scd\.time=([\d.]+)/g)].map((m) => Number(m[1]));
const cuts = [];
for (const t of rawCuts) if (!cuts.length || t - cuts[cuts.length - 1] > 0.4) cuts.push(t);
const bounds = [0, ...cuts, duration];
const shots = bounds.slice(1).map((end, i) => ({ from: bounds[i], to: end, length: end - bounds[i] }));
// The last shot is the call to action and may hold. Over the limit is a warning (the camera may still move inside
// the shot); a full second over fails.
const inner = shots.slice(0, -1);
const longShots = inner.filter((s) => s.length > SHOT + 0.05);
const tooLong = inner.filter((s) => s.length > SHOT + 1);

// Dead air: stretches where the picture barely changes.
const freezeLog = log(['-i', file, '-an', '-vf', `freezedetect=n=-55dB:d=${STILL}`]);
const starts = [...freezeLog.matchAll(/freeze_start: ([\d.]+)/g)].map((m) => Number(m[1]));
const ends = [...freezeLog.matchAll(/freeze_end: ([\d.]+)/g)].map((m) => Number(m[1]));
const freezes = starts.map((from, i) => ({ from, to: ends[i] ?? duration })).map((f) => ({ ...f, length: f.to - f.from }));
const deadAir = freezes.filter((f) => f.from < duration - HOLD - 0.05);

// Black frames.
const blackLog = log(['-i', file, '-an', '-vf', 'blackdetect=d=0.1:pix_th=0.05']);
const blacks = [...blackLog.matchAll(/black_start:([\d.]+) black_end:([\d.]+)/g)].map((m) => ({ from: Number(m[1]), to: Number(m[2]) }));
const badBlacks = blacks.filter((b) => b.from > 0.3 && b.to < duration - 0.3);

// Loudness.
const loudLog = log(['-i', file, '-vn', '-af', 'ebur128=peak=true']);
const summary = loudLog.slice(loudLog.lastIndexOf('Summary:'));
const lufs = Number(summary.match(/I:\s+(-?[\d.]+) LUFS/)?.[1]);
const peak = Number(summary.match(/Peak:\s+(-?[\d.]+) dBFS/)?.[1]);
const loudOk = Math.abs(lufs + 14) <= 1 && peak <= -1;

// Contact sheet, one frame a second, with the safe area drawn on each frame.
const name = basename(file).replace(/\.mp4$/, '');
const dir = join('out', 'review', name);
mkdirSync(dir, { recursive: true });
const safe = vertical
  ? 'drawbox=x=72:y=220:w=936:h=1300:color=red@0.6:t=6'
  : 'drawbox=x=96:y=54:w=1728:h=972:color=red@0.6:t=6';
const columns = vertical ? 10 : 6;
const thumb = vertical ? 216 : 320;
const rows = Math.ceil(duration / columns);
spawnSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', '-i', file, '-vf', `fps=1,${safe},scale=${thumb}:-1,tile=${columns}x${rows}`, '-frames:v', '1', join(dir, 'sheet.png')]);

const checks = [
  { id: 'length', ok: MAX == null || duration <= MAX, detail: `${duration.toFixed(1)} s${MAX == null ? '' : ` (limit ${MAX} s)`}` },
  { id: 'pacing', ok: tooLong.length === 0, warn: longShots.length > 0, detail: `${shots.length} shots, longest before the ending ${Math.max(...inner.map((s) => s.length)).toFixed(1)} s (limit ${SHOT} s)${longShots.map((s) => `; ${s.from.toFixed(1)}-${s.to.toFixed(1)} s is ${s.length.toFixed(1)} s`).join('')}` },
  { id: 'dead air', ok: deadAir.length === 0, detail: deadAir.length ? deadAir.map((f) => `${f.from.toFixed(1)}-${f.to.toFixed(1)} s still`).join('; ') : `nothing still for more than ${STILL} s before the last ${HOLD} s` },
  { id: 'black frames', ok: badBlacks.length === 0, detail: badBlacks.length ? badBlacks.map((b) => `${b.from.toFixed(2)}-${b.to.toFixed(2)} s`).join('; ') : 'none' },
  { id: 'loudness', ok: loudOk, detail: `${lufs} LUFS, true peak ${peak} dBFS (target -14 +-1, peak <= -1)` },
];

const report = { file, duration, size: `${video.width}x${video.height}`, cuts, shots, freezes, blacks, lufs, peak, checks };
writeFileSync(join(dir, 'report.json'), JSON.stringify(report, null, 2));
const md = [
  `# Review: ${basename(file)}`,
  '',
  `${video.width}x${video.height}, ${duration.toFixed(1)} s, ${shots.length} shots. Sheet: ${join(dir, 'sheet.png')} (red box = safe area).`,
  '',
  '| Check | Result | Detail |',
  '|---|---|---|',
  ...checks.map((c) => `| ${c.id} | ${!c.ok ? 'FAIL' : c.warn ? 'warn' : 'pass'} | ${c.detail} |`),
  '',
  'Shot lengths (s): ' + shots.map((s) => s.length.toFixed(1)).join(', '),
  '',
  'Not checked here, for the reviewer: story logic, text inside the safe area on the sheet, readable UI, sound matching the picture.',
].join('\n');
writeFileSync(join(dir, 'report.md'), md);
console.log(md);
process.exit(checks.every((c) => c.ok) ? 0 : 1);
