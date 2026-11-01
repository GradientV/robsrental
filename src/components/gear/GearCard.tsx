import { Link } from 'react-router';
import AddToList from '@/components/gear/AddToList';
import GearTile from '@/components/gear/GearTile';
import type { GearItem } from '@/data/gear';
import { cn } from '@/lib/cn';
import { formatMoney } from '@/lib/rental';

type Props = {
    item: GearItem;
    tone?: 'light' | 'dark';
    /** heading level for the item name, so pages keep a clean outline */
    as?: 'h2' | 'h3';
    className?: string;
};

export default function GearCard({ item, tone = 'light', as: Heading = 'h3', className }: Props) {
    const dark = tone === 'dark';
    return (
        <article className={cn('group flex flex-col', className)}>
            {/* the tile lifts a little on hover; it holds still for people who ask for less motion */}
            <Link
                to={`/gear/${item.slug}`}
                tabIndex={-1}
                aria-hidden="true"
                className="block overflow-hidden transition-[translate,box-shadow] duration-300 ease-[var(--ease-snap)] group-hover:shadow-[0_16px_30px_-18px_rgb(20_21_24/0.55)] motion-safe:group-hover:-translate-y-1"
            >
                <GearTile item={item} className="aspect-[4/3] transition-transform duration-500 ease-[var(--ease-snap)] motion-safe:group-hover:scale-[1.025]" />
            </Link>
            <div className="flex flex-1 flex-col pt-4">
                <div className="flex items-baseline justify-between gap-4">
                    <Heading className="text-[1.0625rem] leading-snug font-semibold">
                        <Link to={`/gear/${item.slug}`} className={cn('underline-offset-4 hover:underline', dark ? 'decoration-paper-50/40' : 'decoration-ink-900/30')}>
                            {item.name}
                        </Link>
                    </Heading>
                    <p className="shrink-0 font-mono text-sm tabular-nums">
                        {formatMoney(item.dayRate)}
                        <span className={dark ? 'text-ink-400' : 'text-ink-500'}>/day</span>
                    </p>
                </div>
                <div className="mt-auto pt-4">
                    <AddToList item={item} tone={tone} />
                </div>
            </div>
        </article>
    );
}
