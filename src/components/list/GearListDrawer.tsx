// the gear list, sliding in from the right. a real <dialog>, so the browser
// handles focus, Escape and keeping the page behind it inert.
import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import GearTile from '@/components/gear/GearTile';
import QtyStepper from '@/components/gear/QtyStepper';
import { useGearList } from '@/components/list/GearListContext';
import GoesWith from '@/components/list/GoesWith';
import { buttonClasses } from '@/components/ui/Button';
import { formatMoney, resolveLines } from '@/lib/rental';

export default function GearListDrawer() {
    const { lines, count, perDay, drawerOpen, closeDrawer, setQty, remove } = useGearList();
    const dialog = useRef<HTMLDialogElement>(null);
    const resolved = resolveLines(lines);

    useEffect(() => {
        const node = dialog.current;
        if (!node) return;
        if (drawerOpen && !node.open) node.showModal();
        if (!drawerOpen && node.open) node.close();
    }, [drawerOpen]);

    return (
        // clicks on the dimmed backdrop land on the dialog itself; Escape is handled by the browser
        // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
        <dialog
            ref={dialog}
            aria-labelledby="drawer-title"
            onClose={closeDrawer}
            onClick={(event) => {
                if (event.target === event.currentTarget) closeDrawer();
            }}
            className="drawer m-0 ml-auto h-dvh max-h-dvh w-full max-w-[28rem] bg-paper-50 text-ink-900 open:animate-drawer-in"
        >
            <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-paper-300 px-6 py-5">
                    <h2 id="drawer-title" className="font-headline text-4xl">
                        Your gear list
                    </h2>
                    <button type="button" onClick={closeDrawer} className="text-sm font-semibold underline decoration-1 underline-offset-4 hover:decoration-2">
                        Close
                    </button>
                </div>

                {resolved.length === 0 ? (
                    <div className="flex flex-1 flex-col items-start justify-center gap-5 px-6">
                        <p className="text-lg leading-relaxed text-ink-700">Nothing on it yet. Add gear from the catalog and it collects here, ready to send to Rob.</p>
                        <Link to="/gear" onClick={closeDrawer} className={buttonClasses({ variant: 'navy' })}>
                            Browse the gear
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto px-6">
                        <ul className="divide-y divide-paper-300">
                            {resolved.map(({ item, qty, lineDay }) => (
                                <li key={item.slug} className="flex gap-4 py-5">
                                    <GearTile item={item} size="sm" className="aspect-[4/3] w-24 shrink-0" />
                                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                                        <div className="flex items-baseline justify-between gap-3">
                                            <Link to={`/gear/${item.slug}`} onClick={closeDrawer} className="leading-snug font-semibold hover:underline">
                                                {item.name}
                                            </Link>
                                            <span className="shrink-0 font-mono text-sm tabular-nums">{formatMoney(lineDay)}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <QtyStepper value={qty} max={item.stock} onChange={(next) => setQty(item.slug, next)} label={item.name} size="sm" />
                                            <button type="button" onClick={() => remove(item.slug)} className="text-sm text-ink-500 underline decoration-1 underline-offset-4 hover:text-ink-900">
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <GoesWith inDrawer onNavigate={closeDrawer} className="border-t border-ink-900 pt-5 pb-4" />
                        </div>

                        <div className="border-t border-paper-300 bg-paper-100 px-6 py-6">
                            <div className="flex items-baseline justify-between">
                                <span className="text-ink-600">
                                    {count} {count === 1 ? 'piece' : 'pieces'}
                                </span>
                                <span className="font-mono text-xl tabular-nums">
                                    {formatMoney(perDay)}
                                    <span className="text-base text-ink-500">/day</span>
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-ink-500">Pick your dates on the next page to see the full estimate.</p>
                            <Link to="/list" onClick={closeDrawer} className={buttonClasses({ variant: 'navy', className: 'mt-5 w-full' })}>
                                Choose dates and send
                            </Link>
                            <button type="button" onClick={closeDrawer} className="mt-3 w-full py-2 text-sm font-semibold text-ink-700 hover:text-ink-900">
                                Keep browsing
                            </button>
                        </div>
                    </>
                )}
            </div>
        </dialog>
    );
}
