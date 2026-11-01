// every page the site has, in one list.
// App.tsx builds the routes from it, <Seo /> builds canonical links from it,
// and scripts/prerender.ts writes one HTML file per page plus sitemap.xml from it.
// each piece of gear also gets its own page at /gear/<slug>, built from src/data/gear.ts.
import { GEAR } from './gear';
import { SITE_URL } from './site';

export type PageId = 'home' | 'gear' | 'list' | 'renting' | 'contact' | 'privacy';

export type Page = {
    id: PageId;
    path: string;
    title: string;
    description: string;
    /** sitemap hints */
    priority: number;
    changefreq: 'weekly' | 'monthly' | 'yearly';
    lastmod: string;
    /** the gear list is personal, so it stays out of search results and the sitemap */
    noindex?: boolean;
};

const UPDATED = '2026-11-01';

export const PAGES: Page[] = [
    {
        id: 'home',
        path: '/',
        title: 'Rob’s Rentals | Camera, Lighting & Audio Rentals in Bushwick, Brooklyn',
        description:
            'Camera & lens, lighting & rigs. A by-appointment rental house at 133 Woodbine St, Bushwick. Build your gear list online, then pick up or get it delivered anywhere in NYC. 5.0 on Google.',
        priority: 1,
        changefreq: 'weekly',
        lastmod: UPDATED
    },
    {
        id: 'gear',
        path: '/gear',
        title: 'Rental Gear & Day Rates | Rob’s Rentals, Brooklyn',
        description:
            'Cameras, lenses, lighting, audio, grip and ready-made kits with day rates. Sony FX3, a7S III, ARRI fresnels, Aputure LEDs, Sennheiser audio, DJI gimbals and more in Bushwick, Brooklyn.',
        priority: 0.9,
        changefreq: 'weekly',
        lastmod: UPDATED
    },
    {
        id: 'list',
        path: '/list',
        title: 'Your Gear List | Rob’s Rentals',
        description: 'Your rental list, dates and estimate. Send it to Rob by text or email and he’ll confirm.',
        priority: 0.1,
        changefreq: 'yearly',
        lastmod: UPDATED,
        noindex: true
    },
    {
        id: 'renting',
        path: '/renting',
        title: 'How Renting Works: Pickup, Delivery & FAQ | Rob’s Rentals',
        description:
            'How to book gear from Rob’s Rentals: send your list, get a text back, then pick up in Bushwick or get it delivered anywhere in NYC. Rental days, insurance and returns explained.',
        priority: 0.7,
        changefreq: 'monthly',
        lastmod: UPDATED
    },
    {
        id: 'contact',
        path: '/contact',
        title: 'Contact & Pickup | Rob’s Rentals, 133 Woodbine St, Brooklyn',
        description:
            'Call or text (310) 853-2323. Pickups by appointment at 133 Woodbine St, Bushwick, Brooklyn NY 11221: weekdays around the clock, weekends 7 AM – 11 PM.',
        priority: 0.8,
        changefreq: 'monthly',
        lastmod: UPDATED
    },
    {
        id: 'privacy',
        path: '/privacy',
        title: 'Privacy | Rob’s Rentals',
        description: 'How the Rob’s Rentals website handles your information, in plain English.',
        priority: 0.2,
        changefreq: 'yearly',
        lastmod: UPDATED
    }
];

export function getPage(id: PageId): Page {
    const page = PAGES.find((candidate) => candidate.id === id);
    if (!page) throw new Error(`unknown page: ${id}`);
    return page;
}

export const absoluteUrl = (path: string) => (path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`);

/** every address the prerender step writes a file for, with its sitemap hints */
export type PrerenderPath = { path: string; lastmod: string; changefreq: string; priority: number; noindex: boolean };

export const PRERENDER_PATHS: PrerenderPath[] = [
    ...PAGES.map((page) => ({ path: page.path, lastmod: page.lastmod, changefreq: page.changefreq, priority: page.priority, noindex: Boolean(page.noindex) })),
    ...GEAR.map((item) => ({ path: `/gear/${item.slug}`, lastmod: UPDATED, changefreq: 'monthly', priority: 0.6, noindex: false }))
];
