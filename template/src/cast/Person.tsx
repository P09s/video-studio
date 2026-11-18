// A person from Open Peeps (CC0, by Pablo Stanley), drawn through react-peeps (MIT). The body and the head are
// separate groups, so the head can tilt and nod and the face can change from frame to frame.
import type { CSSProperties, ReactNode } from 'react';
import { CuteFace, MOOD_FOR } from './CuteFace';
import type { AccessoryType, FaceType, FacialHairType, HairType } from 'react-peeps';
import Head from 'react-peeps/lib/peeps/head';
import Pose from 'react-peeps/lib/peeps/pose';
import type { BustPoseType } from 'react-peeps/lib/peeps/pose/bust/z_options';
import type { SittingPoseType } from 'react-peeps/lib/peeps/pose/sitting/z_options';
import type { StandingPoseType } from 'react-peeps/lib/peeps/pose/standing/z_options';

export type Look = {
  body: BustPoseType | SittingPoseType | StandingPoseType;
  hair?: HairType;
  facialHair?: FacialHairType;
  accessory?: AccessoryType;
};

export type Kind = 'bust' | 'standing' | 'sitting';

// The area each kind of pose covers, in the library's own units.
const VIEW: Record<Kind, string> = {
  bust: '0 0 850 1200',
  standing: '-80 -40 1300 2700',
  sitting: '-80 -40 1500 2300',
};

/** One person. `tilt` turns the head in degrees, `nod` moves it down in library units. */
export function Person({
  look,
  face,
  kind = 'bust',
  tilt = 0,
  nod = 0,
  ink = '#0f172a',
  fill = '#ffffff',
  style,
  behind,
  blush = false,
}: {
  look: Look;
  face: FaceType;
  kind?: Kind;
  tilt?: number;
  nod?: number;
  ink?: string;
  fill?: string;
  style?: CSSProperties;
  /** Drawn behind the person, in the library's units (a bench, a desk). */
  behind?: ReactNode;
  /** The hero's cute face (round shiny eyes, blush, line-drawn extras) in place of the library's face. */
  blush?: boolean;
}) {
  return (
    <svg viewBox={VIEW[kind]} style={{ overflow: 'visible', ...style }}>
      {behind}
      <Pose piece={look.body} strokeColor={ink} backgroundColor={fill} />
      <g transform={`translate(0 ${nod}) rotate(${tilt} 520 560)`}>
        <Head
          hairPiece={look.hair}
          facePiece={blush ? undefined : face}
          facialHairPiece={look.facialHair}
          accessoryPiece={look.accessory}
          strokeColor={ink}
          backgroundColor={fill}
        />
        {blush && <CuteFace mood={MOOD_FOR[face] ?? 'neutral'} />}
      </g>
    </svg>
  );
}
