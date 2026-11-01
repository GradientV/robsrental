// makes the icon and share-image files that can't be SVG:
//
//     npm run brand
//
//     public/apple-touch-icon.png   180 x 180, for iPhone home screens
//     public/icon-192.png           for Android / the web app manifest
//     public/icon-512.png
//     public/og-image.png           1200 x 630, the picture shown when a link is shared
//
// the icons come from public/favicon.svg. the share image is drawn here; its text uses
// fonts installed on this computer (Impact / Arial), so run it on Windows or macOS.
// the results are committed, so Vercel never runs this.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = (file: string) => path.join(root, 'public', file);

// --- icons: the favicon with square corners (iOS and Android round them themselves)
const favicon = (await readFile(pub('favicon.svg'), 'utf8')).replace('rx="14"', 'rx="0"');
for (const [file, size] of [
    ['apple-touch-icon.png', 180],
    ['icon-192.png', 192],
    ['icon-512.png', 512]
] as const) {
    await sharp(Buffer.from(favicon), { density: (72 * size) / 64 })
        .resize(size, size)
        .png()
        .toFile(pub(file));
    console.log(`  public/${file}`);
}

// --- share image: black case foam, a strip of tape with the name, the bio underneath
const W = 1200;
const H = 630;

// torn tape ends, same shape as the .tape utility in src/index.css
function tape(x: number, y: number, w: number, h: number): string {
    const left = [0.06, 0.2, 0.34, 0.5, 0.66, 0.8, 0.94].map((t, i) => `${x + (i % 2 ? w * 0.022 : w * 0.004)},${y + h * t}`);
    const right = [0.86, 0.72, 0.56, 0.42, 0.26, 0.1].map((t, i) => `${x + w - (i % 2 ? w * 0.004 : w * 0.022)},${y + h * t}`);
    return [`${x},${y}`, ...left, `${x},${y + h}`, `${x + w},${y + h}`, ...right, `${x + w * 0.976},${y}`].join(' ');
}

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <pattern id="foam" width="14" height="14" patternUnits="userSpaceOnUse">
      <rect width="14" height="14" fill="#141518"/>
      <circle cx="7" cy="7" r="4.3" fill="#1d1f23"/>
    </pattern>
    <filter id="shadow" x="-10%" y="-30%" width="120%" height="160%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity=".45"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#foam)"/>
  <g transform="rotate(-2.5 430 185)" filter="url(#shadow)">
    <polygon points="${tape(52, 110, 790, 150)}" fill="#f2efe6"/>
    <text x="447" y="228" text-anchor="middle" font-family="Impact, 'Arial Narrow', sans-serif" font-size="108" fill="#1d3a78" letter-spacing="2">ROB’S RENTALS</text>
  </g>
  <text x="76" y="388" font-family="Impact, 'Arial Narrow', sans-serif" font-size="74" fill="#fbfaf7" letter-spacing="1">CAMERA &amp; LENS. LIGHTING &amp; RIGS.</text>
  <text x="78" y="452" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#bfc0c2">Pickup in Bushwick or delivery anywhere in NYC. By appointment.</text>
  <line x1="78" y1="510" x2="${W - 78}" y2="510" stroke="#2b2d32" stroke-width="2"/>
  <text x="78" y="562" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="28" fill="#fbfaf7">133 Woodbine St, Brooklyn</text>
  <text x="${W - 78}" y="562" text-anchor="end" font-family="Consolas, 'Courier New', monospace" font-size="28" fill="#fbfaf7">Call or text (310) 853-2323</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(pub('og-image.png'));
console.log('  public/og-image.png');
