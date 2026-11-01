// draws the two background textures, the same idea as the washes on gradientv.com
// but made for Rob: grey images that pick up the page color through a blend mode
// (see .tx in src/index.css), faded out before they reach any text.
//
//     npm run textures
//
//     public/textures/folds.webp   soft folds, like a silk on a 6×6 frame. light sections
//     public/textures/ribs.webp    navy ribs curving away. dark bands
//
// the results are committed, so Vercel never runs this.
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public', 'textures');
await mkdir(out, { recursive: true });

/** the same "random" numbers every run, so the textures never change unless this file does */
function seeded(seed: number) {
    let state = seed;
    return () => {
        state = (state * 1664525 + 1013904223) % 4294967296;
        return state / 4294967296;
    };
}

// --- folds: bands of cloth stacked back to front. each one casts a soft shadow on
// the band behind it and catches a thin highlight along its top edge
{
    const W = 1800;
    const H = 1200;
    const rand = seeded(7);
    const bands: string[] = [];

    // fewer, bigger bands that rise toward the right read as draped cloth, not stacked paper
    for (let i = 0; i < 5; i++) {
        const base = 40 + i * 270;
        const y0 = base + 120 + (rand() - 0.5) * 160;
        const c1 = base - 420 + rand() * 220;
        const c2 = base + 360 + rand() * 240;
        const y3 = base - 300 + rand() * 140;
        const edge = `M -200 ${y0} C 420 ${c1}, 1200 ${c2}, ${W + 200} ${y3}`;
        const body = `${edge} L ${W + 200} ${H + 400} L -200 ${H + 400} Z`;
        bands.push(`
            <path d="${body}" transform="translate(0 -34)" fill="#000" opacity=".3" filter="url(#shadow)"/>
            <path d="${body}" fill="url(#cloth)"/>
            <path d="${edge}" fill="none" stroke="#fff" stroke-width="4" opacity=".9" filter="url(#soft)"/>`);
    }

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="cloth" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset=".1" stop-color="#f7f7f7"/>
      <stop offset=".45" stop-color="#e2e2e2"/>
      <stop offset="1" stop-color="#c6c6c6"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-20%" width="120%" height="140%"><feGaussianBlur stdDeviation="42"/></filter>
    <filter id="soft"><feGaussianBlur stdDeviation="2.2"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="#e9e9e9"/>
  ${bands.join('')}
</svg>`;

    await sharp(Buffer.from(svg)).blur(1.2).webp({ quality: 72 }).toFile(path.join(out, 'folds.webp'));
    console.log('  public/textures/folds.webp');
}

// --- ribs: thick ribs on the left that thin out and bend away to the right,
// lit from one side in navy
{
    const W = 1600;
    const H = 1000;
    const ribs: string[] = [];
    const count = 46;

    for (let i = 0; i < count; i++) {
        const t = i / (count - 1);
        const x = 40 + Math.pow(t, 0.72) * (W - 80);
        const width = 30 * Math.pow(1 - t, 1.3) + 3;
        const bend = 120 + t * 520;
        const d = `M ${x - bend * 0.15} ${H + 60} C ${x + bend * 0.1} ${H * 0.6}, ${x + bend * 0.55} ${H * 0.25}, ${x + bend} -60`;
        ribs.push(`
            <path d="${d}" fill="none" stroke="url(#rib)" stroke-width="${width.toFixed(1)}" stroke-linecap="round"/>
            <path d="${d}" fill="none" stroke="#9db7ea" stroke-opacity="${(0.55 - t * 0.35).toFixed(2)}" stroke-width="1.4" transform="translate(${(-width / 2 + 1).toFixed(1)} 0)"/>`);
    }

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="rib" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#4f78c8"/>
      <stop offset=".45" stop-color="#244791"/>
      <stop offset="1" stop-color="#0c1530"/>
    </linearGradient>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity=".55"/>
      <stop offset=".5" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".35"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#060912"/>
  ${ribs.join('')}
  <rect width="${W}" height="${H}" fill="url(#shade)"/>
</svg>`;

    await sharp(Buffer.from(svg)).blur(0.7).webp({ quality: 74 }).toFile(path.join(out, 'ribs.webp'));
    console.log('  public/textures/ribs.webp');
}
