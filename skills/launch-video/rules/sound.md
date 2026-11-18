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
- At most three sounds in any two seconds.
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

The first films used Kokoro for English (local, free) and Gemini 3.8 Flash TTS (voice Kore, through OpenRouter)
for Hindi and Punjabi, which sounded natural in both. The template has no voice script yet: add one only with the
user's yes for the provider. Space lines so none overlaps; duck the music under speech.
