// A cuter face for the hero, drawn in the same ink-line style as the Open Peeps head it sits on: round shiny eyes,
// soft brows, small expressive mouths, blush and little line-drawn extras (sparkles, a sweat drop, sleepy "z"s).
// Coordinates are the library's head units (measured on a grid: eyes set low and large for a cute look, at about 476,350 and 594,346; the head is in
// three-quarter view, so the far eye is drawn narrower).
import type { FaceType } from 'react-peeps';
import { useCurrentFrame } from 'remotion';

export type CuteMood = 'neutral' | 'smile' | 'happy' | 'joy' | 'worried' | 'scared' | 'sleepy' | 'closed' | 'surprised';

/** The library's face names, as the cute moods that replace them. */
export const MOOD_FOR: Partial<Record<FaceType, CuteMood>> = {
  Calm: 'neutral',
  Smile: 'smile',
  Cute: 'happy',
  SmileBig: 'joy',
  Concerned: 'worried',
  ConcernedFear: 'scared',
  Tired: 'sleepy',
  EyesClosed: 'closed',
  Hectic: 'surprised',
  Awe: 'surprised',
};

const INK = '#0f172a';
const L = { x: 476, y: 350, w: 1 };
const R = { x: 594, y: 346, w: 0.82 };
const line = { fill: 'none', stroke: INK, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

function Eye({ x, y, w, mood, side }: { x: number; y: number; w: number; mood: CuteMood; side: -1 | 1 }) {
  const rx = 23 * w;
  if (mood === 'happy' || mood === 'joy') return <path d={`M ${x - 23 * w} ${y + 7} Q ${x} ${y - 19} ${x + 23 * w} ${y + 7}`} {...line} strokeWidth={8} />;
  if (mood === 'closed') return <path d={`M ${x - 22 * w} ${y} Q ${x} ${y + 13} ${x + 22 * w} ${y}`} {...line} strokeWidth={8} />;
  if (mood === 'sleepy')
    return (
      <g>
        <path d={`M ${x - 16 * w} ${y + 2} Q ${x} ${y + 18} ${x + 16 * w} ${y + 2} Z`} fill={INK} />
        <path d={`M ${x - 20 * w} ${y + 2} H ${x + 20 * w}`} {...line} strokeWidth={7} />
      </g>
    );
  if (mood === 'surprised')
    return (
      <g>
        <circle cx={x} cy={y} r={12 * w} fill={INK} />
        <circle cx={x - 3 * w} cy={y - 4} r={3.2} fill="#fff" />
      </g>
    );
  // Open eyes: a tall shiny oval with two highlights and a lash flick at the outer corner.
  const ry = mood === 'scared' ? 32 : 30;
  const outer = side === -1 ? x - rx : x + rx;
  return (
    <g>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={INK} />
      <circle cx={x - 7 * w} cy={y - 11} r={8.5} fill="#fff" />
      <circle cx={x + 7 * w} cy={y + 11} r={3.4} fill="#fff" />
      <path d={`M ${outer} ${y - ry * 0.55} l ${side * 9} -9`} {...line} strokeWidth={6} />
      {mood === 'scared' && <path d={`M ${x - 4} ${y + ry + 4} q -4 10 0 14 q 4 -4 0 -14`} fill="#bfe6ff" stroke={INK} strokeWidth={3} />}
    </g>
  );
}

function Brows({ mood }: { mood: CuteMood }) {
  // Inner ends lift when worried or scared; both rise when surprised; they relax down when sleepy.
  const up = mood === 'surprised' ? -12 : mood === 'sleepy' ? 4 : mood === 'happy' || mood === 'joy' ? -5 : 0;
  const inner = mood === 'worried' || mood === 'scared' ? -12 : 0;
  return (
    <g {...line} strokeWidth={6}>
      <path d={`M 452 ${300 + up} Q 472 ${290 + up} ${496} ${294 + up + inner}`} />
      <path d={`M 578 ${292 + up + inner} Q 596 ${286 + up} 614 ${294 + up}`} />
    </g>
  );
}

function Mouth({ mood }: { mood: CuteMood }) {
  switch (mood) {
    case 'joy':
      return (
        <g>
          <path d="M 526 416 Q 542 448 560 416 Z" fill={INK} strokeLinejoin="round" stroke={INK} strokeWidth={5} />
          <ellipse cx={543} cy={433} rx={8} ry={5} fill="#ff7b93" />
        </g>
      );
    case 'happy':
    case 'smile':
      return <path d="M 528 418 Q 535 428 542 420 Q 549 428 556 418" {...line} strokeWidth={7} />;
    case 'worried':
    case 'scared':
      return <path d="M 529 424 Q 535 416 542 422 Q 549 430 555 420" {...line} strokeWidth={6} />;
    case 'surprised':
      return <ellipse cx={542} cy={424} rx={6} ry={8} fill={INK} />;
    case 'sleepy':
      return <ellipse cx={542} cy={422} rx={4.5} ry={3.5} fill={INK} />;
    case 'closed':
    default:
      return <path d="M 532 418 Q 542 426 552 418" {...line} strokeWidth={7} />;
  }
}

/** Little extras around her head, line-drawn to match. */
function Extras({ mood }: { mood: CuteMood }) {
  const t = useCurrentFrame();
  if (mood === 'joy' || mood === 'happy') {
    const star = (x: number, y: number, s: number, phase: number) => {
      const k = s * (0.75 + 0.25 * Math.sin((t + phase) / 5));
      return (
        <path
          key={phase}
          d={`M ${x} ${y - k} Q ${x} ${y} ${x + k} ${y} Q ${x} ${y} ${x} ${y + k} Q ${x} ${y} ${x - k} ${y} Q ${x} ${y} ${x} ${y - k} Z`}
          fill="#ffd166"
          stroke={INK}
          strokeWidth={4}
          strokeLinejoin="round"
        />
      );
    };
    return <g>{[star(690, 250, 30, 0), star(724, 330, 18, 11), star(700, 170, 16, 6)]}</g>;
  }
  if (mood === 'worried' || mood === 'scared') {
    const y = 236 + Math.min(16, (t % 45) * 0.5);
    return <path d={`M 660 ${y} Q 678 ${y + 30} 660 ${y + 42} Q 642 ${y + 30} 660 ${y} Z`} fill="#bfe6ff" stroke={INK} strokeWidth={4} strokeLinejoin="round" />;
  }
  if (mood === 'sleepy') {
    return (
      <g fill={INK} fontFamily="sans-serif" fontWeight={800}>
        {[0, 1, 2].map((i) => {
          const p = (t / 36 + i / 3) % 1;
          return (
            <text key={i} x={660 + p * 50} y={260 - p * 100} fontSize={30 + i * 6} opacity={1 - p}>
              z
            </text>
          );
        })}
      </g>
    );
  }
  if (mood === 'surprised') {
    return (
      <g {...line} strokeWidth={6}>
        <path d="M 676 236 l 22 -18" />
        <path d="M 690 280 l 30 -4" />
        <path d="M 676 324 l 22 14" />
      </g>
    );
  }
  return null;
}

/** Longer bangs: pointed strands that bring her fringe down over the forehead, in the same solid ink. */
function Fringe() {
  return (
    <path
      d="M 452 172 L 636 170 C 642 196 642 220 636 244 C 628 232 620 226 612 224 C 608 240 602 252 594 260 C 588 244 578 234 566 230 C 560 248 552 262 542 268 C 536 250 526 240 514 236 C 506 252 496 262 486 266 C 482 250 474 242 464 238 C 462 248 460 256 456 262 Z"
      fill={INK}
      stroke={INK}
      strokeWidth={5}
      strokeLinejoin="round"
    />
  );
}

export function CuteFace({ mood, extras = true }: { mood: CuteMood; extras?: boolean }) {
  return (
    <g>
      <Fringe />
      <g transform="translate(0 -8)">
      <g fill="#ff8fab" opacity={0.55}>
        <ellipse cx={456} cy={396} rx={25} ry={13} />
        <ellipse cx={616} cy={392} rx={17} ry={11} />
      </g>
      <g stroke="#ff6f91" strokeWidth={3} strokeLinecap="round" opacity={0.75}>
        <path d="M 446 402 l 7 -11" />
        <path d="M 458 402 l 7 -11" />
        <path d="M 610 398 l 6 -10" />
      </g>
      <Brows mood={mood} />
      <Eye {...L} mood={mood} side={-1} />
      <Eye {...R} mood={mood} side={1} />
      <path d="M 546 384 q 7 6 0 10" {...line} strokeWidth={5} />
      <Mouth mood={mood} />
      {extras && <Extras mood={mood} />}
      </g>
    </g>
  );
}
