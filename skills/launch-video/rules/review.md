# Review

Two passes before the user sees anything: the automatic checks, then an independent reviewer. Fix, re-render,
repeat, at most three rounds; then report what is left.

## 1. Automatic checks

```bash
node scripts/review.mjs out/<name>-master.mp4 --max <seconds>
```

| Check | Fails when |
|---|---|
| length | longer than `--max` |
| pacing | a shot before the ending is over 6 s (warns over 5 s). Cut detection is calibrated for our push transitions (threshold 1.4) |
| dead air | the picture does not change for over 1 s, except in the last 3 s |
| black frames | any black frame away from the start and end |
| loudness | not -14 +-1 LUFS, or true peak above -1 dBFS |

It writes `out/review/<name>/report.md`, `report.json` and `sheet.png` (one frame a second, safe area in red).

## 2. Independent reviewer

Start an Agent (general-purpose) with only: the brief from the interview, the on-screen words and storyboard, the
path to `sheet.png`, and `report.md`. Do not give it your code or reasoning. Prompt it to check each item below and
answer each with pass, or a finding with the second it happens and what is wrong:

| ID | Check |
|---|---|
| E01 | Hook: in the first 3 s, is it clear what problem this is about, with a person in it? |
| E02 | Story logic: does every result have its cause on screen first (time picked before "booked")? |
| E03 | Continuity: same people, names, times and numbers across shots? |
| E04 | Claims: anything that sounds like a diagnosis, a guarantee, or a feature the brief did not mention? |
| E05 | Words: every word inside the red safe area, readable, at most three lines, no typo? |
| E06 | Overlap: any bubble, caption or prop over a face, hair or the UI it explains? Anything cut by the edge? |
| E07 | UI legibility: can a viewer tell what the screen is doing (zoom or highlight where needed)? |
| E08 | Pacing: any stretch that feels static or repetitive (same layout three shots in a row)? |
| E09 | Characters: expressions fit the moment; nothing creepy or manic; one art style throughout? |
| E10 | Call to action: one, specific, readable, held 2+ s, nothing else competing in the last frame? |
| E11 | 9:16 only: anything important in the bottom 400 px or under the right-hand buttons? |
| E12 | Brand: the product's logo correct, the mascot's mark not replaced, colours and font on brand? |

## 3. Report to the user

The automatic table, the reviewer's findings with what you fixed and what you rejected (and why), and anything
you cannot check (how the sounds actually sound, native-speaker wording). Then ask for approval.
