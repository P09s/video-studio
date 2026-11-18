// Render settings. JPEG frames at high quality, and a fixed concurrency so a laptop stays usable while it renders.
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setConcurrency(4);
Config.setOverwriteOutput(true);
