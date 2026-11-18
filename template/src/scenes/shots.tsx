// How shots are framed and joined: the push from one shot to the next, the slow camera drift inside a shot, where
// text and people stand in 16:9 and 9:16, and the faces that change and blink. From the first launch films.
import type { CSSProperties, ReactNode } from 'react';
import type { FaceType } from 'react-peeps';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BRAND, Headline } from '../motion/kit';
import { TYPE, VERTICAL, col, span } from '../motion/layout';

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const ease = (t: number) => 1 - (1 - t) ** 3;
/** Ease in and out, for camera moves. */
export const smooth = { ...clamp, easing: (t: number) => (1 - Math.cos(Math.PI * t)) / 2 };

/** Frames each shot slides in over the one before. Start each shot's Sequence PUSH frames before its cut. */
export const PUSH = 8;

/** A shot that slides in over the previous one, then drifts slowly toward the camera while it plays. */
export function Shot({ children, from }: { children: ReactNode; from: 'right' | 'bottom' | 'none' }) {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const p = ease(interpolate(frame, [0, PUSH], [0, 1], clamp));
  const x = from === 'right' ? (1 - p) * width : 0;
  const y = from === 'bottom' ? (1 - p) * height : 0;
  const zoom = 1 + 0.045 * interpolate(frame, [0, durationInFrames], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px)`, boxShadow: from === 'none' ? undefined : '-30px 0 80px rgba(0,0,0,0.35)', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
}

/** A light background with a slow-moving glow in the brand tint. */
export function Light({ children }: { children?: ReactNode }) {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 3;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(1100px 800px at ${72 + drift}% 10%, ${BRAND.tint} 0%, ${BRAND.paper} 55%, #ffffff 100%)` }}>
      {children}
    </AbsoluteFill>
  );
}

/** A dark background in the brand's deep colours, for the reveal, a pattern interrupt or the end card. */
export function Dark({ children }: { children?: ReactNode }) {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 3;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(1200px 900px at ${30 + drift}% 20%, ${BRAND.primary} 0%, ${BRAND.deep} 45%, ${BRAND.night} 100%)` }}>
      {children}
    </AbsoluteFill>
  );
}

// --- 16:9: text in columns 1-7, the picture in 7-12.

/** A left-column headline, vertically centred, one line under the other. */
export function Caption({ lines, delay = PUSH + 2, color = BRAND.ink, size = TYPE.display, accent, accentColor, stagger = 4 }: { lines: string[]; delay?: number; color?: string; size?: number; accent?: string[]; accentColor?: string; stagger?: number }) {
  return (
    <div style={{ position: 'absolute', left: col(1), width: span(1, 7), top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
      {lines.map((line, i) => (
        <Headline key={line} text={line} size={size} color={color} align="left" delay={delay + i * 10} stagger={stagger} accent={accent} accentColor={accentColor} />
      ))}
    </div>
  );
}

/** Where a character stands in 16:9: centred on columns 7-12, feet at the bottom, breathing. */
export function Stage({ children, enter = 0, height = 900 }: { children: ReactNode; enter?: number; height?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame: frame - enter, fps, config: { damping: 16, stiffness: 110 } });
  return (
    <div
      style={{
        position: 'absolute',
        left: col(7),
        width: span(7, 12),
        bottom: 0,
        height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        transform: `translateY(${(1 - rise) * 160}px) scaleY(${1 + 0.008 * Math.sin(frame / 18)})`,
        transformOrigin: '50% 100%',
        opacity: rise,
      }}
    >
      {children}
    </div>
  );
}

// --- 9:16: text in the band at the top, the picture in the middle.

/** Headline lines in the 9:16 text band, with an optional smaller line under them. For a 1.5 s shot use
 * stagger 1 and step 3, so the whole line is readable before the cut. */
export function Top({ lines, sub, accent, accentColor, color = BRAND.ink, size = 88, delay = PUSH + 2, stagger = 4, step = 8 }: { lines: string[]; sub?: string; accent?: string[]; accentColor?: string; color?: string; size?: number; delay?: number; stagger?: number; step?: number }) {
  return (
    <div style={{ position: 'absolute', left: VERTICAL.x, top: VERTICAL.top, width: VERTICAL.width, display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lines.map((line, i) => (
        <Headline key={line} text={line} size={size} color={color} align="left" delay={delay + i * step} stagger={stagger} accent={accent} accentColor={accentColor} />
      ))}
      {sub && (
        <>
          <div style={{ height: 18 }} />
          <Headline text={sub} size={44} color={color === BRAND.ink ? BRAND.soft : 'rgba(255,255,255,0.85)'} align="left" delay={delay + 24} stagger={2} style={{ fontWeight: 600, lineHeight: 1.3 }} />
        </>
      )}
    </div>
  );
}

/** Something rising in from the bottom edge, centred at `x`, breathing: a person in 9:16, or a phone. */
export function Rise({ children, x = 540, width, height, enter = 0, style }: { children: ReactNode; x?: number; width: number; height: number; enter?: number; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame: frame - enter, fps, config: { damping: 16, stiffness: 110 } });
  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        bottom: 0,
        width,
        height,
        transform: `translateY(${(1 - rise) * 200}px) scaleY(${1 + 0.008 * Math.sin(frame / 18)})`,
        transformOrigin: '50% 100%',
        opacity: rise,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// --- Faces.

/** The face at this frame, from a list of [from frame, face]. */
export function faceAt(frame: number, faces: [number, FaceType][]): FaceType {
  let current = faces[0][1];
  for (const [from, face] of faces) if (frame >= from) current = face;
  return current;
}

/** A blink every couple of seconds: three frames of closed eyes. A different `seed` per person. */
export function blink(frame: number, face: FaceType, seed = 0): FaceType {
  const awake: FaceType[] = ['Calm', 'Smile', 'Concerned', 'Tired', 'Cute'];
  return awake.includes(face) && (frame + seed) % 68 < 3 && frame > 6 ? 'EyesClosed' : face;
}
