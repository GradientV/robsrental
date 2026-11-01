// everything about the business that shows up in more than one place:
// name, address, phone, hours, links. change it here and every page follows.
//
// sources for each fact, and what still needs confirming with Rob, are in RESEARCH.md.

/**
 * the address the site will live at. used for canonical links, the sitemap,
 * social previews and structured data.
 * PLACEHOLDER: Rob doesn't have a domain yet. swap in the real one, then rebuild.
 */
export const SITE_URL = 'https://robsrentals.vercel.app';

export const site = {
    /** what Rob calls it (Facebook page, and what he said on the call) */
    name: "Rob's Rentals",
    /** the name on the Google Business Profile */
    altName: 'Rob’s Film & Photo',
    kind: 'Camera, lighting & audio rentals',

    /** the Facebook bio, word for word. it's the voice of the whole site */
    bio: 'Camera & lens, lighting & rigs. Available for delivery or pickup in NYC.',
    signoff: 'Don’t break it.',

    address: {
        street: '133 Woodbine St',
        neighborhood: 'Bushwick',
        city: 'Brooklyn',
        region: 'NY',
        postalCode: '11221',
        country: 'US'
    },
    geo: { lat: 40.6924147, lng: -73.9171178 },

    /** the number on Google, where the listing says "just call or text" */
    phone: { display: '(310) 853-2323', tel: '+13108532323' },
    /** from the Facebook page. CONFIRM it's still the inbox Rob wants */
    email: 'robertdouthatphotography@gmail.com',

    facebook: 'https://www.facebook.com/robsfilmandphoto',

    rating: { value: 5.0, count: 76, source: 'Google', checked: '2026-11-01' },

    links: {
        googleMaps: 'https://maps.google.com/?cid=13462418962198093306',
        directions: 'https://www.google.com/maps/dir/?api=1&destination=133+Woodbine+St%2C+Brooklyn%2C+NY+11221',
        mapEmbed: 'https://www.google.com/maps?q=133+Woodbine+St,+Brooklyn,+NY+11221&z=16&output=embed'
    }
} as const;

export const telHref = `tel:${site.phone.tel}`;

/** opens the messages app. the "?&" form works on both iPhone and Android */
export function smsHref(body?: string): string {
    return body ? `sms:${site.phone.tel}?&body=${encodeURIComponent(body)}` : `sms:${site.phone.tel}`;
}

export type DayHours = {
    day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
    short: string;
    /** what the Google listing says, as written for people */
    label: string;
};

/**
 * pickup and return windows, Sunday first. everything is by appointment:
 * these are the hours on Google (checked Nov 1, 2026), not walk-in hours.
 */
export const hours: DayHours[] = [
    { day: 'Sunday', short: 'Sun', label: '10 AM – 11 PM' },
    { day: 'Monday', short: 'Mon', label: 'Open 24 hours' },
    { day: 'Tuesday', short: 'Tue', label: 'Open 24 hours' },
    { day: 'Wednesday', short: 'Wed', label: 'Open 24 hours' },
    { day: 'Thursday', short: 'Thu', label: 'Open 24 hours' },
    { day: 'Friday', short: 'Fri', label: 'Open 24 hours' },
    { day: 'Saturday', short: 'Sat', label: '7 AM – 11 PM' }
];

export const HOURS_SUMMARY = 'Weekdays around the clock. Saturdays 7 AM – 11 PM, Sundays 10 AM – 11 PM.';

export type NavItem = { to: string; label: string };

export const nav: NavItem[] = [
    { to: '/gear', label: 'Gear' },
    { to: '/gear?category=kits', label: 'Kits' },
    { to: '/renting', label: 'Renting' },
    { to: '/contact', label: 'Contact' }
];

/** one line for the footer, the default description and structured data */
export const ONE_LINER =
    'A by-appointment camera, lens, lighting and audio rental house in Bushwick, Brooklyn. Pick up on Woodbine St or get it delivered anywhere in NYC.';
