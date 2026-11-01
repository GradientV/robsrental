// "Goes with your list": gear that pairs with what's already on the list (each item's
// `pairs` in gear.ts), best matches first, skipping anything already on it.
import { getGear, type GearItem } from '@/data/gear';
import type { ListLine } from '@/lib/rental';

export function suggestionsFor(lines: ListLine[], limit = 3): GearItem[] {
    const onList = new Set(lines.map((line) => line.slug));
    // the pieces inside a kit on the list count as on the list too
    for (const line of lines) for (const part of getGear(line.slug)?.parts ?? []) onList.add(part.slug);

    // a pair named by several items on the list, or named early, ranks higher
    const score = new Map<string, number>();
    for (const line of lines) {
        getGear(line.slug)?.pairs.forEach((slug, index) => {
            if (!onList.has(slug)) score.set(slug, (score.get(slug) ?? 0) + 10 - index);
        });
    }

    return [...score]
        .sort((a, b) => b[1] - a[1])
        .flatMap(([slug]) => {
            const item = getGear(slug);
            return item ? [item] : [];
        })
        .slice(0, limit);
}
