// turns the built React app into one real HTML file per page.
//
// why: a plain React app ships an empty <div id="root"> and fills it in with
// JavaScript. people never notice, but link previews (iMessage, Facebook, Slack)
// and most AI crawlers don't run JavaScript, so they'd see a blank page. after
// Vite builds the app, this draws every page once, here on the build machine:
//
//     /                  dist/index.html
//     /gear              dist/gear.html             (Vercel serves it at /gear: "cleanUrls")
//     /gear/sony-fx3     dist/gear/sony-fx3.html
//     ...
//     (missing)          dist/404.html
//
// it also writes sitemap.xml and robots.txt from the same data, so they always
// match the real pages and the real domain.
//
// it runs as the last step of `npm run build`, after:
//     build:client   the normal Vite build, into dist/
//     build:server   src/entry-server.tsx compiled for Node, into dist-server/
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

type ServerEntry = {
    render: (path: string) => string;
    PRERENDER_PATHS: Array<{ path: string; lastmod: string; changefreq: string; priority: number; noindex: boolean }>;
    SITE_URL: string;
};

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const entry = (await import(pathToFileURL(path.join(root, 'dist-server', 'entry-server.js')).href)) as ServerEntry;

// dist/index.html as Vite built it: the page shell with the real script and stylesheet names
let template = await readFile(path.join(dist, 'index.html'), 'utf8');

// preload the two fonts every page uses above the fold, so headlines don't
// flash in a fallback font. Vite gives them hashed names, so look them up
const assets = await readdir(path.join(dist, 'assets'));
const preloads = [/^league-gothic-latin-wdth-normal-.*\.woff2$/, /^instrument-sans-latin-wght-normal-.*\.woff2$/]
    .map((pattern) => assets.find((file) => pattern.test(file)))
    .filter((file): file is string => Boolean(file))
    .map((file) => `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin />`)
    .join('\n    ');
template = template.replace('<!--page-head-->', () => `${preloads}\n    <!--page-head-->`);

// React writes a page's <title>, <meta> and <link> tags first, before the page itself.
// this matches that run of tags so they can be moved up into <head>
const HEAD_TAGS = /^(?:<title>[^<]*<\/title>|<meta [^>]*\/>|<link [^>]*\/>)+/;

function buildPage(urlPath: string): string {
    const rendered = entry.render(urlPath);
    const head = rendered.match(HEAD_TAGS)?.[0] ?? '';
    const body = rendered.slice(head.length);

    if (!head.includes('<title>') || body.length < 500) {
        throw new Error(`prerender: ${urlPath} came out empty or without a title`);
    }

    // replacements are functions so a "$" in the page text can't be read as a pattern
    return (
        template
            // the two markers fence off this page's tags, so main.tsx can clear them if it ends up drawing a different page
            .replace('<!--page-head-->', () => `<!--page-head-->${head}<!--/page-head-->`)
            // data-prerendered tells main.tsx which page this HTML is, so it knows it can hydrate
            .replace('<div id="root"><!--page-body--></div>', () => `<div id="root" data-prerendered="${urlPath}">${body}</div>`)
    );
}

async function save(file: string, contents: string) {
    const target = path.join(dist, file);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, contents, 'utf8');
}

console.log('prerendering:');

for (const page of entry.PRERENDER_PATHS) {
    await save(page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`, buildPage(page.path));
}
console.log(`  ${entry.PRERENDER_PATHS.length} pages`);

// Vercel shows dist/404.html (with a 404 status) for any address that isn't a file.
// '/404' isn't a page, so the router lands on the not-found view
await save('404.html', buildPage('/404'));
console.log('  404.html');

const pageUrl = (urlPath: string) => (urlPath === '/' ? `${entry.SITE_URL}/` : `${entry.SITE_URL}${urlPath}`);

const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entry.PRERENDER_PATHS.filter((page) => !page.noindex).map(
        (page) =>
            `  <url><loc>${pageUrl(page.path)}</loc><lastmod>${page.lastmod}</lastmod><changefreq>${page.changefreq}</changefreq><priority>${page.priority.toFixed(1)}</priority></url>`
    ),
    '</urlset>',
    ''
].join('\n');
await save('sitemap.xml', sitemap);
console.log('  sitemap.xml');

await save('robots.txt', ['User-agent: *', 'Allow: /', 'Disallow: /list', '', `Sitemap: ${entry.SITE_URL}/sitemap.xml`, ''].join('\n'));
console.log('  robots.txt');
