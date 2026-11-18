# Video Studio

Launch and promo videos made from code, for any product. In Claude Code, type `/launch-video`. Claude asks what
the video is about, who it is for, the formats and length, the feel, the characters and the call to action, as
multiple-choice questions. It then studies the product, writes a storyboard for your approval, builds the film,
renders it, and checks it before you watch it.

The films are made with [Remotion](https://www.remotion.dev) (React, rendered frame by frame): motion graphics,
line-drawn characters with expressions, rebuilt app screens, original music and sound effects, in 9:16 for Reels
and Shorts and 16:9 for YouTube and decks.

## Setup, step by step

About 15 minutes the first time. Steps 2 to 5 are once per laptop; step 6 is once per video.

### 1. Get the repo

The repo is public: [github.com/P09s/video-studio](https://github.com/P09s/video-studio). You need no invite. The
plugin install in step 3 fetches it for you; clone it only if you want to change the skill or the template.

### 2. Install the tools

| Tool | Why | Install (Mac) | Check |
|---|---|---|---|
| Claude Code | Runs the `/launch-video` skill | [claude.com/claude-code](https://claude.com/claude-code) | `claude --version` |
| Node 20 or newer | Builds and renders the films | `brew install node` | `node -v` |
| pnpm (or npm) | Installs each video project | `npm install -g pnpm` | `pnpm -v` |
| ffmpeg with analysis filters | Loudness mastering and the automatic review | `brew install ffmpeg` | `ffmpeg -filters \| grep -E "scdet\|ebur128"` prints two lines |
| git | Installs the plugin from GitHub | `brew install git` | `git --version` |

### 3. Install the plugin

```bash
claude plugin marketplace add P09s/video-studio
claude plugin install video-studio@video-studio
```

Start a new Claude Code session. `/launch-video` is now in the `/` menu.

### 4. Set up your keys (optional)

Only one key exists, and you need it only to make new music. Everything else is free and needs no key.

| Variable | Needed for | Where to get it | Cost |
|---|---|---|---|
| `OPENROUTER_API_KEY` | New background music (`scripts/music.mjs`, Google Lyria) | [openrouter.ai/keys](https://openrouter.ai/keys) | Billed to your key; set a monthly credit limit on the OpenRouter keys page |
| `FFMPEG`, `FFPROBE` | Only if the ffmpeg on your PATH lacks the analysis filters | Your full ffmpeg path, for example `/opt/homebrew/bin/ffmpeg` | Free |

Each person uses their own key. Never share a key in Slack, a commit, a screenshot or this repo.

Set it one of two ways:

- **For every video (recommended):** add `export OPENROUTER_API_KEY=<your key>` to `~/.zshrc`, then open a new terminal.
- **For one video only:** in that video's folder, `cp .env.example .env` and fill in `.env`. It is git-ignored.

Check it is set, without printing it:

```bash
echo ${OPENROUTER_API_KEY:+set}      # prints "set"
```

No key? Bring a licensed music track instead; Claude uses it in place of generated music.

### 5. Install the screenshot browser (optional)

Only if Claude should screenshot a live site you sign in to. Run once inside your first video project:

```bash
npx playwright install chromium
```

### 6. Make a video

Open Claude Code in an empty folder (or anywhere) and type `/launch-video`, or ask for "a 30-second reel for
<product>". Claude makes the video project with `bin/new-video <folder>`, installs it, and walks you through the
stages below. Keep one folder per product, for example `~/videos/<product>-video`, and never inside a company
code repo.

## Updating

```bash
claude plugin marketplace update video-studio
claude plugin update video-studio@video-studio
```

Existing video projects keep their own copy of the template; only new projects get template changes.

## Troubleshooting

| Problem | Fix |
|---|---|
| `/launch-video` not in the menu | Start a new Claude Code session; run `claude plugin list` to check it is installed |
| `marketplace add` fails | Check the name is `P09s/video-studio` and that `git` can reach github.com |
| "No OPENROUTER_API_KEY" | Do step 4, then open a new terminal |
| Review fails on `scdet` or `ebur128` | Your ffmpeg lacks the filters: `brew install ffmpeg`, or set `FFMPEG` and `FFPROBE` |
| Render is slow or the laptop freezes | One render at a time; close the Remotion studio while rendering |

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
- **Music** with `scripts/music.mjs` uses your own OpenRouter key (`OPENROUTER_API_KEY`, setup step 4) and is billed to it.
  Generated tracks carry Google's SynthID watermark.
- **Sound effects** are Kenney's CC0 packs and two made with ffmpeg (`template/public/audio/LICENSES.md`).
- **Characters** are Open Peeps by Pablo Stanley (CC0), through `react-peeps` (MIT).

## Safety

Claude never types your passwords: you sign in to a site yourself. Keys come only from your shell or a git-ignored `.env`, and are never printed. Any data
on screen is invented. New packages, downloads and paid services need your yes. Publishing a video is always your
action.
