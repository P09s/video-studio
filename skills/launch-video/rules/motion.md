# Motion

All motion comes from the frame (`useCurrentFrame`, `spring`, `interpolate`), so every render is identical. No CSS
animations, no timers, no `Math.random()` at render time.

## Pacing

- A new shot or a clear change (camera move, screen action) every 3-5 seconds. `review.mjs` fails a shot over 6 s
  and warns over 5 s; the final call to action may hold.
- Nothing still for more than 1 second before the ending: start typing, a reply or a tap as the shot opens. An empty
  chat screen for 3 seconds was a real complaint.
- Text must finish appearing and then stay readable (`holdFrames` in `layout.ts`: 0.5 s per word plus 0.5 s)
  before the cut. In 1.5 s shots, reveal the whole line at once instead of word by word.
- Cut on the music's beat (124 BPM: a beat every 14.5 frames at 30 fps) and land the reveal on the drop.

## Kit (in `src/`)

| Piece | Where | Use |
|---|---|---|
| `Shot`, `PUSH` | `scenes/shots.tsx` | Wraps a shot: an 8-frame push in from the right or bottom, then a slow 4.5% push-in |
| `Light`, `Dark`, `Backdrop` | `scenes/shots.tsx`, `motion/kit.tsx` | Backgrounds in the brand's colours, with a slow-moving glow |
| `Caption`, `Stage` | `scenes/shots.tsx` | 16:9: text in columns 1-7, a person in 7-12 |
| `Top`, `Rise` | `scenes/shots.tsx` | 9:16: text in the top band, a person or phone rising from the bottom |
| `blink`, `faceAt` | `scenes/shots.tsx` | Blinks every ~2 s; the face changes on given frames |
| `Headline` (`accent`, `stagger`), `Subline`, `typed` | `motion/kit.tsx` | Word-by-word rise, keyword colour; typing |
| `Phone` | `motion/kit.tsx` | Device frame (390 x 844) with a 3D settle and float |
| `Browser` | `scenes/props.tsx` | Desktop window around a 1440 x 900 page |
| `Wipe` | `scenes/props.tsx` | Before and after in one frame, with a moving divider: the old version wiping into the new |
| `Touch`, `Presses`, `Highlight`, `BookedTick` | `motion/touch.tsx` | Finger or mouse taps on real elements, controls pressed, highlight rings, a success tick |
| `Callout`, `FeatureCard`, `CtaPill`, `Logo` | `scenes/props.tsx` | A detail named in a big pill; feature cards on the beat; the pulsing call to action; the brand's logo |
| `Orb`, `Snap` | `scenes/props.tsx` | A glowing dot carrying an action between apps; a camera flash and a document flying into a chat |
| `Mascot`, `Bubble` | `scenes/props.tsx` | The brand mark's hop-in with squash, ripple and idle bob; speech bubbles |
| `Window`, `Clock`, `QuestionMark`, `RingWaves` | `scenes/props.tsx` | Scene props: late night, time wasted, confusion, a phone ringing |

## Taps and clicks

- Phone: a fingertip with a ripple. Desktop: a mouse pointer with a click. A success burst on the deciding tap.
- Every confirmed action gets a confirmation animation (the booked tick, a saved badge).
- Taps target real DOM elements (`byText`, `containing`), so they land on the real button even if the layout moves.

## Life

Blinks, breathing, a slow camera drift, idle bobs and twinkles keep held frames alive. A shot with no motion at
all looks broken, not calm.
