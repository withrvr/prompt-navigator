// Generate minimal solid-purple PNG icons with a white compass glyph for
// the extension. Pure Node (zlib + Buffer) so no extra deps. Re-run when
// branding changes; commit the produced PNGs.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '..', 'public', 'icons');
mkdirSync(OUT_DIR, { recursive: true });

// Twitch-ish purple (#9146FF) with a soft cream glyph.
const BG = [0x91, 0x46, 0xff, 0xff];
const FG = [0xff, 0xff, 0xff, 0xff];

function crc32(buf) {
  let c;
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = (table[(crc ^ b) & 0xff] ^ (crc >>> 8)) >>> 0;
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}

/**
 * Build an RGBA PNG. `pixel(x, y)` returns one of `[r,g,b,a]`.
 */
function makePng(size, pixel) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(6, 9); // color type RGBA
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);

  const raw = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    raw[y * (1 + size * 4)] = 0; // filter byte
    for (let x = 0; x < size; x++) {
      const px = pixel(x, y);
      const off = y * (1 + size * 4) + 1 + x * 4;
      raw[off] = px[0];
      raw[off + 1] = px[1];
      raw[off + 2] = px[2];
      raw[off + 3] = px[3];
    }
  }
  const idat = zlib.deflateSync(raw);

  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

/**
 * Glyph: a circle (compass face) with a diamond needle. Resolution-aware so
 * it stays crisp at every size.
 */
function pixelFor(size) {
  const cx = (size - 1) / 2;
  const cy = (size - 1) / 2;
  const rOuter = size * 0.46;
  const rInner = size * 0.36;
  const needleHalf = size * 0.32;
  const needleWidth = Math.max(1, size * 0.08);

  return (x, y) => {
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > rOuter) return BG;

    // Compass ring
    if (dist > rInner) return FG;

    // Needle (vertical diamond): |dx| + |dy| < needleHalf, but narrow.
    const dxAbs = Math.abs(dx);
    const dyAbs = Math.abs(dy);
    if (dxAbs <= needleWidth && dyAbs <= needleHalf - dxAbs) return FG;
    return BG;
  };
}

for (const size of [16, 32, 48, 128]) {
  const png = makePng(size, pixelFor(size));
  writeFileSync(resolve(OUT_DIR, `icon-${size}.png`), png);
  console.log(`  wrote icon-${size}.png (${png.length} bytes)`);
}
