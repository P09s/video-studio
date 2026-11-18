// Props, frames and calls to action, from the first launch films, in the brand's colours (src/brand.ts).
import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { BRAND as PACK, alpha } from '../brand';
import { BRAND, FONT, useEnter } from '../motion/kit';
import { SAFE, col } from '../motion/layout';
import { clamp, ease } from './shots';

// --- Brand.

/** The product's logo from src/brand.ts. `onDark` uses the dark-background file when there is one; otherwise it
 * puts the logo on a white plate (turning a coloured logo white would erase any detail inside it). */
export function Logo({ width = 520, delay = 0, onDark = false, style }: { width?: number; delay?: number; onDark?: boolean; style?: CSSProperties }) {
  const enter = useEnter(delay, 14, 120);
  const plate = onDark && !PACK.logoOnDark;
  const img = <Img src={staticFile(onDark && PACK.logoOnDark ? PACK.logoOnDark : PACK.logo)} style={{ width, display: 'block' }} />;
  return (
    <div
      style={{
        alignSelf: 'flex-start',
        opacity: enter,
        transform: `scale(${0.85 + 0.15 * enter})`,
        transformOrigin: 'left center',
        ...(plate ? { padding: `${width * 0.06}px ${width * 0.08}px`, borderRadius: width * 0.08, background: '#ffffff', boxShadow: '0 24px 60px rgba(0,20,80,0.35)' } : {}),
        ...style,
      }}
    >
      {img}
    </div>
  );
}

/** The call to action as a white pill that pulses: `text` defaults to BRAND.cta. Hold it 2 s or more. */
export function CtaPill({ at, text = PACK.cta, size = 52, style }: { at: number; text?: string; size?: number; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 160 } });
  const pulse = frame > at + 20 ? (Math.sin((frame - at) / 8) + 1) / 2 : 0;
  return (
    <div
      style={{
        alignSelf: 'flex-start',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: `${size * 0.42}px ${size * 0.77}px`,
        borderRadius: 999,
        background: '#ffffff',
        color: BRAND.deep,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        whiteSpace: 'nowrap',
        boxShadow: `0 0 0 ${6 + pulse * 10}px rgba(255,255,255,${0.25 - pulse * 0.15}), 0 24px 60px rgba(0,20,80,0.35)`,
        transform: `scale(${pop})`,
        transformOrigin: 'left center',
        ...style,
      }}
    >
      {text}
    </div>
  );
}

/** A large pill in the brand colour that names a detail too small to read on a phone ("Tomorrow · 11:00 AM").
 * Pops in with the action at `at`, leaves at `to`. */
