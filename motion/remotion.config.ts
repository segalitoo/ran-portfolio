/* The board is a dark near-black canvas with a soft green halo on it,
   which is the worst case for banding. PNG frames keep the source
   pristine up to the encoder, and the quality settings live in the
   render scripts rather than here so the two codecs can differ. */
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('png');
Config.setOverwriteOutput(true);
