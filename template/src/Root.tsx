// Every video is a composition here, one per format. Register each new film in its formats:
// 1080 x 1920 for 9:16 (Reels, Shorts, TikTok), 1920 x 1080 for 16:9, 1080 x 1080 for 1:1, 1080 x 1350 for 4:5.
import { Composition } from 'remotion';
import { CastTest } from './cast/CastTest';
import { CUTS, Example } from './videos/Example';

export function Root() {
  return (
    <>
      <Composition id="Example" component={Example} durationInFrames={CUTS.done} fps={30} width={1080} height={1920} defaultProps={{ music: null }} />
      <Composition id="CastTest" component={CastTest} durationInFrames={1} fps={30} width={1920} height={1080} />
    </>
  );
}
