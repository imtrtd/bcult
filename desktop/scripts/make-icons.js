#!/usr/bin/env node
/* Generates build/icon.ico (+ build/icon.png preview) for the desktop app.
   Pure Node — no image libraries. Run: npm run icons */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const OUT = path.join(__dirname, '..', 'build');
const SS = 1024;                                   // supersampled master
const SIZES = [16, 24, 32, 48, 64, 128, 256];

/* ------------------------------------------------------------------ paint */

const R = new Float64Array(SS * SS);
const G = new Float64Array(SS * SS);
const B = new Float64Array(SS * SS);
const A = new Float64Array(SS * SS);

function hsl(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360;
  const f = (n) => {
    const k = (n + h * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    return l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
  };
  return [f(0), f(8), f(4)];
}

/** Additive glow splat with a solid core, bounded to its own box. */
function splat(cx, cy, core, glow, [r, g, b], gain = 1) {
  const x0 = Math.max(0, Math.floor(cx - glow)), x1 = Math.min(SS - 1, Math.ceil(cx + glow));
  const y0 = Math.max(0, Math.floor(cy - glow)), y1 = Math.min(SS - 1, Math.ceil(cy + glow));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const d = Math.hypot(x + .5 - cx, y + .5 - cy);
      if (d > glow) continue;
      let v;
      if (d <= core) v = 1;
      else v = Math.pow(1 - (d - core) / (glow - core), 2.6) * .85;
      v *= gain;
      const i = y * SS + x;
      R[i] += r * v; G[i] += g * v; B[i] += b * v;
    }
  }
}

function glowLine(x, yA, yB, core, glow, colorAt) {
  const steps = Math.ceil(Math.abs(yB - yA));
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    splat(x, yA + (yB - yA) * t, core, glow, colorAt(t), .12);
  }
}

const P = (v) => v * SS;                            // normalized -> pixels
const PALETTE = [187, 318, 264, 208, 78, 342, 229, 171];

// Background tile: dark plate with soft corner tints.
for (let y = 0; y < SS; y++) {
  for (let x = 0; x < SS; x++) {
    const i = y * SS + x, u = x / SS, v = y / SS;
    let r = .004, g = .004, b = .024;
    const tint = (tx, ty, rad, cr, cg, cb) => {
      const d = Math.hypot(u - tx, v - ty) / rad;
      if (d < 1) {
        const f = Math.pow(1 - d, 2.2);
        r += cr * f; g += cg * f; b += cb * f;
      }
    };
    tint(.16, .20, .50, .006, .052, .056);          // cyan
    tint(.86, .22, .50, .056, .006, .046);          // magenta
    tint(.50, .52, .66, .022, .006, .060);          // violet core wash
    tint(.80, .84, .42, .018, .032, .004);          // lime
    R[i] = r; G[i] = g; B[i] = b;
  }
}

// Spine.
glowLine(P(.5), P(.10), P(.90), P(.0055), P(.032), (t) => {
  const h = t < .34 ? 187 + (318 - 187) * (t / .34)
    : t < .62 ? 318 + (284 - 318) * ((t - .34) / .28)
      : 284 + (78 - 284) * ((t - .62) / .38);
  return hsl(h, 1, .55);
});

// Spiral of nodes descending the spine.
const N = 96;
for (let k = 0; k < N; k++) {
  const t = k / (N - 1);
  const th = t * Math.PI * 4.1 - Math.PI / 2;
  const depth = (Math.cos(th) + 1) / 2;
  const x = P(.5 + Math.sin(th) * .315);
  const y = P(.13 + t * .74);
  const col = hsl(PALETTE[k % PALETTE.length], 1, .48 + depth * .16);
  const rad = P(.005 + depth * .015);
  splat(x, y, rad * .5, rad * 2.5, col, .42 + depth * .55);
  // connector back to the spine
  const steps = 16;
  for (let s = 1; s < steps; s++) {
    const cx = x + (P(.5) - x) * (s / steps);
    splat(cx, y, P(.0014), P(.009), col, (.07 + depth * .11) * (1 - s / steps));
  }
}

// Core.
splat(P(.5), P(.5), P(.008), P(.115), hsl(284, 1, .56), .95);
splat(P(.5), P(.5), P(.012), P(.034), [1, 1, 1], .85);
for (let a = 0; a < 720; a++) {
  const th = a / 720 * Math.PI * 2;
  splat(P(.5) + Math.cos(th) * P(.072), P(.5) + Math.sin(th) * P(.072), P(.0035), P(.011), hsl(187, 1, .66), .22);
}

