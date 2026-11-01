import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import Logo from '@/components/brand/Logo';
import { useGearList } from '@/components/list/GearListContext';
import { nav, site, telHref } from '@/data/site';
import { useHydrated } from '@/hooks/useHydrated';
import { cn } from '@/lib/cn';

/** Gear and Kits share /gear, so "active" looks at ?category= too */
function useIsActive() {
    const { pathname, search } = useLocation();
    const hydrated = useHydrated();
    const kits = hydrated && new URLSearchParams(search).get('category') === 'kits';
    return (to: string) => {
        if (to === '/gear?category=kits') return pathname === '/gear' && kits;
        if (to === '/gear') return pathname.startsWith('/gear') && !kits;
        return pathname === to;
    };
}

export default function Header() {
    const { count, openDrawer } = useGearList();
    const [menuOpen, setMenuOpen] = useState(false);
    const { pathname, search } = useLocation();
    const isActive = useIsActive();

    // close the phone menu whenever the page changes
    useEffect(() => {
        // oxlint-disable-next-line react/set-state-in-effect
        setMenuOpen(false);
    }, [pathname, search]);

    return (
        <>
            <div className="bg-ink-900 text-[0.8125rem] text-paper-200">
                <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
                    <p>
                        By appointment only. Call or text{' '}
                        <a href={telHref} className="font-semibold text-paper-50 underline decoration-paper-50/30 underline-offset-[3px] hover:decoration-paper-50">
                            {site.phone.display}
                        </a>
                    </p>
                    <a href={site.links.googleMaps} target="_blank" rel="noreferrer" className="hidden hover:text-paper-50 sm:block">
                        {site.address.street}, {site.address.neighborhood}
                    </a>
                </div>
            </div>

            <header className="sticky top-0 z-30 border-b border-paper-300 bg-paper-100/95 backdrop-blur-md">
                <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
                    <Link to="/" aria-label="Rob’s Rentals home" className="shrink-0">
                        <Logo />
                    </Link>

                    <nav aria-label="Main" className="hidden md:block">
                        <ul className="flex items-center gap-8">
                            {nav.map((item) => (
                                <li key={item.to}>
                                    <NavLink
                                        to={item.to}
                                        aria-current={isActive(item.to) ? 'page' : undefined}
                                        className={cn(
                                            'relative py-2 text-[0.95rem] font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-ink-900 after:transition-transform',
                                            isActive(item.to) ? 'text-ink-900 after:scale-x-100' : 'text-ink-600 after:scale-x-0 hover:text-ink-900 hover:after:scale-x-100'
                                        )}
                                    >
                                        {item.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={openDrawer}
                            className={cn('flex h-11 items-stretch text-sm font-semibold transition-colors', count > 0 ? 'bg-navy-700 text-paper-50 hover:bg-navy-800' : 'border border-ink-900/80 text-ink-900 hover:bg-ink-900 hover:text-paper-50')}
                        >
                            <span className="grid place-items-center px-4">Gear list</span>
                            <span className={cn('grid min-w-11 place-items-center border-l px-3 font-mono tabular-nums', count > 0 ? 'border-paper-50/25' : 'border-current/30')}>
                                {/* where the tape lands when something's added (src/lib/fly.ts) */}
                                <span data-list-target className="inline-block">
                                    {count}
                                </span>
                            </span>
                            <span className="sr-only">{count === 1 ? 'piece' : 'pieces'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setMenuOpen((open) => !open)}
                            aria-expanded={menuOpen}
                            aria-controls="mobile-menu"
                            className="h-11 px-3 text-sm font-semibold md:hidden"
                        >
                            {menuOpen ? 'Close' : 'Menu'}
                        </button>
                    </div>
                </div>

                {menuOpen && (
                    <nav id="mobile-menu" aria-label="Main" className="border-t border-paper-300 bg-paper-100 md:hidden">
                        <ul className="mx-auto max-w-7xl px-4 py-4">
                            {nav.map((item) => (
                                <li key={item.to}>
                                    <Link to={item.to} className={cn('block py-2.5 font-headline text-5xl', isActive(item.to) ? 'text-navy-700' : 'text-ink-900')}>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="mx-auto max-w-7xl border-t border-paper-300 px-4 py-5 text-sm text-ink-600">
                            Call or text{' '}
                            <a href={telHref} className="font-semibold text-ink-900 underline underline-offset-4">
                                {site.phone.display}
                            </a>
                        </div>
                    </nav>
                )}
            </header>
        </>
    );
}
