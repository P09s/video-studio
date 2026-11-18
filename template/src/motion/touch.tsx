// What a viewer needs to follow a phone demo: a fingertip that moves to each button and presses it, a ripple and
// a burst where it lands, a ring around the row that matters, and the app's own booking tick, all driven by the
// frame. Each overlay sits inside the phone's screen and finds its target in the real components by a finder, so
// it lands on the button wherever the layout puts it.
import { useLayoutEffect, useRef } from 'react';
import { continueRender, delayRender, interpolate, useCurrentFrame } from 'remotion';
import { BRAND } from './kit';

/** Finds an element in the phone's screen. */
export type Finder = (screen: HTMLElement) => Element | null;

/** Text with every kind of space (Intl puts a narrow no-break space before AM) as a plain one. */
const plain = (text: string | null | undefined) => (text ?? '').replace(/\s+/g, ' ').trim();

/** The nth element (from 0) matching `selector` whose text is `text`. */
export const byText =
  (selector: string, text: string, nth = 0): Finder =>
  (screen) =>
    Array.from(screen.querySelectorAll(selector)).filter((el) => plain(el.textContent) === text)[nth] ?? null;

/** The nth innermost element (from 0) matching `selector` whose text contains `text`. */
export const containing =
  (selector: string, text: string, nth = 0): Finder =>
  (screen) => {
    const has = (el: Element) => !!el.textContent?.includes(text);
    return (
      Array.from(screen.querySelectorAll(selector)).filter(
        (el) => has(el) && !Array.from(el.querySelectorAll(selector)).some(has)
      )[nth] ?? null
    );
  };

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** The target's box in the screen's own points (390 wide on the phone), whatever the scale or the camera's zoom. */
function measure(overlay: HTMLElement, find: Finder): Box | null {
  const screen = overlay.parentElement;
  if (!screen) return null;
  const el = find(screen);
  if (!el) return null;
  const s = screen.getBoundingClientRect();
  const k = s.width / (screen.offsetWidth || 390);
  const b = el.getBoundingClientRect();
  return { x: (b.left - s.left) / k, y: (b.top - s.top) / k, width: b.width / k, height: b.height / k };
}

/**
 * Runs `place` now and again once the app has settled: a control another overlay clicked (Presses) re-renders
 * over a few animation frames, and the frame is captured only after the last run.
 */
function afterSettle(place: () => void) {
  place();
  const handle = delayRender('Placing an overlay on the settled app');
  let left = 8;
  const again = () => {
    place();
    left -= 1;
    if (left > 0) requestAnimationFrame(again);
    else continueRender(handle);
  };
  requestAnimationFrame(again);
}

const ease = (t: number) => 1 - (1 - t) ** 3;
const PHONE_OFF = { x: 330, y: 900 };

export interface Tap {
  /** The frame the finger presses. */
  at: number;
  target: Finder;
  /** A burst of dots where it lands, for a confirm. */
  burst?: boolean;
}

/**
 * A fingertip, as in a screen recording with touches shown. It comes in 22 frames before the first tap, glides
 * between taps, presses with a ripple, and leaves 14 frames after the last.
 */