export function Callout({ at, to, x, y, anchor = 'center', children }: { at: number; to: number; x: number; y: number; anchor?: 'center' | 'left'; children: ReactNode }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 180 } });
  const out = interpolate(frame, [to - 6, to], [1, 0], clamp);
  if (frame < at || frame > to) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${anchor === 'center' ? '-50%' : '0'}, -50%) scale(${pop})`,
        transformOrigin: anchor === 'center' ? '50% 50%' : '0% 50%',
        opacity: out,
        padding: '16px 30px',
        borderRadius: 999,
        background: BRAND.primary,
        color: '#ffffff',
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 44,
        whiteSpace: 'nowrap',
        boxShadow: `0 18px 40px -12px ${alpha(BRAND.primary, 0.6)}`,
      }}
    >
      {children}
    </div>
  );
}

/** A feature card that pops in on the beat and bobs: an icon (lucide-react, size 28) and a short label. */
export function FeatureCard({ icon, label, at, x, y, size = 30 }: { icon: ReactNode; label: string; at: number; x: number; y: number; size?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 170 } });
  const bob = Math.sin((frame + at * 3) / 16) * 6;
  if (frame < at) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + bob,
        transform: `translate(-50%, -50%) scale(${pop})`,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '18px 26px',
        borderRadius: 20,
        background: '#ffffff',
        boxShadow: `0 20px 50px -16px ${alpha(BRAND.deep, 0.35)}`,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: size,
        color: BRAND.ink,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ display: 'flex', width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', background: BRAND.tint, color: BRAND.primary }}>
        {icon}
      </span>
      {label}
    </div>
  );
}

// --- Frames for screens.

/** A desktop browser window around a 1440 x 900 page, drawn `width` wide. `title` is the tab or address text. */
export function Browser({ width, delay = 0, title, children }: { width: number; delay?: number; title: string; children: ReactNode }) {
  const enter = useEnter(delay, 22, 90);
  const scale = width / 1440;
  return (
    <div
      style={{
        width,
        borderRadius: 18,
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow: `0 50px 120px -30px ${alpha(BRAND.deep, 0.45)}, 0 18px 40px -20px rgba(0,0,0,0.3)`,
        opacity: enter,
        transform: `translateX(${(1 - enter) * 160}px) scale(${0.94 + 0.06 * enter})`,
      }}
    >
      <div style={{ height: 44, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', background: '#eef2f8' }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <span key={c} style={{ width: 13, height: 13, borderRadius: 999, background: c }} />
        ))}
        <span style={{ marginLeft: 18, padding: '5px 16px', borderRadius: 999, background: '#ffffff', fontFamily: FONT, fontWeight: 600, fontSize: 15, color: BRAND.soft }}>
          {title}
        </span>
      </div>
      <div style={{ width, height: 900 * scale, position: 'relative', overflow: 'hidden' }}>
        <div style={{ width: 1440, height: 900, transform: `scale(${scale})`, transformOrigin: 'top left' }}>{children}</div>
      </div>
    </div>
  );
}

/** Old and new side by side in one frame: `after` wipes in over `before` from `at` to `to`, behind a divider
 * line with "Before" and "Now" labels. Both children fill the same box. */
export function Wipe({ before, after, at, to, labels = ['Before', 'Now'] }: { before: ReactNode; after: ReactNode; at: number; to: number; labels?: [string, string] }) {
  const frame = useCurrentFrame();
  const p = ease(interpolate(frame, [at, to], [0, 1], clamp));
  const tag = (text: string, side: 'left' | 'right', show: number): ReactNode => (
    <div style={{ position: 'absolute', top: 24, [side]: 24, padding: '8px 18px', borderRadius: 999, background: side === 'left' ? 'rgba(15,23,42,0.75)' : BRAND.primary, color: '#ffffff', fontFamily: FONT, fontWeight: 800, fontSize: 26, opacity: show }}>
      {text}
    </div>
  );
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill>{before}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${(1 - p) * 100}%)` }}>{after}</AbsoluteFill>
      {p > 0 && p < 1 && <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${(1 - p) * 100}%`, width: 6, marginLeft: -3, background: '#ffffff', boxShadow: `0 0 30px ${alpha(BRAND.primary, 0.9)}` }} />}
      {tag(labels[0], 'left', 1 - p)}
      {tag(labels[1], 'right', p)}
    </AbsoluteFill>
  );
}

// --- Motion graphics.

/** A glowing dot that carries an action from one place to the next (from one app to another). `path` maps 0-1
 * to a point; leave by one edge and enter the next shot from the opposite edge. */
export function Orb({ from, to, path }: { from: number; to: number; path: (t: number) => { x: number; y: number } }) {
  const frame = useCurrentFrame();
  if (frame < from || frame > to + 2) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {[6, 4, 2, 0].map((lag) => {
        const t = ease(interpolate(frame - lag, [from, to], [0, 1], clamp));
        const p = path(t);
        const size = 38 - lag * 4;
        return (
          <div
            key={lag}
            style={{
              position: 'absolute',
              left: p.x - size / 2,
              top: p.y - size / 2,
              width: size,
              height: size,
              borderRadius: 999,
              background: BRAND.primary,
              boxShadow: `0 0 ${32 - lag * 3}px ${11 - lag}px ${alpha(BRAND.primary, 0.6)}`,
              opacity: 1 - lag / 9,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
}

/** A camera flash and a paper document flying from `from` into `to` (a photo of a report sent into a chat). */
export function Snap({ at, from, to, size = 1 }: { at: number; from: { x: number; y: number }; to: { x: number; y: number }; size?: number }) {
  const frame = useCurrentFrame();
  const t = ease(interpolate(frame, [at + 2, at + 16], [0, 1], clamp));
  const flash = interpolate(frame, [at, at + 2, at + 8], [0, 0.7, 0], clamp);
  const gone = interpolate(frame, [at + 16, at + 22], [1, 0], clamp);
  if (frame < at || frame > at + 24) return null;
  const x = from.x + (to.x - from.x) * t;
  const y = from.y + (to.y - from.y) * t - Math.sin(Math.PI * t) * 160;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: '#ffffff', opacity: flash }} />
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: 150 * size,
          height: 190 * size,
          padding: 14 * size,
          borderRadius: 10 * size,
          background: '#ffffff',
          border: `${3 * size}px solid ${BRAND.ink}`,
          boxShadow: '0 20px 40px rgba(15,23,42,0.25)',
          transform: `translate(-50%, -50%) rotate(${-12 + 12 * t}deg) scale(${1 - 0.55 * t})`,
          opacity: gone,
        }}
      >
        <div style={{ height: 14 * size, width: '60%', borderRadius: 4, background: BRAND.primary, marginBottom: 12 * size }} />
        {[90, 70, 85, 60, 75].map((w) => (
          <div key={w} style={{ height: 8 * size, width: `${w}%`, borderRadius: 4, background: '#cbd5e1', marginBottom: 10 * size }} />
        ))}
      </div>
    </AbsoluteFill>
  );
}

/** Three rings that spread from a point: a phone ringing, a notification, a ping. */
export function RingWaves({ at, x, y }: { at: number; x: number; y: number }) {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 24) return null;
  return (
    <>
      {[0, 6, 12].map((d) => {
        const p = interpolate(t - d, [0, 12], [0, 1], clamp);
        return (
          <div
            key={d}
            style={{
              position: 'absolute',
              left: x - 40 - p * 60,
              top: y - 40 - p * 60,
              width: 80 + p * 120,
              height: 80 + p * 120,
              borderRadius: '50%',
              border: `6px solid ${BRAND.primary}`,
              opacity: (1 - p) * (t - d >= 0 ? 1 : 0),
            }}
          />
        );
      })}
    </>
  );
}

/** A question mark that pops and floats up: confusion. Keep it clear of faces and hair. */
export function QuestionMark({ at, x, y, color = BRAND.accent }: { at: number; x: number; y: number; color?: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - at, fps, config: { damping: 9, stiffness: 160 } });
  const float = Math.max(0, frame - at) * 0.9;
  if (frame < at) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y - float, fontFamily: FONT, fontWeight: 800, fontSize: 96, color, transform: `scale(${pop}) rotate(${(at % 3) * 8 - 8}deg)`, textShadow: `0 6px 30px ${alpha(color, 0.45)}` }}>
      ?
    </div>
  );
}

/** A clock whose hands race: time wasted, waiting. */
export function Clock({ style }: { style?: CSSProperties } = {}) {
  const frame = useCurrentFrame();
  return (
    <svg width={220} height={220} viewBox="-110 -110 220 220" style={{ position: 'absolute', left: col(10), top: SAFE.y + 20, ...style }} aria-hidden="true">
      <circle r={100} fill="#ffffff" stroke={BRAND.ink} strokeWidth={8} />
      {Array.from({ length: 12 }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: fixed marks
        <line key={i} x1={0} y1={-84} x2={0} y2={-72} stroke={BRAND.ink} strokeWidth={6} strokeLinecap="round" transform={`rotate(${i * 30})`} />
      ))}
      <line x1={0} y1={0} x2={0} y2={-46} stroke={BRAND.ink} strokeWidth={10} strokeLinecap="round" transform={`rotate(${frame * 3})`} />
      <line x1={0} y1={0} x2={0} y2={-70} stroke={BRAND.primary} strokeWidth={6} strokeLinecap="round" transform={`rotate(${frame * 36})`} />
      <circle r={9} fill={BRAND.ink} />
    </svg>
  );
}

/** A night window with a crescent moon and twinkling stars: a late-night problem. */
export function Window({ style }: { style?: CSSProperties } = {}) {
  const frame = useCurrentFrame();
  const stars: [number, number, number][] = [[40, 50, 0], [150, 36, 20], [176, 120, 41], [70, 170, 9], [128, 210, 30]];
  return (
    <svg width={240} height={300} viewBox="0 0 240 300" style={{ position: 'absolute', left: col(11) + 70, top: SAFE.y + 10, ...style }} aria-hidden="true">
      <defs>
        <linearGradient id="night-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a7a" />
          <stop offset="100%" stopColor="#0f1f4a" />
        </linearGradient>
        <mask id="crescent">
          <rect width="240" height="300" fill="black" />
          <circle cx="150" cy="96" r="34" fill="white" />
          <circle cx="166" cy="84" r="30" fill="black" />
        </mask>
      </defs>
      <rect x="6" y="6" width="228" height="288" rx="18" fill="url(#night-sky)" stroke="#2b3f73" strokeWidth="12" />
      <circle cx="150" cy="96" r="54" fill="#fef3c7" opacity={0.12} />
      <rect width="240" height="300" fill="#fef3c7" mask="url(#crescent)" />
      {stars.map(([x, y, seed]) => (
        <circle key={seed} cx={x} cy={y} r={3.2} fill="#ffffff" opacity={0.35 + 0.65 * ((Math.sin((frame + seed) / 9) + 1) / 2)} />
      ))}
      <line x1="120" y1="12" x2="120" y2="288" stroke="#2b3f73" strokeWidth="8" />
      <line x1="12" y1="150" x2="228" y2="150" stroke="#2b3f73" strokeWidth="8" />
    </svg>
  );
}

// --- A mascot and speech.

/** A mascot: the brand's mark (an image in public/, or any element) in a tile that hops in at `at`, squashes as
 * it lands, bobs while idle and leans toward whoever it talks to. */
export function Mascot({ at, mark, size = 180, lean = 0, style }: { at: number; mark: ReactNode; size?: number; lean?: number; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - at;
  const rise = spring({ frame: t, fps, config: { damping: 11, stiffness: 140, mass: 0.8 } });
  const y = interpolate(rise, [0, 1], [size * 1.4, 0]);
  const land = interpolate(t, [10, 14, 22], [0, 1, 0], clamp);
  const bob = t > 24 ? Math.sin((t - 24) / 12) * size * 0.03 : 0;
  const tilt = lean * interpolate(t, [18, 32], [0, 1], clamp) + (t > 24 ? Math.sin((t - 24) / 17) * 2 : 0);
  if (t < 0) return null;
  const ring = interpolate(t, [12, 34], [0, 1], clamp);
  return (
    <div style={{ width: size, height: size, ...style }}>
      {ring > 0 && ring < 1 && (
        <div style={{ position: 'absolute', left: size / 2 - size * (0.6 + ring * 0.6), top: size - size * 0.12 - size * (0.15 + ring * 0.15), width: size * (1.2 + ring * 1.2), height: size * (0.3 + ring * 0.3), borderRadius: '50%', border: `${4 * (1 - ring) + 1}px solid rgba(255,255,255,${0.7 * (1 - ring)})` }} />
      )}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.28,
          background: `linear-gradient(145deg, ${BRAND.primary}, ${BRAND.deep})`,
          boxShadow: `0 ${size * 0.12}px ${size * 0.3}px ${alpha(BRAND.deep, 0.35)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          transformOrigin: '50% 100%',
          transform: `translateY(${y + bob}px) scale(${1 + 0.16 * land}, ${1 - 0.16 * land}) rotate(${tilt}deg)`,
          opacity: interpolate(t, [0, 4], [0, 1], clamp),
        }}
      >
        {mark}
      </div>
    </div>
  );
}

/** A speech bubble that pops from its tail. `tail` is the side the speaker is on. Never over a face or hair. */
export function Bubble({ at, children, tail = 'left', width = 440, fontSize = 36, style }: { at: number; children: ReactNode; tail?: 'left' | 'right'; width?: number; fontSize?: number; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 180 } });
  if (frame < at) return null;
  return (
    <div
      style={{
        width,
        padding: '26px 32px',
        borderRadius: 32,
        [tail === 'left' ? 'borderBottomLeftRadius' : 'borderBottomRightRadius']: 8,
        background: '#ffffff',
        color: BRAND.ink,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize,
        lineHeight: 1.3,
        boxShadow: '0 24px 60px rgba(15,23,42,0.18)',
        transformOrigin: tail === 'left' ? '0% 100%' : '100% 100%',
        transform: `scale(${pop})`,
        opacity: Math.min(1, pop * 1.5),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
