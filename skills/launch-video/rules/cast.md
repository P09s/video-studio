# Cast

One art style for every person: Open Peeps (CC0, Pablo Stanley) through `react-peeps` (MIT), drawn by
`src/cast/Person.tsx` in ink lines with white fill. Never mix in another style: a flat-colour anime design was
tried and rejected because it clashed with the line-drawn cast.

## A cast for a new product

- **A hero**: the viewer, with the problem. Pass `blush` to give them the cute face (`src/cast/CuteFace.tsx`):
  big shiny eyes, longer bangs, blush, line-drawn extras. The first film's hero had hair `BunFancy` (a bun with a
  bow) and poses `Paper` (holding a document), `Device` (phone), `CrossedLegs` (sitting) and `RestingWB`
  (standing).
- **Supporting people** by role, dressed so a viewer reads the role at once: the doctor in the white coat
  (`Doc`), the nurse in scrubs (`DocStethoscope`, hair `DocBouffant`). The other way round, a reviewer read the
  nurse as the doctor. For office software: busts `Device`, `ButtonShirt`, `Explaining`, `Coffee`; standing
  `PointingFingerWB`, `BlazerWB`, `ShirtPantsWB`; glasses and beards for variety.
- **A mascot** (optional): the brand's mark in a tile (`Mascot` in `src/scenes/props.tsx`) that hops in,
  squashes, bobs, and is never replaced by a generic sparkle. Not in the final frame.

## Faces

Pass the library's face names. With `blush` they map to cute moods (`MOOD_FOR` in `CuteFace.tsx`): `Calm`
neutral, `Smile`, `Cute` happy (^ ^ eyes, sparkles), `SmileBig` joy, `Concerned` worried (sweat drop),
`ConcernedFear` scared, `Tired` sleepy ("z"s), `EyesClosed` (blink), `Hectic` surprised (pop lines).

## Rules

- Expressions change with the story, on frames (`faceAt`), and everyone blinks (`blink`, a different seed per
  person).
- Avoid faces that read as manic or creepy: the library's `SmileBig` grin and `Awe` stare on people without
  `blush`.
- Ground people: a soft floor shadow under standing or sitting figures; furniture under anyone sitting.
- Night scenes need light on the character (a warm glow behind them), or dark clothes vanish.
- A big forehead reads as odd at close range: the cute face's fringe covers it; check close-ups.

## Choosing a look

Edit `src/cast/CastTest.tsx` (candidates and a row of faces) and render
`npx remotion still src/index.ts CastTest out/cast.png`. Look at the sheet, pick, then check the pick in the
actual shot, not only on the sheet. Pose names are case-sensitive (`WheelChair`).