export function Touch({ taps, cursor = false }: { taps: Tap[]; /** A desktop mouse pointer instead of a fingertip. */ cursor?: boolean }) {
  const frame = useCurrentFrame();
  const root = useRef<HTMLDivElement>(null);
  const finger = useRef<HTMLDivElement>(null);
  const ripple = useRef<HTMLDivElement>(null);
  const burst = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const run = () => {
    const overlay = root.current;
    if (!overlay || !finger.current || !ripple.current || !burst.current) return;
    const screenEl = overlay.parentElement;
    const OFF = cursor && screenEl ? { x: screenEl.offsetWidth * 0.78, y: screenEl.offsetHeight + 60 } : PHONE_OFF;
    const points = taps.map((tap) => {
      const box = measure(overlay, tap.target);
      return box ? { x: box.x + box.width / 2, y: box.y + box.height / 2 } : null;
    });
    const first = taps[0].at;
    const last = taps[taps.length - 1].at;
    let pos = OFF;
    let opacity = 0;
    let press = 1;
    if (frame >= first - 22 && frame <= last + 34) {
      opacity = 1;
      // Where the finger is: entering, gliding to the next tap, resting on one, or leaving.
      const next = taps.findIndex((tap) => frame <= tap.at);
      if (next === -1) {
        const from = points[points.length - 1] ?? OFF;
        const t = ease(Math.min(1, Math.max(0, (frame - last - 14) / 20)));
        pos = { x: from.x + (OFF.x - from.x) * t, y: from.y + (OFF.y - from.y) * t };
        opacity = 1 - t;
      } else {
        const to = points[next];
        const from = next === 0 ? OFF : (points[next - 1] ?? OFF);
        const start = next === 0 ? first - 22 : taps[next - 1].at + 8;
        const end = taps[next].at - 6;
        const t = ease(Math.min(1, Math.max(0, (frame - start) / Math.max(1, end - start))));
        if (!to) opacity = 0;
        else pos = { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
        if (next === 0) opacity = Math.min(1, (frame - start) / 8);
      }
      const pressing = taps.find((tap) => frame >= tap.at - 2 && frame <= tap.at + 10);
      if (pressing) press = interpolate(frame - pressing.at, [-2, 2, 10], [1, 0.78, 1], { extrapolateRight: 'clamp' });
    }
    finger.current.style.opacity = String(opacity);
    finger.current.style.transform = cursor
      ? `translate(${pos.x - 3}px, ${pos.y - 2}px) scale(${0.9 + 0.1 * press})`
      : `translate(${pos.x - 23}px, ${pos.y - 23}px) scale(${press})`;
    if (cursor) finger.current.style.opacity = String(Math.min(1, opacity * 3));

    // The ripple and burst of the latest tap.
    const index = taps.reduce((found, tap, i) => (frame >= tap.at ? i : found), -1);
    const tap = taps[index];
    const point = points[index];
    const since = tap ? frame - tap.at : 99;
    if (tap && point && since <= 22) {
      const t = since / 22;
      ripple.current.style.opacity = String(0.55 * (1 - t));
      ripple.current.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%) scale(${0.4 + 1.6 * ease(t)})`;
    } else ripple.current.style.opacity = '0';
    if (tap?.burst && point && since >= 4 && since <= 30) {
      const t = (since - 4) / 26;
      burst.current.style.opacity = String(1 - t ** 2);
      burst.current.style.transform = `translate(${point.x}px, ${point.y}px)`;
      for (const [i, dot] of Array.from(burst.current.children).entries()) {
        const angle = (i / burst.current.children.length) * Math.PI * 2;
        const r = 18 + 46 * ease(t);
        (dot as HTMLElement).style.transform = `translate(${Math.cos(angle) * r - 4}px, ${Math.sin(angle) * r - 4}px) scale(${1 - t * 0.6})`;
      }
    } else burst.current.style.opacity = '0';
    };
    afterSettle(run);
  });

  return (
    <div ref={root} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 40 }}>
      <div
        ref={ripple}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 56,
          height: 56,
          borderRadius: 999,
          border: '3px solid rgba(7,141,255,0.9)',
          opacity: 0,
        }}
      />
      <div ref={burst} style={{ position: 'absolute', left: 0, top: 0, opacity: 0 }}>
        {Array.from({ length: 10 }, (_, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed dots
            key={i}
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              borderRadius: 999,
              background: i % 2 ? BRAND.success : BRAND.primary,
            }}
          />
        ))}
      </div>
      {cursor ? (
        <div ref={finger} style={{ position: 'absolute', left: 0, top: 0, opacity: 0, transformOrigin: '3px 2px' }}>
          <svg width="30" height="40" viewBox="0 0 30 40" aria-hidden="true" style={{ filter: 'drop-shadow(0 4px 6px rgba(15,23,42,0.35))' }}>
            <path d="M3 2 L3 32 L10.5 25 L16 37 L21 34.8 L15.6 23.2 L26 23.2 Z" fill="#0f172a" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>
      ) : (
        <div
          ref={finger}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 46,
            height: 46,
            borderRadius: 999,
            background: 'rgba(30,41,59,0.28)',
            border: '2.5px solid rgba(255,255,255,0.95)',
            boxShadow: '0 6px 18px rgba(15,23,42,0.28)',
            opacity: 0,
          }}
        />
      )}
    </div>
  );
}

/** A ring that draws around a row and pulses, from `from` to `to`. */
export function Highlight({
  target,
  from,
  to,
  color = BRAND.accent,
  inside = false,
}: {
  target: Finder;
  from: number;
  to: number;
  color?: string;
  /** Draw inside the box with a tint, for a full-width row whose edges are the screen's. */
  inside?: boolean;
}) {
  const frame = useCurrentFrame();
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    afterSettle(() => {
    if (!root.current || !ring.current) return;
    const box = frame >= from && frame <= to ? measure(root.current, target) : null;
    if (!box) {
      ring.current.style.opacity = '0';
      return;
    }
    const enter = ease(Math.min(1, (frame - from) / 10));
    const leave = Math.min(1, (to - frame) / 8);
    const pulse = 1 + 0.03 * Math.sin((frame - from) / 4);
    ring.current.style.opacity = String(enter * leave);
    const pad = inside ? -3 : 6;
    ring.current.style.left = `${box.x - pad}px`;
    ring.current.style.top = `${box.y - (inside ? -2 : 4)}px`;
    ring.current.style.width = `${box.width + pad * 2}px`;
    ring.current.style.height = `${box.height + (inside ? -4 : 8)}px`;
    ring.current.style.background = inside ? `${color}14` : 'transparent';
    ring.current.style.transform = `scale(${(0.9 + 0.1 * enter) * pulse})`;
    });
  });
  return (
    <div ref={root} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 30 }}>
      <div
        ref={ring}
        style={{
          position: 'absolute',
          borderRadius: 12,
          border: `3px solid ${color}`,
          boxShadow: `0 0 0 6px ${color}33`,
          opacity: 0,
        }}
      />
    </div>
  );
}

/**
 * A booking or saving moment: the screen fades, a circle draws, a tick appears. Here it follows the
 * frame instead of CSS timers. Shows from `at` for 72 frames.
 */
export function BookedTick({ at, title, details }: { at: number; title: string; details: string[] }) {
  const frame = useCurrentFrame() - at;
  if (frame < 0 || frame > 72) return null;
  const fade = Math.min(1, frame / 6, (72 - frame) / 8);
  const circle = ease(Math.min(1, Math.max(0, frame / 15)));
  const tick = ease(Math.min(1, Math.max(0, (frame - 12) / 8)));
  const text = ease(Math.min(1, Math.max(0, (frame - 16) / 10)));
  return (
    <div
      className="absolute inset-0 grid place-items-center bg-background/90 px-6 backdrop-blur-sm"
      style={{ opacity: fade, zIndex: 35 }}
    >
      <div className="space-y-3 text-center">
        <svg viewBox="0 0 64 64" className="mx-auto h-24 w-24" aria-hidden="true" style={{ transform: `scale(${0.8 + 0.2 * circle})` }}>
          <circle
            cx="32"
            cy="32"
            r="27"
            fill="none"
            pathLength={1}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="1"
            strokeDashoffset={1 - circle}
            transform="rotate(-90 32 32)"
            className="stroke-success"
          />
          <path
            d="M20 33 l9 9 l16 -19"
            fill="none"
            pathLength={1}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1"
            strokeDashoffset={1 - tick}
            className="stroke-success"
          />
        </svg>
        <div style={{ opacity: text, transform: `translateY(${(1 - text) * 10}px)` }}>
          <span className="block text-lg font-semibold text-foreground">{title}</span>
          {details.map((detail) => (
            <span key={detail} className="block text-xs text-muted-foreground">
              {detail}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export interface Press {
  /** From this frame the control is on, until `to` (if given). */
  from: number;
  to?: number;
  /** The control to click. */
  target: Finder;
  /** Whether it is on now. */
  isOn: (el: Element) => boolean;
  /** What to click to turn it off, when clicking it again does not (a tab). */
  off?: Finder;
}

/**
 * Drives the app's own controls so a component shows the state it would after a tap: a doctor's times open, a
 * day picked. Every frame it compares each control with where the frame says it should be and clicks only the
 * ones that differ, so frames render the same in any order. The frame waits until the app has re-rendered.
 */
export function Presses({ presses }: { presses: Press[] }) {
  const frame = useCurrentFrame();
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const screen = root.current?.parentElement;
    if (!screen) return;
    const handle = delayRender('Clicking the app into this frame\'s state');
    let rounds = 0;
    const sync = () => {
      let clicked = false;
      for (const press of presses) {
        const want = frame >= press.from && (press.to == null || frame < press.to);
        const el = press.target(screen);
        if (!el || press.isOn(el) === want) continue;
        const control = want ? el : press.off ? press.off(screen) : el;
        if (control instanceof HTMLElement) {
          control.click();
          clicked = true;
        }
      }
      rounds += 1;
      if (clicked && rounds < 6) requestAnimationFrame(sync);
      else requestAnimationFrame(() => continueRender(handle));
    };
    sync();
  });
  return <div ref={root} style={{ display: 'none' }} />;
}
