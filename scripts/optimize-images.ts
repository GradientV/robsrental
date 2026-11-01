// turns photos into the small, fast .webp files the site actually serves.
//
//     npm run images
//
// drop a .jpg / .jpeg / .png anywhere under public/images, run the command, and for
// every one of them you get two files next to it:
//
//     <name>.webp       fits in 1600 x 1600, for big screens
//     <name>-sm.webp    fits in 720 x 960, for phones
//
// the original is moved (not deleted) into images-raw/, which git ignores, so a
// re-crop or re-export later is always possible.
//
//     npm run images -- --rebuild
//
// re-exports every original in images-raw/ (after changing the sizes or quality below).
//
// last step: it measures every .webp under public/images and writes
// src/data/image-manifest.json. <Photo /> reads that file to put the right width
// and height on each <img>, which stops the page from jumping while images load.
import { mkdir, readdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imagesDir = path.join(root, 'public', 'images');
const rawDir = path.join(root, 'images-raw');
const manifestFile = path.join(root, 'src', 'data', 'image-manifest.json');

const SOURCE = /\.(jpe?g|png)$/i;
const SIZES = [
    { suffix: '', width: 1600, height: 1600, quality: 74 },
    { suffix: '-sm', width: 720, height: 960, quality: 72 }
];

/** every file under dir, as absolute paths */
async function walk(dir: string): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true });
    const nested = await Promise.all(
        entries.map((entry) => {
            const full = path.join(dir, entry.name);
            return entry.isDirectory() ? walk(full) : Promise.resolve([full]);
        })
    );
    return nested.flat();
}

/** writes the two .webp sizes for one original. outBase is the output path without an extension */
async function exportSizes(file: string, outBase: string) {
    await mkdir(path.dirname(outBase), { recursive: true });
    for (const size of SIZES) {
        await sharp(file)
            .rotate() // respect the phone's orientation flag
            .resize({ width: size.width, height: size.height, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: size.quality, effort: 6 })
            .toFile(`${outBase}${size.suffix}.webp`);
    }
}

/** a new photo dropped into public/images: export it, then park the original in images-raw/ */
async function convert(file: string) {
    await exportSizes(file, file.replace(SOURCE, ''));

    const target = path.join(rawDir, path.relative(imagesDir, file));
    await mkdir(path.dirname(target), { recursive: true });
    await rename(file, target);
    console.log(`  ${path.relative(root, file)}  ->  .webp (+ -sm), original in ${path.relative(root, target)}`);
}

/** --rebuild: export every original in images-raw/ again, into the matching public/images folder */
async function rebuildAll() {
    const originals = (await walk(rawDir).catch(() => [] as string[])).filter((file) => SOURCE.test(file));
    console.log(`re-exporting ${originals.length} original(s) from images-raw/:`);
    for (const file of originals) {
        const outBase = path.join(imagesDir, path.relative(rawDir, file)).replace(SOURCE, '');
        await exportSizes(file, outBase);
        console.log(`  ${path.relative(root, file)}`);
    }
}

type Size = { w: number; h: number };
type Manifest = Record<string, Size & { sm?: Size }>;

async function buildManifest(files: string[]) {
    const manifest: Manifest = {};
    const webps = files.filter((file) => file.endsWith('.webp') && !file.endsWith('-sm.webp')).sort();

    for (const file of webps) {
        const meta = await sharp(file).metadata();
        const url = `/${path.relative(path.join(root, 'public'), file).split(path.sep).join('/')}`;
        const entry: Size & { sm?: Size } = { w: meta.width ?? 0, h: meta.height ?? 0 };

        const small = file.replace(/\.webp$/, '-sm.webp');
        if (files.includes(small)) {
            const smallMeta = await sharp(small).metadata();
            entry.sm = { w: smallMeta.width ?? 0, h: smallMeta.height ?? 0 };
        }
        manifest[url] = entry;
    }

    await writeFile(manifestFile, `${JSON.stringify(manifest, null, 4)}\n`, 'utf8');
    console.log(`\nwrote ${path.relative(root, manifestFile)} (${webps.length} images)`);
}

if (process.argv.includes('--rebuild')) await rebuildAll();

const sources = (await walk(imagesDir)).filter((file) => SOURCE.test(file));
if (sources.length) {
    console.log(`converting ${sources.length} image(s):`);
    for (const file of sources) await convert(file);
} else {
    console.log('no new .jpg/.png files in public/images');
}

await buildManifest(await walk(imagesDir));
