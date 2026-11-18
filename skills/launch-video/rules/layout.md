# Layout

Source: broadcast title-safe practice (Netflix and SMPTE: titles inside 90% of the frame) and the Reels/Shorts
safe zones. The constants live in `src/motion/layout.ts`: `SAFE`, `col`, `span`, `TYPE` (16:9) and `VERTICAL`
(9:16).

## 16:9 (1920 x 1080)

- Safe area: 96 px left and right, 54 px top and bottom. Text settles inside it; it may enter from outside.
- 12-column grid inside the safe area (`col(n)`, `span(a, b)`). Text owns columns 1-6 (or 1-7 for a long line);
  the picture (character, phone, browser) owns 7-12.
- Type scale (`TYPE`): display 112, title 84, body 44, caption 30. Mulish 800 for headlines.
- Text is left-aligned on the shared left edge `col(1)`, vertically centred, one baseline per line. Never centre
  one line and left-align the next on the same screen.

## 9:16 (1080 x 1920)

- Text band at the top: from 230 px, left 72 px, width 936 px. Headlines 88-112 px.
- Supporting text, bubbles and taglines at least 44 px: smaller is unreadable on a phone.
- The picture fills the middle. Nothing that matters in the bottom 400 px (the apps' caption, name and buttons
  sit there) or in the right-hand button column (x over 900, y 900-1700). Keep faces and reactions left of it.
- Phones at scale 1.1-1.2, centred or slightly left with the character beside them.
- A desktop screen is wider than the frame: show it larger than the frame and pan to the part that matters.
- Phone-sized UI is unreadable at full-phone scale inside a 9:16 frame: push in (1.6-2x) on each key moment (the
  highlighted result, the booked tick, the row that arrives, the button clicked).
- When a key detail is still small (a time, a name in a table), add a callout: a large brand-blue pill with the
  words ("Tomorrow · 11:00 AM", "Anita Rao · 11:00 AM") that pops in with the action (`Callout` in
  `src/scenes/props.tsx`).

## Overlap rules (every one of these was a real bug)

- Nothing cut by the frame edge unless it is a person's body below the chest or a deliberate bleed.
- No speech bubble over a face or hair; no caption over a moving screen. If a screen zooms under a caption, give
  the caption a white panel (`rgba(255,255,255,0.94)`, radius 22).
- Extras (question marks, sparkles) float clear of the head and the hair accessories.
- A browser's title bar must not touch the caption above it.

## Check

`scripts/review.mjs` draws the safe area on every frame of `sheet.png`. Look at the sheet: every word inside the red
box, nothing important under the 9:16 bottom zone.
