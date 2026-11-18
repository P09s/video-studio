// Voiceover lines with Gemini text-to-speech through OpenRouter, in English, Hindi, Punjabi and other languages.
//
//   node scripts/voice.mjs voices/<name>.voice.json
//
// The voice file names the model, the voice, how to speak, and the lines (see voices/example.voice.json). Writes
// public/audio/voice/<name>/<id>.wav per line, and public/audio/voice/<name>/lengths.json with each line's length
// in seconds, so a video can time its shots to the voice (src/motion/voice.tsx). Needs OPENROUTER_API_KEY in the
// shell or the project's git-ignored .env (see .env.example); it is never printed. Needs ffmpeg.
//
// Re-run after any change to a line: only lines whose text, voice or instructions changed are made again.
import './env.mjs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/voice.mjs voices/<name>.voice.json');
  process.exit(2);
}
const key = process.env.OPENROUTER_API_KEY;
if (!key) {
  console.error('No OPENROUTER_API_KEY. Put it in .env (copy .env.example) or export it in your shell. It is never printed.');
  process.exit(2);
}

const script = JSON.parse(readFileSync(join(root, file), 'utf8'));
const name = basename(file).replace(/\.voice\.json$/, '');
const out = join(root, 'public', 'audio', 'voice', name);
mkdirSync(out, { recursive: true });
const lengthsFile = join(out, 'lengths.json');
const before = existsSync(lengthsFile) ? JSON.parse(readFileSync(lengthsFile, 'utf8')) : { lengths: {}, hashes: {} };
const model = script.model ?? 'google/gemini-3.8-flash-tts';
const result = { model, voice: script.voice, lengths: {}, hashes: {} };

for (const line of script.lines) {
  const hash = createHash('sha1').update(JSON.stringify([model, script.voice, script.instructions, line.text])).digest('hex').slice(0, 12);
  const wav = join(out, `${line.id}.wav`);
  if (before.hashes?.[line.id] === hash && existsSync(wav)) {
    result.lengths[line.id] = before.lengths[line.id];
    result.hashes[line.id] = hash;
    console.log(`${line.id}: unchanged, ${before.lengths[line.id]} s`);
    continue;
  }
  const body = { model, input: line.text, voice: script.voice, response_format: 'pcm' };
  if (script.instructions) body.instructions = script.instructions;
  const response = await fetch('https://openrouter.ai/api/v1/audio/speech', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    console.error(`${line.id}: HTTP ${response.status} ${(await response.text()).slice(0, 300)}`);
    process.exit(1);
  }
  // Gemini returns raw 24 kHz, 16-bit, mono PCM.
  const pcm = Buffer.from(await response.arrayBuffer());
  const ff = spawnSync(process.env.FFMPEG ?? 'ffmpeg', ['-v', 'error', '-y', '-f', 's16le', '-ar', '24000', '-ac', '1', '-i', 'pipe:0', wav], { input: pcm });
  if (ff.status !== 0) {
    console.error(`${line.id}: ffmpeg failed ${ff.stderr?.toString().slice(0, 200)}`);
    process.exit(1);
  }
  result.lengths[line.id] = Math.round((pcm.length / 48000) * 100) / 100;
  result.hashes[line.id] = hash;
  console.log(`${line.id}: ${result.lengths[line.id]} s`);
}

writeFileSync(lengthsFile, `${JSON.stringify(result, null, 2)}\n`);
console.log(`Wrote ${Object.keys(result.lengths).length} lines to public/audio/voice/${name}/`);
