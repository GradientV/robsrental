// the catalog: category tabs, search, sort and the grid of gear. the home page and
// /gear both use it. ?category= in the address picks a tab, so links from the nav
// ("Kits") and item pages land on the right one.
import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import GearCard from '@/components/gear/GearCard';
import KitCard from '@/components/gear/KitCard';
import { CATEGORIES, GEAR, countIn, getCategory, isCategoryId, type CategoryId, type GearItem } from '@/data/gear';
import { smsHref } from '@/data/site';
import { useHydrated } from '@/hooks/useHydrated';
import { cn } from '@/lib/cn';

type Sort = 'featured' | 'low' | 'high' | 'name';

const SORTS: Array<{ value: Sort; label: string }> = [
    { value: 'featured', label: 'Featured first' },
    { value: 'low', label: 'Day rate, low to high' },
    { value: 'high', label: 'Day rate, high to low' },
    { value: 'name', label: 'Name, A to Z' }
];

function sortItems(items: GearItem[], sort: Sort): GearItem[] {
    const copy = [...items];
    if (sort === 'featured') copy.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    if (sort === 'low') copy.sort((a, b) => a.dayRate - b.dayRate);
    if (sort === 'high') copy.sort((a, b) => b.dayRate - a.dayRate);
    if (sort === 'name') copy.sort((a, b) => a.name.localeCompare(b.name));
    return copy;
}

function matches(item: GearItem, query: string): boolean {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const haystack = [item.name, item.brand, item.tape, item.summary, getCategory(item.category).label, ...item.includes].join(' ').toLowerCase();
    return words.every((word) => haystack.includes(word));
}

const selectArrow = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%23141518' stroke-width='1.4'/%3E%3C/svg%3E\")";

type Props = {
    /** show this many in "All gear" until someone asks for the rest (the home page) */
    limit?: number;
};

export default function Catalog({ limit }: Props) {
    const hydrated = useHydrated();
    const [params, setParams] = useSearchParams();
    // the prerendered page is always "all gear"; the address is read once the browser takes over
    const requested = hydrated ? params.get('category') : null;
    const category: CategoryId | null = isCategoryId(requested) ? requested : null;

    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<Sort>('featured');
    const [expanded, setExpanded] = useState(false);
    const deferredQuery = useDeferredValue(query.trim());
    const searchId = useId();
    const sortId = useId();
    const tabRow = useRef<HTMLUListElement>(null);

    // the tabs scroll sideways on small screens: bring the chosen one into view
    useEffect(() => {
        const row = tabRow.current;
        const active = row?.querySelector<HTMLElement>('[aria-current="true"]');
        if (row && active && row.scrollWidth > row.clientWidth) row.scrollTo({ left: active.offsetLeft - 16, behavior: 'smooth' });
    }, [category]);

    const choose = (next: CategoryId | null) => setParams(next ? { category: next } : {}, { preventScrollReset: true });

    const results = useMemo(() => {
        const inCategory = category ? GEAR.filter((item) => item.category === category) : GEAR;
        const found = deferredQuery ? inCategory.filter((item) => matches(item, deferredQuery)) : inCategory;
        return sortItems(found, sort);
    }, [category, deferredQuery, sort]);

    const capped = Boolean(limit) && !category && !deferredQuery && !expanded && results.length > (limit ?? 0);
    const shown = capped ? results.slice(0, limit) : results;

    const tabs = [{ id: null, label: 'All gear', count: GEAR.length }, ...CATEGORIES.map((c) => ({ id: c.id, label: c.label, count: countIn(c.id) }))];

    return (
        <div>
            <nav aria-label="Categories" className="-mx-4 border-b border-paper-300 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
                <ul ref={tabRow} className="no-scrollbar relative flex gap-7 overflow-x-auto">
                    {tabs.map((tab) => {
                        const active = category === tab.id;
                        return (
                            <li key={tab.id ?? 'all'} className="shrink-0">
                                <button
                                    type="button"
                                    onClick={() => choose(tab.id)}
                                    aria-current={active ? 'true' : undefined}
                                    className={cn(
                                        '-mb-px flex items-baseline gap-2 border-b-2 py-3.5 whitespace-nowrap transition-colors',
                                        active ? 'border-navy-700 font-semibold text-ink-900' : 'border-transparent text-ink-600 hover:text-ink-900'
                                    )}
                                >
                                    {tab.label}
                                    <span className="font-mono text-xs text-ink-400 tabular-nums">{tab.count}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <p className="text-sm text-ink-500 sm:mr-auto" aria-live="polite">
                    {results.length} {results.length === 1 ? 'item' : 'items'}
                    {category ? ` in ${getCategory(category).label.toLowerCase()}` : ''}
                    {deferredQuery ? ` matching “${deferredQuery}”` : ''}
                </p>
                <div className="flex gap-2">
                    <label htmlFor={searchId} className="sr-only">
                        Search the gear
                    </label>
                    <input
                        id={searchId}
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search the gear"
                        className="h-11 min-w-0 flex-1 border border-ink-900/25 bg-paper-50 px-4 text-[0.95rem] placeholder:text-ink-400 focus:border-ink-900 focus:outline-none sm:w-72 sm:flex-none"
                    />
                    <label htmlFor={sortId} className="sr-only">
                        Sort
                    </label>
                    <select
                        id={sortId}
                        value={sort}
                        onChange={(event) => setSort(event.target.value as Sort)}
                        className="h-11 w-36 shrink-0 appearance-none border border-ink-900/25 bg-paper-50 bg-[length:10px] bg-[right_0.875rem_center] bg-no-repeat pr-8 pl-3.5 text-[0.95rem] focus:border-ink-900 focus:outline-none sm:w-52"
                        style={{ backgroundImage: selectArrow }}
                    >
                        {SORTS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {results.length === 0 ? (
                <div className="mt-10 border-t border-paper-300 pt-10">
                    <p className="font-headline text-5xl">Not on the shelf</p>
                    <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink-700">Text Rob anyway. If he doesn’t have it, he usually knows who does.</p>
                    <a href={smsHref(`Hi Rob, do you have ${deferredQuery}?`)} className="mt-6 inline-block font-semibold underline underline-offset-[5px]">
                        Ask Rob about “{deferredQuery}”
                    </a>
                </div>
            ) : category === 'kits' ? (
                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {shown.map((item) => (
                        <KitCard key={item.slug} item={item} tone="light" />
                    ))}
                </div>
            ) : (
                <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {shown.map((item) => (
                        <GearCard key={item.slug} item={item} />
                    ))}
                </div>
            )}

            {capped && (
                <div className="mt-12 flex justify-center">
                    <button
                        type="button"
                        onClick={() => setExpanded(true)}
                        className="h-12 border border-ink-900 px-7 text-[0.95rem] font-semibold transition-colors hover:bg-ink-900 hover:text-paper-50"
                    >
                        Show all {results.length} items
                    </button>
                </div>
            )}
        </div>
    );
}
