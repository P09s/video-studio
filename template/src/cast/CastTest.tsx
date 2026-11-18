// A contact sheet of the cast and their expressions, to choose looks before animating.
import { AbsoluteFill } from 'remotion';
import { BRAND, FONT } from '../motion/kit';
import { type Kind, type Look, Person } from './Person';
import type { FaceType } from 'react-peeps';

const CANDIDATES: { name: string; look: Look; face: FaceType; kind: Kind }[] = [
  { name: 'worried', look: { body: 'Paper', hair: 'BunFancy' }, face: 'Concerned', kind: 'bust' },
  { name: 'sleepy', look: { body: 'CrossedLegs', hair: 'BunFancy' }, face: 'Tired', kind: 'sitting' },
  { name: 'surprised', look: { body: 'Device', hair: 'BunFancy' }, face: 'Hectic', kind: 'bust' },
  { name: 'happy', look: { body: 'Device', hair: 'BunFancy' }, face: 'Cute', kind: 'bust' },
  { name: 'joy', look: { body: 'RestingWB', hair: 'BunFancy' }, face: 'SmileBig', kind: 'standing' }
];

const FACES: FaceType[] = ['Calm', 'Smile', 'Cute', 'SmileBig', 'Concerned', 'ConcernedFear', 'Tired', 'EyesClosed', 'Hectic'];

export function CastTest() {
  return (
    <AbsoluteFill style={{ background: BRAND.paper, fontFamily: FONT, padding: 40 }}>
      <div style={{ display: 'flex', gap: 24, height: 560, alignItems: 'flex-end' }}>
        {CANDIDATES.map((c) => (
          <div key={c.name} style={{ flex: 1, textAlign: 'center' }}>
            <Person look={c.look} face={c.face} kind={c.kind} blush style={{ width: '100%', height: 480 }} />
            <div style={{ fontSize: 20, fontWeight: 700, color: BRAND.ink }}>{c.name}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
        {FACES.map((f) => (
          <div key={f} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ background: '#dbeaff', borderRadius: 999, overflow: 'hidden', height: 190 }}>
              <Person blush look={{ body: 'Device', hair: 'BunFancy' }} face={f} style={{ width: '100%', height: 300 }} />
            </div>
            <div style={{ fontSize: 18, color: BRAND.soft }}>{f}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
}
