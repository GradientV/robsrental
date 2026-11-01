// the gear list (the site's "cart"): what's on it, the rental dates, pickup or delivery,
// plus the drawer and the "added" toast that every page shares.
//
// it's saved to localStorage so a reload doesn't lose it. nothing leaves the browser
// until the renter sends the list to Rob themselves, by text or email.
import { createContext, use, useCallback, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { getGear } from '@/data/gear';
import { isIsoDate, perDayTotal, type Fulfillment, type ListLine } from '@/lib/rental';
import { readJson, writeJson } from '@/lib/storage';

const STORAGE_KEY = 'robs-rentals:gear-list:v1';

type ListState = {
    lines: ListLine[];
    pickup: string | null;
    ret: string | null;
    fulfillment: Fulfillment;
};

const EMPTY: ListState = { lines: [], pickup: null, ret: null, fulfillment: 'pickup' };

type Action =
    | { type: 'add'; slug: string; qty: number }
    | { type: 'setQty'; slug: string; qty: number }
    | { type: 'remove'; slug: string }
    | { type: 'clear' }
    | { type: 'dates'; pickup: string | null; ret: string | null }
    | { type: 'fulfillment'; value: Fulfillment }
    | { type: 'load'; state: ListState };

/** never more than Rob has on the shelf */
function capped(slug: string, qty: number): number {
    const stock = getGear(slug)?.stock ?? 1;
    return Math.max(0, Math.min(Math.floor(qty), stock));
}

function reducer(state: ListState, action: Action): ListState {
    switch (action.type) {
        case 'add': {
            const existing = state.lines.find((line) => line.slug === action.slug);
            const lines = existing
                ? state.lines.map((line) => (line.slug === action.slug ? { ...line, qty: capped(line.slug, line.qty + action.qty) } : line))
                : [...state.lines, { slug: action.slug, qty: capped(action.slug, action.qty) }];
            return { ...state, lines };
        }
        case 'setQty': {
            const qty = capped(action.slug, action.qty);
            const lines = qty < 1 ? state.lines.filter((line) => line.slug !== action.slug) : state.lines.map((line) => (line.slug === action.slug ? { ...line, qty } : line));
            return { ...state, lines };
        }
        case 'remove':
            return { ...state, lines: state.lines.filter((line) => line.slug !== action.slug) };
        case 'clear':
            return EMPTY;
        case 'dates':
            return { ...state, pickup: action.pickup, ret: action.ret };
        case 'fulfillment':
            return { ...state, fulfillment: action.value };
        case 'load':
            return action.state;
    }
}

/** whatever is in storage, made safe: unknown items and broken values are dropped */
function sanitize(raw: unknown): ListState {
    if (!raw || typeof raw !== 'object') return EMPTY;
    const value = raw as Partial<Record<keyof ListState, unknown>>;
    const lines = Array.isArray(value.lines)
        ? value.lines.flatMap((line: unknown) => {
              if (!line || typeof line !== 'object') return [];
              const { slug, qty } = line as { slug?: unknown; qty?: unknown };
              if (typeof slug !== 'string' || !getGear(slug) || typeof qty !== 'number') return [];
              const safe = capped(slug, qty);
              return safe > 0 ? [{ slug, qty: safe }] : [];
          })
        : [];
    return {
        lines,
        pickup: isIsoDate(value.pickup) ? value.pickup : null,
        ret: isIsoDate(value.ret) ? value.ret : null,
        fulfillment: value.fulfillment === 'delivery' ? 'delivery' : 'pickup'
    };
}

export type Toast = { id: number; text: string };

type GearListValue = ListState & {
    /** false until the saved list has been read back (and always false in the prerendered HTML) */
    ready: boolean;
    /** pieces of gear on the list (two C-stands count twice) */
    count: number;
    perDay: number;
    qtyOf: (slug: string) => number;
    /** quiet: no toast (the drawer is open and the list is right there) */
    add: (slug: string, qty?: number, quiet?: boolean) => void;
    /** a whole set at once, with one toast for all of it */
    addMany: (lines: ListLine[], label: string) => void;
    setQty: (slug: string, qty: number) => void;
    remove: (slug: string) => void;
    clear: () => void;
    setDates: (pickup: string | null, ret: string | null) => void;
    setFulfillment: (value: Fulfillment) => void;

    drawerOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;

    toast: Toast | null;
    dismissToast: () => void;
    /** read out by the live region in the layout */
    announcement: string;
};

const GearListContext = createContext<GearListValue | null>(null);

export function GearListProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, EMPTY);
    // true once the saved list has been read back. saving waits for it, so the
    // empty starting list never overwrites what was saved
    const [ready, setReady] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [toast, setToast] = useState<Toast | null>(null);
    const [announcement, setAnnouncement] = useState('');

    // read the saved list after the first render, so the prerendered page and
    // the browser's first pass both start from an empty list
    useEffect(() => {
        dispatch({ type: 'load', state: sanitize(readJson<unknown>(STORAGE_KEY, null)) });
        // syncing from localStorage (an outside system) after hydration is what effects are for
        // oxlint-disable-next-line react/set-state-in-effect
        setReady(true);
    }, []);

    useEffect(() => {
        if (ready) writeJson(STORAGE_KEY, state);
    }, [state, ready]);

    // the toast goes away on its own after a few seconds
    useEffect(() => {
        if (!toast) return;
        const timer = window.setTimeout(() => setToast(null), 4200);
        return () => window.clearTimeout(timer);
    }, [toast]);

    const add = useCallback((slug: string, qty = 1, quiet = false) => {
        dispatch({ type: 'add', slug, qty });
        const text = `${qty > 1 ? `${qty} × ` : ''}${getGear(slug)?.name ?? 'Item'}`;
        if (!quiet) setToast({ id: Date.now(), text });
        setAnnouncement(`Added to your gear list: ${text}`);
    }, []);

    const addMany = useCallback((lines: ListLine[], label: string) => {
        for (const line of lines) dispatch({ type: 'add', slug: line.slug, qty: line.qty });
        setToast({ id: Date.now(), text: label });
        setAnnouncement(`Added to your gear list: ${label}`);
    }, []);

    const setQty = useCallback((slug: string, qty: number) => dispatch({ type: 'setQty', slug, qty }), []);

    const remove = useCallback((slug: string) => {
        dispatch({ type: 'remove', slug });
        setAnnouncement(`Removed ${getGear(slug)?.name ?? 'item'} from your gear list`);
    }, []);

    const clear = useCallback(() => {
        dispatch({ type: 'clear' });
        setAnnouncement('Your gear list is empty');
    }, []);

    const setDates = useCallback((pickup: string | null, ret: string | null) => dispatch({ type: 'dates', pickup, ret }), []);
    const setFulfillment = useCallback((value: Fulfillment) => dispatch({ type: 'fulfillment', value }), []);
    const openDrawer = useCallback(() => {
        setToast(null);
        setDrawerOpen(true);
    }, []);
    const closeDrawer = useCallback(() => setDrawerOpen(false), []);
    const dismissToast = useCallback(() => setToast(null), []);

    const value = useMemo<GearListValue>(() => {
        const qtyBySlug = new Map(state.lines.map((line) => [line.slug, line.qty]));
        return {
            ...state,
            ready,
            count: state.lines.reduce((sum, line) => sum + line.qty, 0),
            perDay: perDayTotal(state.lines),
            qtyOf: (slug) => qtyBySlug.get(slug) ?? 0,
            add,
            addMany,
            setQty,
            remove,
            clear,
            setDates,
            setFulfillment,
            drawerOpen,
            openDrawer,
            closeDrawer,
            toast,
            dismissToast,
            announcement
        };
    }, [state, ready, add, addMany, setQty, remove, clear, setDates, setFulfillment, drawerOpen, openDrawer, closeDrawer, toast, dismissToast, announcement]);

    return <GearListContext value={value}>{children}</GearListContext>;
}

export function useGearList(): GearListValue {
    const value = use(GearListContext);
    if (!value) throw new Error('useGearList needs a <GearListProvider> above it');
    return value;
}
