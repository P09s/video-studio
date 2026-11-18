// The brand pack: the only file a new product edits to restyle every scene. Colours, font, logo, the call to
// action and the product's name. The skill fills it in during the interview, from the user's brand files or
// the product's live site.
//
// Font: any Google Font works. Change the import below to `@remotion/google-fonts/<FontName>` (no spaces:
// `OpenSans`, `PlusJakartaSans`) and keep the weights the scenes use (400, 600, 700, 800).
import { loadFont } from '@remotion/google-fonts/Mulish';

const { fontFamily } = loadFont('normal', { weights: ['400', '600', '700', '800'], subsets: ['latin'] });

export const BRAND = {
  /** The product's name, as it is written (in captions and the end card). */
  name: 'Your Product',
  /** The one call to action on the end card: a domain, "Book a demo", "Update to V3". */
  cta: 'yourproduct.com',
  /** A short line under the call to action, or '' for none. */
  tagline: 'The short promise, in five words',
  /** Logo in public/brand/. An SVG keeps it sharp. `logoOnDark` is shown on dark backgrounds ('' = the same file
   * turned white). */
  logo: 'brand/logo.svg',
  logoOnDark: '',
  font: fontFamily,
  colors: {
    /** Main brand colour: buttons, accents, callouts. */
    primary: '#078dff',
    /** A darker shade of primary: dark backgrounds, pressed states. */
    deep: '#0560d6',
    /** The darkest shade, for the far edge of a dark background. */
    night: '#04306e',
    /** A light tint of primary, for the light background's glow and icon wells. */
    tint: '#dbeaff',
    /** Text on light backgrounds. */
    ink: '#0f172a',
    /** Supporting text. */
    soft: '#64748b',
    /** The light background. */
    paper: '#f5f8ff',
    /** A second accent for a keyword or a highlight ring (often yellow or orange). */
    accent: '#f59e0b',
    /** Success ticks and "done" states. */
    success: '#16a34a',
  },
};

/** `#rrggbb` with an alpha, as rgba(), for glows and shadows in the brand colour. */
export function alpha(hex: string, a: number) {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
