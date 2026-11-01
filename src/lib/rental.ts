// the math behind the gear list: rental days, billed days, the estimate,
// and the text message the list turns into when someone sends it to Rob.
import { getGear, type GearItem } from '@/data/gear';
import { site } from '@/data/site';

/**
 * how a week is billed. NYC rental houses usually charge a 3- or 4-day week.
 * PLACEHOLDER: confirm Rob's rule. change it here and the site follows
 */
export const WEEK_BILLED_AS = 4;

export type ListLine = { slug: string; qty: number };
export type Fulfillment = 'pickup' | 'delivery';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export function formatMoney(dollars: number): string {
    return money.format(dollars);
}

// --- dates. kept as 'YYYY-MM-DD' strings (what <input type="date"> uses) and
// read as UTC noon, so daylight saving never shifts a day

function parse(iso: string): Date {
    return new Date(`${iso}T12:00:00Z`);
}

export function isIsoDate(value: unknown): value is string {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(parse(value).getTime());
}

/** today in New York, where the gear is */
export function todayIso(): string {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

export function addDays(iso: string, days: number): string {
    const date = parse(iso);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string): number {
    return Math.round((parse(to).getTime() - parse(from).getTime()) / 86_400_000);
}

const dateLabel = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });

export function formatDate(iso: string): string {
    return dateLabel.format(parse(iso));
}

/** pickup to return. same-day and next-day returns both count as one day */
export function rentalDays(pickup: string, ret: string): number {
    return Math.max(1, daysBetween(pickup, ret));
}

/** a full week costs WEEK_BILLED_AS days, and a 5- or 6-day rental never costs more than a week */
export function billedDays(days: number): number {
    const weeks = Math.floor(days / 7);
    const rest = days % 7;
    return weeks * WEEK_BILLED_AS + Math.min(rest, WEEK_BILLED_AS);
}

export type DatesCheck = { ok: true; days: number; billed: number } | { ok: false; problem: string | null };

export function checkDates(pickup: string | null, ret: string | null, today: string | null): DatesCheck {
    if (!pickup || !ret) return { ok: false, problem: null };
    if (today && pickup < today) return { ok: false, problem: 'Pickup can’t be in the past.' };
    if (ret < pickup) return { ok: false, problem: 'Return comes after pickup.' };
    const days = rentalDays(pickup, ret);
    return { ok: true, days, billed: billedDays(days) };
}

// --- the list itself

export type ResolvedLine = ListLine & { item: GearItem; lineDay: number };

/** pairs each line with its catalog entry, dropping anything no longer in the catalog */
export function resolveLines(lines: ListLine[]): ResolvedLine[] {
    return lines.flatMap((line) => {
        const item = getGear(line.slug);
        return item ? [{ ...line, item, lineDay: item.dayRate * line.qty }] : [];
    });
}

export function perDayTotal(lines: ListLine[]): number {
    return resolveLines(lines).reduce((sum, line) => sum + line.lineDay, 0);
}

// --- the message sent to Rob

export type RequestDetails = {
    name: string;
    phone: string;
    email: string;
    project: string;
    address: string;
    notes: string;
};

export function buildRequestMessage(input: {
    lines: ListLine[];
    pickup: string;
    ret: string;
    fulfillment: Fulfillment;
    details: RequestDetails;
}): string {
    const { lines, pickup, ret, fulfillment, details } = input;
    const resolved = resolveLines(lines);
    const days = rentalDays(pickup, ret);
    const billed = billedDays(days);
    const perDay = perDayTotal(lines);

    const who = details.project.trim() ? `${details.name.trim()} (${details.project.trim()})` : details.name.trim();
    const dayWord = (n: number) => `${n} ${n === 1 ? 'day' : 'days'}`;

    const rows = [
        `Hi Rob, gear request from ${who}.`,
        '',
        `Pickup: ${formatDate(pickup)}`,
        `Return: ${formatDate(ret)}`,
        `${dayWord(days)}${billed !== days ? `, billed as ${dayWord(billed)}` : ''}`,
        fulfillment === 'delivery' ? `Delivery to: ${details.address.trim()}` : `Pickup at ${site.address.street}`,
        '',
        ...resolved.map((line) => `${line.qty} × ${line.item.name}`),
        '',
        `Estimate: ${formatMoney(perDay * billed)} (${formatMoney(perDay)}/day before tax${fulfillment === 'delivery' ? ' and delivery' : ''})`,
        '',
        `Phone: ${details.phone.trim()}`
    ];

    if (details.email.trim()) rows.push(`Email: ${details.email.trim()}`);
    if (details.notes.trim()) rows.push('', `Notes: ${details.notes.trim()}`);

    return rows.join('\n');
}
