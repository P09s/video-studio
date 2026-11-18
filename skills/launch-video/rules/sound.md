# Sound

You cannot hear. Choose and place sounds by measurement and by what is on screen, then ask the user to listen.

## Music

- The first film used an upbeat Lyria 3 Pro track: 124 BPM, quiet until a break at 6.9 s and the drop at 7.3 s.
  It was chosen over a calmer track and over one that had a DJ voice tag in it.
- New track: `node scripts/music.mjs <name> "<prompt>"`. Always say "Instrumental only, no vocals, no spoken
  words, no DJ tags", the BPM, the length, and where the build and the drop go ("sparse for 7 seconds, then a
  drop into the full beat"). Generate two, measure both, keep the one whose drop is sharper:

  ```bash
  for t in $(seq 6.5 0.1 7.6); do ffmpeg -v info -ss $t -t 0.1 -i <track> -af volumedetect -f null - 2>&1 | grep -o "max_volume: [-0-9.]*"; done
  ```
- Music sits at 0.38-0.4 volume under sound effects, lower under a voice, fading out over the last second.

## Sound effects (`src/motion/sfx.tsx`)

- Every sound marks something on screen, on its frame (`Cue at=`). `lead` starts a late-peaking sound early.
- No repeats that sound identical: give repeated sounds a `pitch` (semitones). Three question marks rise
  do-mi-so (0, 4, 7); cards climb a scale; a second phone ring is higher; clock ticks alternate.
- At most three sounds in any two seconds. Sounds that overlap blur into one: four pops within nine frames were
  heard as one, so give a burst of items one sound.
- Never pitch a sound shorter than about 0.05 s (the `key` clicks): played at another rate it drops out of the
  render entirely. Vary short clicks by using a different file.
- Put a wipe's or transition's sound where the movement starts, not where it ends; ending sounds feel late.
- Check the sounds with an effects-only render (`--props='{"music":null}'`, `--codec=wav`) and
  `silencedetect=noise=-45dB:d=0.03`: every cue should start on its frame. A cue missing from that list either
  overlaps the tail of the one before (check the level just before and at its frame) or did not play.
- No noise whooshes or swishes: generated noise sounded "like rubbing a broom on the floor".
- Fitted sounds, by what they mark:

| On screen | Sound |
|---|---|
| Finger tap / mouse click | `tap` / `click` + `release` |
| Message sent / reply | `sent` / `reply` |
| Card or panel appears | `card` |
| Success, booked | `success` |
| Rows building in | `row1`-`row5` (rising glass notes) |
| A highlight drawn on a result | `marker` (a 0.3 s marker stroke) |
| Heartbeat line spike | `beep` (a 1000 Hz monitor beep on the spike's frame) |
| Someone arrives, the mascot lands | `arrive` |
| Logo reveal / "live" | `reveal` / `live` |
| Small item pops | `chip` with rising pitch |

Two mismatches were flagged in review, both since fixed: a drop sound on the heartbeat line and a toggle click
on the report highlights. Match the sound to the object's nature (a monitor beeps, a marker scratches).

## Mastering

`scripts/master.sh`: loudness to -14 LUFS with a limiter at -2 dB (loudnorm alone overshot to +1.3 dB). The review
checks -14 +-1 LUFS and true peak at or under -1 dBFS.

## Voice

`scripts/voice.mjs` makes voiceover lines with Gemini text-to-speech through OpenRouter (the same key as the music).
The first films used it, voice Kore, for Hindi and Punjabi, and it sounded natural in both; English works too.

1. Write `voices/<name>.voice.json`: `voice`, `instructions` (language, accent, tone, pace), and one line per beat,
   each a short sentence (copy `voices/example.voice.json`). One file per language.
2. `node scripts/voice.mjs voices/<name>.voice.json` writes `public/audio/voice/<name>/<id>.wav` and `lengths.json`.
   Re-running makes only the lines that changed.
3. In the video, place lines with `<VoiceLine set id at>` and time each shot from `framesOf(lengths, id, fps)`
   (`src/motion/voice.tsx`): the voice sets the pace, not the other way round. A longer language (Punjabi runs
   longer than English) gets longer beats from its own lengths file.
4. Leave at least 6 frames between lines; never overlap two. Duck the music under speech with `musicVolumeUnder`
   (0.4 down to about 0.16).
5. Captions say the same words as the voice, or less. A native speaker checks every non-English line before the
   video is shared.
