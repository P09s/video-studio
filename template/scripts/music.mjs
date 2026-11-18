// Original background music with Google's Lyria 3 through OpenRouter.
//
//   OPENROUTER_API_KEY=... node scripts/music.mjs <out name> "<prompt>" [model]
//
// The key comes from the environment only and is never printed or written anywhere. Writes
// public/audio/music/<out name>.<ext>. Lyria output carries Google's SynthID watermark: list each track in
// public/audio/LICENSES.md. In the prompt always say "Instrumental only, no vocals, no spoken words, no DJ tags",
// the BPM, the length, and where the build and the drop go.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const [name, prompt, model = 'google/lyria-3-pro-preview'] = process.argv.slice(2);
if (!name || !prompt) {
  console.error('Usage: node scripts/music.mjs <out name> "<prompt>" [model]');
  process.exit(2);
}
const key = process.env.OPENROUTER_API_KEY;
if (!key) {
  console.error('Set OPENROUTER_API_KEY in your shell first (it is never printed).');
  process.exit(2);
}

const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
  body: JSON.stringify({ model, modalities: ['text', 'audio'], stream: true, messages: [{ role: 'user', content: prompt }] }),
});
if (!response.ok) {
  console.error(`HTTP ${response.status} ${(await response.text()).slice(0, 300)}`);
  process.exit(1);
}

// Audio comes streamed: each event carries a piece of base64 audio in delta.audio.data.
const pieces = [];
let format = null;
let text = '';
let buffer = '';
const decoder = new TextDecoder();
for await (const chunk of response.body) {
  buffer += decoder.decode(chunk, { stream: true });
  let newline = buffer.indexOf('\n');
  while (newline >= 0) {
    const line = buffer.slice(0, newline).trim();
    buffer = buffer.slice(newline + 1);
    newline = buffer.indexOf('\n');
    if (!line.startsWith('data: ')) continue;
    const payload = line.slice(6);
    if (payload === '[DONE]') continue;
    let event;
    try {
      event = JSON.parse(payload);
    } catch {
      continue;
    }
    if (event.error) {
      console.error(`Error: ${JSON.stringify(event.error).slice(0, 300)}`);
      process.exit(1);
    }
    const delta = event.choices?.[0]?.delta ?? {};
    text += delta.content ?? '';
    if (delta.audio?.data) pieces.push(delta.audio.data);
    format ??= delta.audio?.format ?? null;
  }
}
if (pieces.length === 0) {
  console.error(`No audio came back. Text: ${text.slice(0, 300)}`);
  process.exit(1);
}
const dir = join(root, 'public/audio/music');
mkdirSync(dir, { recursive: true });
const path = join(dir, `${name}.${format ?? 'mp3'}`);
const bytes = Buffer.from(pieces.join(''), 'base64');
writeFileSync(path, bytes);
console.log(`${path} (${bytes.length} bytes, format ${format}); text: ${text.slice(0, 200)}`);
