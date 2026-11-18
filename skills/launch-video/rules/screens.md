# Screens

The screens are the proof. They must be sharp at every zoom, on brand, and carry only invented data.

## Three ways to get them, best first

1. **The product's real components** (when its code is on the machine and builds): alias the app's source in
   `remotion.config.ts` (`Config.overrideWebpackConfig`, an alias like `@` to the app's `src`), load its styles,
   give its components the providers they expect (query client, i18n, router) and feed them synthetic fixtures
   typed with the app's own types, so a change in the app breaks the video build, not the video. The first films
   did this for a React patient app and a separate clinic app (two builds, one React).
2. **Rebuilt from the live or staging site** (no build needed): the user signs in once
   (`node scripts/capture.mjs login <url>`), you screenshot the screens that prove each claim
   (`node scripts/capture.mjs shots shots.json`, or the user's browser), then rebuild each one as a scene
   component in `src/screens/` with the same layout, colours, words and icons, and invented data. Read the
   product's code or docs, when you have them, for the exact labels and states. Rebuilt screens stay sharp when
   you push in, and every row can animate.
3. **Screen recordings or screenshots as they are**: only for a quick cut, never zoomed past 100%, with every real
   name, email, phone number and amount blurred or replaced. Play a recording with `OffthreadVideo` inside
   `Browser` or `Phone`, `playbackRate` to shorten it.

## Showing them

- Desktop screens go in `Browser` (a 1440 x 900 page); phone screens in `Phone` (390 x 844).
- Every key moment gets a push-in, a highlight or a callout ([layout](layout.md)): the result appearing, the
  button pressed, the row that arrives.
- Actions are taps or clicks on real elements (`Touch` and `Presses` in `src/motion/touch.tsx`, which find an
  element by its text), so the pointer lands on the button even if the layout moves.

## Determinism

- Fixed dates and times; nothing from the wall clock. Intl puts a narrow no-break space before AM/PM: match text
  with `byText` / `containing`, which normalise spaces.
- Every movement comes from the frame. Measure elements after they settle (`afterSettle` in `touch.tsx`).

## Data

Invented only: names, companies, addresses, numbers. Never a real customer, never an unedited staging screenshot
(staging often holds copies of real data).
