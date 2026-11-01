// gear that goes with what's on the list, each one a tap away. shown in the drawer and
// on /list; nothing shows when there's nothing to suggest.
import { useId } from 'react';
import { Link } from 'react-router';
import GearTile from '@/components/gear/GearTile';
import { useGearList } from '@/components/list/GearListContext';
import { formatMoney } from '@/lib/rental';
import { suggestionsFor } from '@/lib/suggest';

type Props = {
    /** in the drawer: no toast, and links close the drawer */
    inDrawer?: boolean;
    onNavigate?: () => void;
    className?: string;
};

export default function GoesWith({ inDrawer = false, onNavigate, className }: Props) {
    const { lines, add } = useGearList();
    const titleId = useId();
    const items = suggestionsFor(lines);
    if (items.length === 0) return null;

    return (
        <section aria-labelledby={titleId} className={className}>
            <h3 id={titleId} className="text-xs font-semibold tracking-[0.14em] text-ink-500 uppercase">
                Goes with your list
            </h3>
            <ul className="mt-2 divide-y divide-paper-300">
                {items.map((item) => (
                    <li key={item.slug} className="flex items-center gap-4 py-3">
                        <GearTile item={item} size="sm" className="aspect-[4/3] w-16 shrink-0" />
                        <div className="min-w-0 flex-1">
                            <Link to={`/gear/${item.slug}`} onClick={onNavigate} className="block text-[0.95rem] leading-snug font-semibold hover:underline">
                                {item.name}
                            </Link>
                            <span className="font-mono text-xs text-ink-500 tabular-nums">{formatMoney(item.dayRate)}/day</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => add(item.slug, 1, inDrawer)}
                            aria-label={`Add ${item.name}`}
                            className="h-9 shrink-0 border border-ink-900/80 px-4 text-sm font-semibold transition-colors hover:bg-ink-900 hover:text-paper-50"
                        >
                            Add
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
