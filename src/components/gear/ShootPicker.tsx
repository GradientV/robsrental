// "What are you shooting?": pick a kind of job, see a ready-made set from the catalog
// with its day rate, and put the whole set on the gear list in one go.
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import GearTile from '@/components/gear/GearTile';
import { useGearList } from '@/components/list/GearListContext';
import { buttonClasses } from '@/components/ui/Button';
import { SHOOTS, planFor } from '@/data/shoots';
import { cn } from '@/lib/cn';
import { flyToList } from '@/lib/fly';
import { formatMoney } from '@/lib/rental';

export default function ShootPicker() {
    const { addMany } = useGearList();
    const [activeId, setActiveId] = useState(SHOOTS[0].id);
    const [justAdded, setJustAdded] = useState<string | null>(null);
    const shoot = SHOOTS.find((option) => option.id === activeId) ?? SHOOTS[0];
    const plan = planFor(shoot);
    const added = justAdded === shoot.id;

    // "Added" shows for a moment, then the button goes back to normal
    useEffect(() => {
        if (!justAdded) return;
        const timer = window.setTimeout(() => setJustAdded(null), 2400);
        return () => window.clearTimeout(timer);
    }, [justAdded]);

    return (
        <section aria-labelledby="shoot-title" className="border-t border-paper-300">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] lg:gap-16 lg:py-20">
                <div className="min-w-0">
                    <h2 id="shoot-title" className="font-headline text-5xl sm:text-6xl">
                        What are you shooting?
                    </h2>
                    <ul className="no-scrollbar -mx-4 mt-6 flex gap-6 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:mt-10 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:px-0">
                        {SHOOTS.map((option) => {
                            const active = option.id === shoot.id;
                            return (
                                <li key={option.id} className="shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setActiveId(option.id)}
                                        aria-pressed={active}
                                        className={cn(
                                            'font-headline text-4xl whitespace-nowrap underline-offset-[0.2em] transition-colors lg:text-5xl',
                                            active ? 'text-ink-900 underline decoration-navy-700 decoration-[3px]' : 'text-ink-400 hover:text-ink-900'
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="min-w-0 self-start border border-paper-300 bg-paper-50">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-paper-300 px-5 py-4 sm:px-7">
                        <p className="text-ink-700">{shoot.line}</p>
                        <p className="font-mono text-xs tracking-[0.12em] text-ink-500 uppercase">{plan.count} pieces</p>
                    </div>

                    <ul aria-label={`${shoot.label} set`} className="grid sm:grid-cols-2">
                        {plan.pieces.map(({ item, qty }) => (
                            <li key={item.slug} className="flex items-center gap-4 border-b border-paper-200 px-5 py-2.5 sm:px-7 sm:odd:border-r">
                                <GearTile item={item} size="sm" className="aspect-[4/3] w-14 shrink-0" />
                                <span className="w-7 shrink-0 font-mono text-sm text-ink-500 tabular-nums">{qty}×</span>
                                <Link to={`/gear/${item.slug}`} className="min-w-0 text-[0.95rem] leading-snug hover:underline">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-col gap-5 bg-paper-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                        <div>
                            <p className="font-mono text-2xl tabular-nums">
                                {formatMoney(plan.perDay)}
                                <span className="text-base text-ink-500">/day</span>
                            </p>
                            {plan.kit && (
                                <p className="mt-1 text-sm text-ink-500">
                                    Built on the{' '}
                                    <Link to={`/gear/${plan.kit.slug}`} className="underline underline-offset-4 hover:text-ink-900">
                                        {plan.kit.name.toLowerCase()}
                                    </Link>
                                    . <s className="font-mono tabular-nums">{formatMoney(plan.separately)}</s> separately.
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            disabled={added}
                            onClick={(event) => {
                                flyToList(event.currentTarget, shoot.label.toUpperCase());
                                addMany(plan.lines, `${shoot.label} set`);
                                setJustAdded(shoot.id);
                            }}
                            className={buttonClasses({ variant: 'navy', className: 'w-full shrink-0 sm:w-auto' })}
                        >
                            {added ? 'Added to your list' : 'Add this set to your list'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
