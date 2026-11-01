// one piece of gear: /gear/<slug>
import { useState } from 'react';
import { Link, useParams } from 'react-router';
import GearCard from '@/components/gear/GearCard';
import GearTile from '@/components/gear/GearTile';
import QtyStepper from '@/components/gear/QtyStepper';
import { useGearList } from '@/components/list/GearListContext';
import Seo from '@/components/Seo';
import { buttonClasses } from '@/components/ui/Button';
import Photo from '@/components/ui/Photo';
import { getCategory, getGear, kitPartsValue, type GearItem as Item } from '@/data/gear';
import { smsHref } from '@/data/site';
import { cn } from '@/lib/cn';
import { flyToList } from '@/lib/fly';
import { formatMoney, WEEK_BILLED_AS } from '@/lib/rental';
import { productSchema } from '@/lib/schema';
import NotFound from './NotFound';

export default function GearItem() {
    const { slug = '' } = useParams();
    const item = getGear(slug);
    if (!item) return <NotFound />;
    // keyed by slug so moving between items starts the quantity picker fresh
    return <ItemPage key={item.slug} item={item} />;
}

function ItemPage({ item }: { item: Item }) {
    const category = getCategory(item.category);
    const isKit = item.category === 'kits';
    const pairs = item.pairs.map(getGear).filter((pair): pair is Item => Boolean(pair));

    return (
        <>
            <Seo
                path={`/gear/${item.slug}`}
                title={`${item.name} Rental, ${formatMoney(item.dayRate)}/day | Rob’s Rentals, Brooklyn`}
                description={`Rent the ${item.name} in Bushwick, Brooklyn for ${formatMoney(item.dayRate)} a day. ${item.summary} Pickup by appointment or delivery anywhere in NYC.`}
                schema={productSchema(item)}
            />

            <div className="mx-auto max-w-7xl px-4 pt-8 pb-20 sm:px-6 lg:pt-10">
                <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
                    <Link to="/gear" className="hover:text-ink-900 hover:underline">
                        Gear
                    </Link>
                    <span className="px-2 text-ink-300">/</span>
                    <Link to={`/gear?category=${category.id}`} className="hover:text-ink-900 hover:underline">
                        {category.label}
                    </Link>
                    <span className="px-2 text-ink-300">/</span>
                    <span aria-current="page" className="text-ink-800">
                        {item.name}
                    </span>
                </nav>

                <div className="mt-8 grid gap-10 lg:grid-cols-[1.12fr_1fr] lg:gap-16">
                    <div className="lg:sticky lg:top-28 lg:self-start">
                        <Gallery item={item} />
                    </div>

                    <div>
                        <p className="font-mono text-xs tracking-[0.14em] text-ink-500 uppercase">{item.brand}</p>
                        <h1 className="mt-3 font-headline text-6xl sm:text-7xl">{item.name}</h1>
                        <p className="mt-5 text-xl leading-relaxed text-ink-700">{item.summary}</p>

                        <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-3 border-y border-paper-300 py-6">
                            <p className="font-mono text-4xl tabular-nums">
                                {formatMoney(item.dayRate)}
                                <span className="text-xl text-ink-500">/day</span>
                            </p>
                            <p className="pb-1 text-ink-600">
                                {isKit ? (
                                    <>
                                        <s className="font-mono tabular-nums">{formatMoney(kitPartsValue(item))}</s> if you rented the pieces separately
                                    </>
                                ) : (
                                    <>
                                        <span className="font-mono text-ink-900 tabular-nums">{formatMoney(item.dayRate * WEEK_BILLED_AS)}</span> for a full week
                                    </>
                                )}
                            </p>
                        </div>

                        {item.note && <p className="mt-6 border-l-2 border-navy-700 bg-navy-50 px-5 py-4 leading-relaxed text-navy-900">{item.note}</p>}

                        <AddPanel item={item} />

                        {isKit ? (
                            <section aria-labelledby="inside-title" className="mt-12">
                                <h2 id="inside-title" className="font-headline text-4xl">
                                    What’s inside
                                </h2>
                                <ul className="mt-4 divide-y divide-paper-300 border-y border-paper-300">
                                    {(item.parts ?? []).map((part) => {
                                        const piece = getGear(part.slug);
                                        if (!piece) return null;
                                        return (
                                            <li key={part.slug} className="flex items-baseline gap-4 py-3">
                                                <span className="w-8 shrink-0 font-mono text-ink-500 tabular-nums">{part.qty}×</span>
                                                <Link to={`/gear/${piece.slug}`} className="flex-1 hover:underline">
                                                    {piece.name}
                                                </Link>
                                                <span className="font-mono text-sm text-ink-500 tabular-nums">{formatMoney(piece.dayRate * part.qty)}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        ) : (
                            <section aria-labelledby="case-title" className="mt-12">
                                <h2 id="case-title" className="font-headline text-4xl">
                                    In the case
                                </h2>
                                <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-ink-700 marker:text-ink-400">
                                    {item.includes.map((line) => (
                                        <li key={line}>{line}</li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <section aria-labelledby="specs-title" className="mt-12">
                            <h2 id="specs-title" className="font-headline text-4xl">
                                {isKit ? 'The short version' : 'Specs'}
                            </h2>
                            <dl className="mt-4 border-t border-ink-900">
                                {item.specs.map(([label, value]) => (
                                    <div key={label} className="grid grid-cols-[9rem_1fr] gap-4 border-b border-paper-300 py-3 text-[0.95rem]">
                                        <dt className="text-ink-500">{label}</dt>
                                        <dd className="font-mono text-ink-900">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </section>

                        <p className="mt-10 text-ink-600">
                            Questions about this one?{' '}
                            <a href={smsHref(`Hi Rob, a question about the ${item.name}: `)} className="font-semibold text-ink-900 underline underline-offset-4">
                                Text Rob
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {pairs.length > 0 && (
                <section aria-labelledby="pairs-title" className="border-t border-paper-300 bg-paper-200/60">
                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
                        <h2 id="pairs-title" className="font-headline text-5xl sm:text-6xl">
                            Goes well with
                        </h2>
                        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                            {pairs.map((pair) => (
                                <GearCard key={pair.slug} item={pair} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}

/** the item's photo (or tape tile), with thumbnails to switch between photos when there's more than one */
function Gallery({ item }: { item: Item }) {
    const photos = item.photos ?? [];
    const [active, setActive] = useState(0);

    if (photos.length < 2) return <GearTile item={item} size="lg" decorative={false} eager className="aspect-[4/3]" />;

    return (
        <div>
            <GearTile item={{ ...item, photos: [photos[active]] }} size="lg" decorative={false} eager className="aspect-[4/3]" />
            <div className="mt-3 flex gap-3">
                {photos.map((photo, index) => (
                    <button
                        key={photo}
                        type="button"
                        onClick={() => setActive(index)}
                        aria-label={`Show photo ${index + 1} of ${photos.length}`}
                        aria-pressed={index === active}
                        className={cn('aspect-[4/3] w-24 overflow-hidden border-2 transition-opacity', index === active ? 'border-ink-900' : 'border-transparent opacity-60 hover:opacity-100')}
                    >
                        <Photo photo={photo} sizes="96px" alt="" className="h-full w-full" />
                    </button>
                ))}
            </div>
        </div>
    );
}

/** pick a quantity and add it, or, once it's on the list, change the quantity there */
function AddPanel({ item }: { item: Item }) {
    const { qtyOf, add, setQty, openDrawer } = useGearList();
    const onList = qtyOf(item.slug);
    const [qty, setLocalQty] = useState(1);
    const shelf = `${item.stock} on the shelf`;

    if (onList > 0) {
        return (
            <div className="mt-8">
                <p className="text-sm font-semibold text-navy-700">On your gear list</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                    <QtyStepper value={onList} max={item.stock} onChange={(next) => setQty(item.slug, next)} label={item.name} />
                    <button type="button" onClick={openDrawer} className={buttonClasses({ variant: 'outline', className: 'flex-1 sm:flex-none' })}>
                        Review your list
                    </button>
                </div>
                <p className="mt-3 text-sm text-ink-500">{shelf}</p>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
                <QtyStepper value={qty} max={item.stock} onChange={(next) => setLocalQty(Math.max(1, Math.min(next, item.stock)))} label={item.name} />
                <button
                    type="button"
                    onClick={(event) => {
                        flyToList(event.currentTarget, item.tape);
                        add(item.slug, qty);
                    }}
                    className={buttonClasses({ variant: 'navy', className: 'flex-1 sm:flex-none sm:min-w-56' })}
                >
                    Add to list
                </button>
            </div>
            <p className="mt-3 text-sm text-ink-500">{shelf}</p>
        </div>
    );
}
