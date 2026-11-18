// The motion design kit: a phone, kinetic headlines, typing, and timing helpers. Every movement comes from the
// current frame (springs and interpolation), so each render is identical.
// Colours and the font come from src/brand.ts. For text in a script the brand font lacks (Devanagari,
// Gurmukhi), load a Google Noto or Anek font and add it after BRAND.font.
import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BRAND as PACK } from '../brand';

export const FONT = PACK.font;

/** The brand's colours, flat, as every scene reads them. */
export const BRAND = PACK.colors;

/** A spring from 0 to 1 that starts at `delay` frames. */
export function useEnter(delay = 0, damping = 18, stiffness = 120) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness, mass: 0.9 } });
}

/** 0 to 1 between two frames, eased. */
export function useProgress(from: number, to: number) {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - (1 - t) ** 3,
  });
}

/** Soft brand backdrop with slow-moving light, for every scene. */
export function Backdrop({ dark = false }: { dark?: boolean }) {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 60;
  return (
    <AbsoluteFill
      style={{
        background: dark
          ? `radial-gradient(1200px 900px at ${30 + drift / 20}% 20%, ${BRAND.primary} 0%, ${BRAND.deep} 45%, ${BRAND.night} 100%)`
          : `radial-gradient(900px 700px at ${70 + drift / 30}% 0%, ${BRAND.tint} 0%, ${BRAND.paper} 55%, #ffffff 100%)`,
      }}
    />
  );
}

/** A headline that rises in word by word. */
export function Headline({
  text,
  delay = 0,
  size = 84,
  color = BRAND.ink,
  align = 'center',
  style,
  accent,
  accentColor = BRAND.primary,
  stagger = 4,
}: {
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  align?: 'center' | 'left';
  style?: CSSProperties;
  /** Words drawn in `accentColor`, matched without punctuation or case. */
  accent?: string[];
  accentColor?: string;
  /** Frames between words; 1 for short shots, so the line is readable before the cut. */
  stagger?: number;
}) {
  const frame = useCurrentFrame();
  const bare = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  const accented = new Set((accent ?? []).map(bare));
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: '-0.02em',
        color,
        textAlign: align,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        columnGap: size * 0.26,
        ...style,
      }}
    >
      {text.split(' ').map((word, index) => {
        const enter = spring({ frame: frame - delay - index * stagger, fps, config: { damping: 16, stiffness: 140 } });
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: words never reorder
          <span key={index} style={{ display: 'inline-block', opacity: enter, transform: `translateY(${(1 - enter) * 40}px)`, color: accented.has(bare(word)) ? accentColor : undefined }}>
            {word}
          </span>
        );
      })}
    </div>
  );
}

/** A line of supporting text that fades up. */
export function Subline({ text, delay = 0, color = BRAND.soft, size = 40 }: { text: string; delay?: number; color?: string; size?: number }) {
  const enter = useEnter(delay, 20, 110);
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: size,
        color,
        textAlign: 'center',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 20}px)`,
      }}
    >
      {text}
    </div>
  );
}

/** Text typed one character at a time between two frames. */
export function typed(text: string, frame: number, from: number, perChar = 1.4) {
  const count = Math.floor(Math.max(0, frame - from) / perChar);
  return text.slice(0, count);
}

/**
 * A phone, 390 by 844 points inside, drawn at `scale`, with a gentle tilt that settles. Its screen is a plain
 * white page for the app's components.
 */
export function Phone({
  children,
  scale = 2,
  delay = 0,
  tilt = 8,
}: {
  children: ReactNode;
  scale?: number;
  delay?: number;
  tilt?: number;
}) {
  const enter = useEnter(delay, 22, 90);
  const frame = useCurrentFrame();
  const float = Math.sin(frame / 40) * 4;
  return (
    <div style={{ perspective: 2400 }}>
      <div
        style={{
          width: 390 + 28,
          height: 844 + 28,
          padding: 14,
          borderRadius: 64,
          background: 'linear-gradient(145deg, #1e293b, #0b1220)',
          boxShadow: '0 60px 120px -30px rgba(5, 40, 110, 0.45), 0 20px 40px -20px rgba(0,0,0,0.35)',
          transform: `scale(${scale * (0.92 + 0.08 * enter)}) rotateX(${(1 - enter) * tilt}deg) rotateY(${
            (1 - enter) * -tilt
          }deg) translateY(${(1 - enter) * 120 + float}px)`,
          opacity: enter,
          transformOrigin: 'center center',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 390,
            height: 844,
            borderRadius: 50,
            overflow: 'hidden',
            background: '#ffffff',
          }}
        >
          {children}
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: '50%',
              width: 120,
              height: 34,
              marginLeft: -60,
              borderRadius: 20,
              background: '#0b1220',
            }}
          />
        </div>
      </div>
    </div>
  );
}
