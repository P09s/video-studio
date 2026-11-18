# Video Studio

Launch and promo videos made from code, for any product. In Claude Code, type `/launch-video`. Claude asks what
the video is about, who it is for, the formats and length, the feel, the characters and the call to action, as
multiple-choice questions. It then studies the product, writes a storyboard for your approval, builds the film,
renders it, and checks it before you watch it.

The films are made with [Remotion](https://www.remotion.dev) (React, rendered frame by frame): motion graphics,
line-drawn characters with expressions, rebuilt app screens, original music and sound effects, in 9:16 for Reels
and Shorts and 16:9 for YouTube and decks.

## Install

You need Claude Code, Node 20 or newer, pnpm (or npm), and ffmpeg with its analysis filters
(`brew install ffmpeg` on a Mac).

```bash
git clone <this repo> ~/video-studio
claude plugin marketplace add ~/video-studio
claude plugin install video-studio@video-studio
```

Start a new Claude Code session, then type `/launch-video` (or ask for "a 30-second reel for <product>").

## What happens

| Stage | What you do |
|---|---|
| 0. Project | Nothing: Claude makes a video project for the product (`bin/new-video <folder>`) and installs it |
| 1. Interview | Answer two rounds of multiple-choice questions; give the logo, colours and domain |
| 2. Research | Point Claude at the product: its docs, its code, or a staging site you sign in to |
| 3. Storyboard | Approve or change the shot list and the exact words on screen |
| 4. Test scene | Approve or change the first seconds, rendered as stills |
| 5-6. Build and review | Nothing: Claude builds, renders, and runs automatic checks and an independent reviewer |
| 7. Hand over | Watch the video; approve or ask for changes |

## What is in it

| Folder | What |
|---|---|
| `skills/launch-video/` | The skill: the stages, and the rules learned from the first films (story, layout, motion, sound, cast, screens, review) |
| `template/` | The Remotion project every video starts from: `src/brand.ts` (the brand pack), the motion kit, scene pieces, the cast, sound effects, and the scripts below |
| `template/scripts/` | `review.mjs` (automatic checks and a frame sheet), `master.sh` (loudness for social apps), `music.mjs` (music with Lyria through OpenRouter), `capture.mjs` (screenshots of a site you sign in to) |
| `bin/new-video` | Makes a new video project from the template |

## Costs and licences

- **Remotion** is free for individuals and companies of up to 3 people. A larger company needs a
  [Remotion company licence](https://www.remotion.dev/license) before it publishes videos made with it.
- **Music** with `scripts/music.mjs` uses your own OpenRouter key (`OPENROUTER_API_KEY`) and is billed to it.
  Generated tracks carry Google's SynthID watermark.
- **Sound effects** are Kenney's CC0 packs and two made with ffmpeg (`template/public/audio/LICENSES.md`).
- **Characters** are Open Peeps by Pablo Stanley (CC0), through `react-peeps` (MIT).

## Safety

Claude never types your passwords: you sign in to a site yourself. Keys come only from your environment. Any data
on screen is invented. New packages, downloads and paid services need your yes. Publishing a video is always your
action.
