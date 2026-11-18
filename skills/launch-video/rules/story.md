# Story

## Shape

Hook (0-3 s), problem, reveal, proof, one call to action. The first film's outline (36 s, 16:9), as the model;
scale it to the length asked:

| Time | Beat | What carries it |
|---|---|---|
| 0-3 s | Hook: a problem the viewer knows, in their words ("Can't read your own report?") | The hero, in the moment |
| 3-6.5 s | Problem, in 1.5 s cuts (two or three places it hurts) | The hero in each place |
| 6.5-7.3 s | Pattern interrupt (a motion graphic on the brand colour) | Motion graphic |
| 7.3-11 s | Reveal on the music's drop ("<Product> is live") | Logo, mascot or hero |
| 11-31 s | Proof, one shot per job | Real screens, a person beside them |
| 31-36 s | Call to action, held 2+ s | Logo, the domain |

Under 30 s for 9:16: hook 0-3 s, problem to 7 s, reveal on the drop, three proof shots of about 4 s, the call to
action for the last 3-4 s.

**A new version ("V2 to V3"):** the hook is the old way's pain for people who use it today ("Still exporting
lists by hand?"); the reveal is the new version; proof is the two or three changes that matter most, each shown
as a before and after (`Wipe` in `src/scenes/props.tsx`) or as the new screen doing the job; the call to action
is the switch itself ("Switch to V3 today"). Name only real differences, from the release notes or the code.

## Rules

- **People carry the story; the real UI is the proof.** A run of screens with no person in it feels like a
  slideshow; a cartoon with no real screen is not believed. For business software with no characters, let the
  cursor, the callouts and the before-and-after carry the action, and still show a person's problem in words.
- **Cause before result.** Nothing happens by magic: a booking is made only after a time is picked on screen (a
  version where tapping "See times" booked the doctor was rejected). Write each action's cause into the
  storyboard and check it in the stills.
- **Inputs are shown too.** An assistant can explain a document only after we see it shared; a booking for
  tomorrow arrives in tomorrow's list, with the date on screen.
- **One continuous person and record.** The same names, times and numbers across every shot.
- **Background data must be plausible too.** A reviewer caught two patients "In progress" with one doctor. Read
  every row and label of every screen you show.
- **Hand-offs are visible.** When an action crosses apps, show it travel (`Orb`: it leaves one shot by an edge
  and enters the next from the opposite edge).
- **One call to action**, specific (a domain or one action), on screen at least 2 s at the end, nothing else
  competing in the last frame (an extra logo was removed from the first film's end).
- **Do not lead with features or branding.** A feature list belongs in proof, as one quick beat.
- **True claims only.** The product's own words; estimates said as estimates; for health products the assistant
  "explains" and "flags", never diagnoses.

## Words on screen

- One main phrase per screen, 2-6 words per line, at most three lines.
- A supporting line only when needed, smaller, under the main phrase.
- One or two keywords in the accent colour.
- Plain words the viewer uses. Expand any short form the first time.