// Rounded-tile alpha mask so it sits on the desktop as an app tile, not a black square.
const RAD = SS * .20, INSET = SS * .015;
for (let y = 0; y < SS; y++) {
  for (let x = 0; x < SS; x++) {
    const i = y * SS + x;
    const dx = Math.max(INSET + RAD - (x + .5), (x + .5) - (SS - INSET - RAD), 0);
    const dy = Math.max(INSET + RAD - (y + .5), (y + .5) - (SS - INSET - RAD), 0);
    const d = Math.hypot(dx, dy);
    A[i] = Math.max(0, Math.min(1, (RAD - d) / (SS * .004) + .5));
    // rim light along the tile edge
    const rim = Math.max(0, 1 - Math.abs(RAD - d) / (SS * .012));
    if (rim > 0 && A[i] > 0) {
      const c = hsl(284, 1, .70);
      R[i] += c[0] * rim * .30; G[i] += c[1] * rim * .30; B[i] += c[2] * rim * .30;
    }
  }
}

// Tone map + gamma.
const master = Buffer.alloc(SS * SS * 4);
for (let i = 0; i < SS * SS; i++) {
  const enc = (v) => Math.round(Math.pow(1 - Math.exp(-v * .85), 1 / 2.0) * 255);
  master[i * 4] = enc(R[i]);
  master[i * 4 + 1] = enc(G[i]);
  master[i * 4 + 2] = enc(B[i]);
  master[i * 4 + 3] = Math.round(A[i] * 255);
}

/* --------------------------------------------------------------- resample */

function resize(src, from, to) {
  const out = Buffer.alloc(to * to * 4);
  const box = from / to;
  for (let y = 0; y < to; y++) {
    for (let x = 0; x < to; x++) {
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      const y0 = Math.floor(y * box), y1 = Math.floor((y + 1) * box);
      const x0 = Math.floor(x * box), x1 = Math.floor((x + 1) * box);
      for (let sy = y0; sy < y1; sy++) {
        for (let sx = x0; sx < x1; sx++) {
          const i = (sy * from + sx) * 4, al = src[i + 3] / 255;
          r += src[i] * al; g += src[i + 1] * al; b += src[i + 2] * al; a += src[i + 3];
          n++;
        }
      }
      const i = (y * to + x) * 4;
      const av = a / n;
      const un = av > 0 ? 255 / av : 0;             // un-premultiply
      out[i] = Math.min(255, Math.round(r / n * un));
      out[i + 1] = Math.min(255, Math.round(g / n * un));
      out[i + 2] = Math.min(255, Math.round(b / n * un));
      out[i + 3] = Math.round(av);
    }
  }
  return out;
}

/* -------------------------------------------------------------------- png */

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function png(rgba, size) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

/* -------------------------------------------------------------------- ico */

function dib(rgba, size) {
  const header = Buffer.alloc(40);
  header.writeUInt32LE(40, 0);
  header.writeInt32LE(size, 4);
  header.writeInt32LE(size * 2, 8);                 // colour + mask height
  header.writeUInt16LE(1, 12);
  header.writeUInt16LE(32, 14);
  const pixels = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const s = ((size - 1 - y) * size + x) * 4, d = (y * size + x) * 4;
      pixels[d] = rgba[s + 2];
      pixels[d + 1] = rgba[s + 1];
      pixels[d + 2] = rgba[s];
      pixels[d + 3] = rgba[s + 3];
    }
  }
  const maskRow = Math.ceil(size / 32) * 4;
  const mask = Buffer.alloc(maskRow * size);        // all-opaque AND mask
  return Buffer.concat([header, pixels, mask]);
}

function ico(entries) {
  const head = Buffer.alloc(6);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(entries.length, 4);
  let offset = 6 + entries.length * 16;
  const dir = [], blobs = [];
  for (const e of entries) {
    const d = Buffer.alloc(16);
    d[0] = e.size >= 256 ? 0 : e.size;
    d[1] = e.size >= 256 ? 0 : e.size;
    d[2] = 0; d[3] = 0;
    d.writeUInt16LE(1, 4);
    d.writeUInt16LE(32, 6);
    d.writeUInt32LE(e.data.length, 8);
    d.writeUInt32LE(offset, 12);
    offset += e.data.length;
    dir.push(d);
    blobs.push(e.data);
  }
  return Buffer.concat([head, ...dir, ...blobs]);
}

/* ------------------------------------------------------------------- emit */

fs.mkdirSync(OUT, { recursive: true });

const entries = SIZES.map((size) => {
  const rgba = resize(master, SS, size);
  return { size, data: size === 256 ? png(rgba, 256) : dib(rgba, size), rgba };
});

fs.writeFileSync(path.join(OUT, 'icon.ico'), ico(entries));
fs.writeFileSync(path.join(OUT, 'icon.png'), png(resize(master, SS, 512), 512));
fs.writeFileSync(path.join(OUT, 'icon-256.png'), entries.find((e) => e.size === 256).data);

console.log('build/icon.ico   ', SIZES.join(', '));
console.log('build/icon.png    512x512');
