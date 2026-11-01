// "What are you shooting?" on the home page: a starting set of gear for common jobs,
// built from the catalog. when a set is built around one of the kits, the kit goes on
// the list as one line at the kit price, and everything else goes on piece by piece.
//
// SAMPLE DATA, like the catalog. Rob should adjust these to what he'd actually send out.

import { getGear, type GearItem, type KitPart } from './gear';

export type Shoot = {
    id: string;
    label: string;
    /** one short line, no more */
    line: string;
    /** the kit the set is built around, if any */
    kit?: string;
    /** everything else in the set */
    extras: KitPart[];
};

export const SHOOTS: Shoot[] = [
    {
        id: 'interview',
        label: 'Interview',
        line: 'Two soft lights, clean sound, locked off.',
        kit: 'kit-interview',
        extras: []
    },
    {
        id: 'music-video',
        label: 'Music video',
        line: 'Handheld Pocket 6K, hard tungsten, color in the background.',
        kit: 'kit-music-video',
        extras: [
            { slug: 'blackmagic-6k', qty: 1 },
            { slug: 'sigma-18-35', qty: 1 },
            { slug: 'shoulder-rig', qty: 1 },
            { slug: 'diffusion-set', qty: 1 }
        ]
    },
    {
        id: 'short-film',
        label: 'Short film',
        line: 'A camera on sticks, a big soft source, boom and a recorder.',
        extras: [
            { slug: 'sony-fx3', qty: 1 },
            { slug: 'sony-24-70-gm2', qty: 1 },
            { slug: 'smallhd-indie-7', qty: 1 },
            { slug: 'tripod-flowtech', qty: 1 },
            { slug: 'aputure-600d', qty: 1 },
            { slug: 'frame-6x6', qty: 1 },
            { slug: 'aputure-300x', qty: 1 },
            { slug: 'light-dome', qty: 1 },
            { slug: 'mkh-416', qty: 1 },
            { slug: 'boom-kit', qty: 1 },
            { slug: 'zoom-f6', qty: 1 },
            { slug: 'c-stand', qty: 3 },
            { slug: 'sandbag', qty: 4 }
        ]
    },
    {
        id: 'podcast',
        label: 'Podcast',
        line: 'Two cameras, two mics, soft light on both chairs.',
        extras: [
            { slug: 'sony-fx3', qty: 1 },
            { slug: 'sony-a7s3', qty: 1 },
            { slug: 'sony-24-70-gm2', qty: 2 },
            { slug: 'aputure-300x', qty: 2 },
            { slug: 'light-dome', qty: 2 },
            { slug: 'mkh-416', qty: 2 },
            { slug: 'zoom-f6', qty: 1 },
            { slug: 'xlr-25', qty: 2 },
            { slug: 'tripod-flowtech', qty: 2 },
            { slug: 'c-stand', qty: 2 },
            { slug: 'sandbag', qty: 2 }
        ]
    },
    {
        id: 'product',
        label: 'Product',
        line: 'The probe lens up close, a soft key, small lights for the shine.',
        extras: [
            { slug: 'laowa-probe', qty: 1 },
            { slug: 'sony-fx3', qty: 1 },
            { slug: 'aputure-300x', qty: 1 },
            { slug: 'light-dome', qty: 1 },
            { slug: 'aputure-mc-kit', qty: 1 },
            { slug: 'tripod-flowtech', qty: 1 },
            { slug: 'apple-boxes', qty: 1 },
            { slug: 'c-stand', qty: 2 },
            { slug: 'sandbag', qty: 2 }
        ]
    },
    {
        id: 'doc',
        label: 'Doc',
        line: 'One shooter, one bag, all day on the street.',
        kit: 'kit-doc',
        extras: [{ slug: 'gopro-hero11', qty: 1 }]
    }
];

export type ShootPlan = {
    /** every piece in the set, kit included, for the packing list */
    pieces: Array<{ item: GearItem; qty: number }>;
    /** what actually goes on the gear list */
    lines: KitPart[];
    count: number;
    perDay: number;
    /** what it would cost a day with every piece rented on its own */
    separately: number;
    kit?: GearItem;
};

export function planFor(shoot: Shoot): ShootPlan {
    const kit = shoot.kit ? getGear(shoot.kit) : undefined;
    const qty = new Map<string, number>();
    for (const part of [...(kit?.parts ?? []), ...shoot.extras]) qty.set(part.slug, (qty.get(part.slug) ?? 0) + part.qty);

    const pieces = [...qty].flatMap(([slug, count]) => {
        const item = getGear(slug);
        return item ? [{ item, qty: count }] : [];
    });
    const extrasPerDay = shoot.extras.reduce((sum, part) => sum + (getGear(part.slug)?.dayRate ?? 0) * part.qty, 0);

    return {
        pieces,
        lines: kit ? [{ slug: kit.slug, qty: 1 }, ...shoot.extras] : shoot.extras,
        count: pieces.reduce((sum, piece) => sum + piece.qty, 0),
        perDay: (kit?.dayRate ?? 0) + extrasPerDay,
        separately: pieces.reduce((sum, piece) => sum + piece.item.dayRate * piece.qty, 0),
        kit
    };
}
