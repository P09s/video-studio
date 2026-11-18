// Reads the video project's .env (git-ignored) into process.env, without overriding what the shell already set.
// Values are never printed. Lines are KEY=value; blank lines and # comments are skipped; quotes around a value
// are removed.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const file = join(dirname(fileURLToPath(import.meta.url)), '..', '.env');
if (existsSync(file)) {
  for (const raw of readFileSync(file, 'utf8').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const at = line.indexOf('=');
    if (at < 1) continue;
    const name = line.slice(0, at).trim();
    const value = line.slice(at + 1).trim().replace(/^(['"])(.*)\1$/, '$2');
    if (value && process.env[name] === undefined) process.env[name] = value;
  }
}
