/**
 * Bakes the hero sketch into the form the OG card needs.
 *
 * On the site the sketch is a white-ground drawing flipped at render time with
 * `filter: invert(1)`. satori (what next/og renders with) ignores CSS filters,
 * so the flip has to happen here instead.
 *
 * Inverting alone leaves the drawing on pure black, which would sit as a
 * visible square on the card's #17191D ground. Screening the inverted drawing
 * over that exact ground fixes it: black stays #17191D, the light strokes come
 * through untouched.
 *
 *   node scripts/make-og-avatar.mjs
 */
import sharp from "sharp";

const SRC = "public/images/avatar.png";
const OUT = "src/assets/og-sketch.png";
const GROUND = { r: 0x17, g: 0x19, b: 0x1d };
const SIZE = 600;

const inverted = await sharp(SRC)
  .resize(SIZE, SIZE, { fit: "inside" })
  .negate({ alpha: false })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: SIZE,
    height: SIZE,
    channels: 3,
    background: GROUND,
  },
})
  .composite([{ input: inverted, blend: "screen" }])
  // Palette-quantised: the card renders it around 440px and it is a
  // low-contrast dark image, so 8-bit costs nothing visible and keeps the
  // build-time data URI small.
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toFile(OUT);

console.log(`wrote ${OUT} (${SIZE}x${SIZE})`);
