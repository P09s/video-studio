// The example film, 9:16, 12 s: a hook with a person, the old way wiping into the new, three features on the
// beat, and the end card. It uses the main pieces of the kit, so a new project starts from something that
// renders. Copy it to src/videos/<Name>.tsx and replace the shots; keep the structure (cut constants, Shot,
// Top, sound cues on the frames of what they mark).
import { Gauge, Sparkles, Zap } from 'lucide-react';
import type { ReactNode } from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { BRAND as PACK } from '../brand';
import { Person } from '../cast/Person';
import { BRAND, FONT, Headline } from '../motion/kit';
import { VERTICAL } from '../motion/layout';
import { Cue } from '../motion/sfx';
import { Callout, CtaPill, FeatureCard, Logo, Mascot, QuestionMark, Wipe } from '../scenes/props';
import { Dark, Light, PUSH, Rise, Shot, Top, blink, clamp, faceAt } from '../scenes/shots';

/** Shot starts, in frames (30 fps). With music, put them on its beats (`beat(bpm)` in layout.ts). */
export const CUTS = { hook: 0, swap: 75, features: 165, end: 255, done: 360 };

/** A stand-in screen: a page with a sidebar and rows. Replace with a rebuilt screen from the product. */
function MockScreen({ old }: { old: boolean }) {
  const frame = useCurrentFrame();
  const tone = old ? '#9aa3af' : BRAND.primary;
  return (
    <AbsoluteFill style={{ background: old ? '#eceff3' : '#ffffff', display: 'flex', flexDirection: 'row', fontFamily: FONT }}>
      <div style={{ width: 200, background: old ? '#d9dde3' : BRAND.tint, padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ height: 22, borderRadius: 6, background: i === 0 ? tone : 'rgba(15,23,42,0.12)' }} />
        ))}
      </div>
      <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ fontSize: 40, fontWeight: 800, color: old ? '#6b7280' : BRAND.ink }}>{old ? 'Version 2' : 'Version 3'}</div>
        {[0, 1, 2, 3, 4].map((i) => {
          const grow = old ? 1 : interpolate(frame, [CUTS.swap + 30 + i * 4, CUTS.swap + 46 + i * 4], [0.2, 1], clamp);
          return (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: old ? '#c5cad2' : BRAND.tint }} />
              <div style={{ height: 18, width: `${(60 + ((i * 17) % 30)) * grow}%`, borderRadius: 6, background: old ? '#c5cad2' : tone }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

function Hook() {
  const frame = useCurrentFrame();
  const face = blink(frame, faceAt(frame, [[0, 'Calm'], [24, 'Concerned']]), 3);
  return (
    <Light>
      <Top lines={['Still doing it', 'the old way?']} accent={['old']} accentColor={BRAND.accent} delay={2} stagger={2} step={6} />
      <Rise width={760} height={1060} enter={4}>
        <Person look={{ body: 'Device', hair: 'BunFancy' }} face={face} blush style={{ width: '100%', height: '100%' }} />
      </Rise>
      <QuestionMark at={30} x={760} y={760} />
      <QuestionMark at={42} x={150} y={820} />
    </Light>
  );
}

function Swap() {
  return (
    <Light>
      <Top lines={['Meet the new way']} accent={['new']} />
      <div style={{ position: 'absolute', left: VERTICAL.x, top: 560, width: VERTICAL.width, height: 760, borderRadius: 28, overflow: 'hidden', boxShadow: '0 40px 100px -30px rgba(15,23,42,0.45)' }}>
        <Wipe at={20} to={44} before={<MockScreen old />} after={<MockScreen old={false} />} />
      </div>
      <Callout at={56} to={90} x={540} y={1400}>
        Half the clicks
      </Callout>
    </Light>
  );
}

const FEATURES: [ReactNode, string][] = [
  [<Zap key="z" size={28} />, 'Faster every day'],
  [<Gauge key="g" size={28} />, 'Clear at a glance'],
  [<Sparkles key="s" size={28} />, 'Smarter picks'],
];

function Features() {
  return (
    <Light>
      <Top lines={['Built for', 'your team']} accent={['team']} />
      {FEATURES.map(([icon, label], i) => (
        <FeatureCard key={label} icon={icon} label={label} at={PUSH + 14 + i * 14} x={i === 1 ? 600 : 460} y={720 + i * 200} size={48} />
      ))}
      <Mascot at={60} size={180} lean={-6} mark={<span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96 }}>{PACK.name[0]}</span>} style={{ position: 'absolute', left: 760, top: 1220 }} />
    </Light>
  );
}

function End() {
  return (
    <Dark>
      <div style={{ position: 'absolute', left: VERTICAL.x, top: 560, width: VERTICAL.width, display: 'flex', flexDirection: 'column', gap: 40 }}>
        <Logo width={460} delay={PUSH} onDark />
        <Headline text={PACK.tagline} size={64} color="#ffffff" align="left" delay={PUSH + 10} stagger={2} />
        <CtaPill at={PUSH + 30} size={60} />
      </div>
    </Dark>
  );
}

const SHOTS: [number, number, 'right' | 'bottom' | 'none', () => ReactNode][] = [
  [CUTS.hook, CUTS.swap, 'none', Hook],
  [CUTS.swap, CUTS.features, 'right', Swap],
  [CUTS.features, CUTS.end, 'bottom', Features],
  [CUTS.end, CUTS.done, 'right', End],
];

export function Example({ music = null }: { music?: string | null }) {
  return (
    <AbsoluteFill style={{ background: BRAND.paper }}>
      {SHOTS.map(([from, to, push, Scene], i) => {
        const start = i === 0 ? from : from - PUSH;
        return (
          <Sequence key={from} from={start} durationInFrames={to - start} layout="none">
            <Shot from={push}>
              <Scene />
            </Shot>
          </Sequence>
        );
      })}
      {music && <Audio src={staticFile(`audio/music/${music}`)} volume={(f) => 0.4 * interpolate(f, [CUTS.done - 30, CUTS.done], [1, 0], clamp)} />}
      {/* Each sound on the frame of what it marks; repeats rise in pitch. A shot's own frame 0 is PUSH frames
          before its cut, so a moment at frame n of a shot is at cut - PUSH + n in the film. */}
      <Cue at={30} sound="chip" />
      <Cue at={42} sound="chip" pitch={4} />
      <Cue at={CUTS.swap - PUSH + 20} sound="reveal" />
      <Cue at={CUTS.swap - PUSH + 56} sound="card" />
      {FEATURES.map(([, label], i) => (
        <Cue key={label} at={CUTS.features + 14 + i * 14} sound="chip" pitch={i * 2} />
      ))}
      <Cue at={CUTS.features - PUSH + 60} sound="arrive" />
      <Cue at={CUTS.end} sound="live" />
      <Cue at={CUTS.end + 30} sound="success" />
    </AbsoluteFill>
  );
}
