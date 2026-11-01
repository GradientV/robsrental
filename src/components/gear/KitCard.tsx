// a kit: its tile, what's inside, and the package price next to what the pieces cost separately
import { Link } from 'react-router';
import AddToList from '@/components/gear/AddToList';
import GearTile from '@/components/gear/GearTile';
import { getGear, kitPartsValue, type GearItem } from '@/data/gear';
import { cn } from '@/lib/cn';
import { formatMoney } from '@/lib/rental';

export default function KitCard({ item, tone = 'dark' }: { item: GearItem; tone?: 'light' | 'dark' }) {
    const dark = tone === 'dark';
    const separately = kitPartsValue(item);

    return (
        <article
            className={cn(
                'group flex flex-col transition-[translate,box-shadow] duration-300 ease-[var(--ease-snap)] hover:shadow-[0_18px_34px_-20px_rgb(20_21_24/0.5)] motion-safe:hover:-translate-y-1',
                dark ? 'bg-ink-800' : 'border border-paper-300 bg-paper-50'
            )}
        >
            <Link to={`/gear/${item.slug}`} tabIndex={-1} aria-hidden="true" className="block overflow-hidden">
                <GearTile item={item} className="aspect-[16/10] transition-transform duration-500 ease-[var(--ease-snap)] motion-safe:group-hover:scale-[1.025]" />
            </Link>
            <div className="flex flex-1 flex-col p-6">
                <h3 className="font-headline text-4xl">
                    <Link to={`/gear/${item.slug}`} className="hover:underline hover:decoration-2 hover:underline-offset-4">
                        {item.name}
                    </Link>
                </h3>
                <h4 className={cn('mt-5 text-xs font-semibold tracking-[0.14em] uppercase', dark ? 'text-ink-400' : 'text-ink-500')}>What’s inside</h4>
                <ul className={cn('mt-3 space-y-1.5 text-sm', dark ? 'text-paper-200' : 'text-ink-700')}>
                    {(item.parts ?? []).map((part) => {
                        const piece = getGear(part.slug);
                        if (!piece) return null;
                        return (
                            <li key={part.slug} className="flex gap-3">
                                <span className={cn('w-6 shrink-0 font-mono tabular-nums', dark ? 'text-ink-400' : 'text-ink-500')}>{part.qty}×</span>
                                <span>{piece.name}</span>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-auto pt-7">
                    <div className={cn('flex items-end justify-between gap-4 border-t pt-5', dark ? 'border-ink-700' : 'border-paper-300')}>
                        <p className="font-mono text-2xl tabular-nums">
                            {formatMoney(item.dayRate)}
                            <span className={cn('text-base', dark ? 'text-ink-400' : 'text-ink-500')}>/day</span>
                        </p>
                        <p className={cn('pb-1 text-right text-sm', dark ? 'text-ink-400' : 'text-ink-500')}>
                            <s className="font-mono tabular-nums">{formatMoney(separately)}</s> separately
                        </p>
                    </div>
                    <AddToList item={item} tone={tone} className="mt-5" />
                </div>
            </div>
        </article>
    );
}
