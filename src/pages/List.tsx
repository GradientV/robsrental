// /list: the gear list with dates, pickup or delivery, a running estimate, and the
// renter's details. there's no server: "sending" writes the request up as a text
// message (or email) the renter sends to Rob from their own phone.
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router';
import GearTile from '@/components/gear/GearTile';
import QtyStepper from '@/components/gear/QtyStepper';
import { useGearList } from '@/components/list/GearListContext';
import GoesWith from '@/components/list/GoesWith';
import Seo from '@/components/Seo';
import { ButtonAnchor, ButtonLink, buttonClasses } from '@/components/ui/Button';
import Texture from '@/components/ui/Texture';
import { site, smsHref } from '@/data/site';
import { useHydrated } from '@/hooks/useHydrated';
import { cn } from '@/lib/cn';
import { addDays, buildRequestMessage, checkDates, formatDate, formatMoney, resolveLines, todayIso, WEEK_BILLED_AS, type RequestDetails } from '@/lib/rental';

const EMPTY_DETAILS: RequestDetails = { name: '', phone: '', email: '', project: '', address: '', notes: '' };

type Errors = Partial<Record<keyof RequestDetails | 'dates', string>>;

const inputClass = 'mt-2 h-12 w-full border border-ink-900/25 bg-paper-50 px-4 text-base placeholder:text-ink-400 focus:border-ink-900 focus:outline-none aria-[invalid=true]:border-red-700';

export default function List() {
    const list = useGearList();
    const hydrated = useHydrated();
    const today = hydrated ? todayIso() : null;
    const resolved = resolveLines(list.lines);

    const [details, setDetails] = useState<RequestDetails>(EMPTY_DETAILS);
    const [errors, setErrors] = useState<Errors>({});
    const [message, setMessage] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const readyPanel = useRef<HTMLDivElement>(null);

    const dates = checkDates(list.pickup, list.ret, today);
    const estimate = dates.ok ? list.perDay * dates.billed : null;

    // a change to the list after it was written up means the write-up is stale
    useEffect(() => {
        // oxlint-disable-next-line react/set-state-in-effect
        setMessage(null);
    }, [list.lines, list.pickup, list.ret, list.fulfillment]);

    useEffect(() => {
        if (message) readyPanel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [message]);

    const update = (field: keyof RequestDetails) => (value: string) => {
        setDetails((current) => ({ ...current, [field]: value }));
        if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    };

    function submit(event: FormEvent) {
        event.preventDefault();
        const next: Errors = {};
        if (!dates.ok) next.dates = dates.problem ?? 'Pick a pickup and a return date.';
        if (!details.name.trim()) next.name = 'Your name, so Rob knows who’s asking.';
        if (details.phone.replace(/\D/g, '').length < 10) next.phone = 'A phone number Rob can text back.';
        if (details.email.trim() && !/^\S+@\S+\.\S+$/.test(details.email.trim())) next.email = 'That email doesn’t look right.';
        if (list.fulfillment === 'delivery' && !details.address.trim()) next.address = 'Where should the gear go?';
        setErrors(next);
        if (Object.keys(next).length > 0 || !list.pickup || !list.ret) {
            const first = Object.keys(next)[0];
            document.getElementById(first === 'dates' ? 'pickup' : `field-${first}`)?.focus();
            return;
        }
        setMessage(buildRequestMessage({ lines: list.lines, pickup: list.pickup, ret: list.ret, fulfillment: list.fulfillment, details }));
        setCopied(false);
    }

    async function copy() {
        if (!message) return;
        try {
            await navigator.clipboard.writeText(message);
            setCopied(true);
        } catch {
            setCopied(false);
        }
    }

    return (
        <>
            <Seo pageId="list" />

            <header className="relative overflow-hidden border-b border-paper-300">
                <Texture kind="folds" />
                <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-10 sm:px-6 lg:pt-16">
                    <h1 className="font-headline text-7xl sm:text-8xl">Your gear list</h1>
                    <p className="mt-4 text-lg text-ink-700">Pick your dates and send it to Rob. He texts back to confirm.</p>
                </div>
            </header>

            {!list.ready ? (
                <div className="mx-auto max-w-7xl px-4 py-24 text-ink-500 sm:px-6">Loading your list…</div>
            ) : resolved.length === 0 ? (
                <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
                    <p className="font-headline text-5xl">Nothing on it yet</p>
                    <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink-700">Add gear from the catalog and it shows up here. Or skip the list and just text Rob what you’re shooting.</p>
                    <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                        <ButtonLink to="/gear">Browse the gear</ButtonLink>
                        <a href={smsHref('Hi Rob, I’m shooting ')} className="font-semibold underline underline-offset-[5px]">
                            Text Rob instead
                        </a>
                    </div>
                </div>
            ) : (
                <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:gap-16 lg:py-16">
                    <div className="min-w-0 space-y-14">
                        <Step title="Dates">
                            <DatePickers today={today} error={errors.dates} onPicked={() => setErrors((current) => ({ ...current, dates: undefined }))} />
                        </Step>

                        <Step title="Pickup or delivery">
                            <fieldset>
                                <legend className="sr-only">Pickup or delivery</legend>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Choice
                                        checked={list.fulfillment === 'pickup'}
                                        onChange={() => list.setFulfillment('pickup')}
                                        title="Pickup in Bushwick"
                                        body={`${site.address.street}, by appointment. Rob texts you a time.`}
                                    />
                                    <Choice
                                        checked={list.fulfillment === 'delivery'}
                                        onChange={() => list.setFulfillment('delivery')}
                                        title="Delivery in NYC"
                                        body="Anywhere in the five boroughs. Rob quotes delivery with your list."
                                    />
                                </div>
                            </fieldset>
                        </Step>

                        <Step title="The gear" aside={<Link to="/gear" className="text-sm font-semibold underline underline-offset-4">Add more</Link>}>
                            <ul className="divide-y divide-paper-300 border-y border-paper-300">
                                {resolved.map(({ item, qty, lineDay }) => (
                                    <li key={item.slug} className="flex gap-4 py-5 sm:gap-6">
                                        <Link to={`/gear/${item.slug}`} tabIndex={-1} aria-hidden="true" className="shrink-0">
                                            <GearTile item={item} size="sm" className="aspect-[4/3] w-24 sm:w-32" />
                                        </Link>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-baseline justify-between gap-4">
                                                <Link to={`/gear/${item.slug}`} className="leading-snug font-semibold hover:underline">
                                                    {item.name}
                                                </Link>
                                                <span className="shrink-0 font-mono tabular-nums">{formatMoney(dates.ok ? lineDay * dates.billed : lineDay)}</span>
                                            </div>
                                            <p className="mt-1 font-mono text-sm text-ink-500 tabular-nums">{formatMoney(item.dayRate)}/day</p>
                                            <div className="mt-3 flex items-center gap-5">
                                                <QtyStepper value={qty} max={item.stock} onChange={(next) => list.setQty(item.slug, next)} label={item.name} size="sm" />
                                                <button type="button" onClick={() => list.remove(item.slug)} className="text-sm text-ink-500 underline underline-offset-4 hover:text-ink-900">
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-3 text-sm text-ink-500">{dates.ok ? `Line totals are for ${dates.billed} billed ${dates.billed === 1 ? 'day' : 'days'}.` : 'Line totals are per day until you pick dates.'}</p>
                            <GoesWith className="mt-8 border border-paper-300 bg-paper-50 px-5 pt-4 pb-1" />
                        </Step>
                    </div>

                    <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start" aria-label="Estimate and your details">
                        <div className="bg-ink-900 p-6 text-paper-50 sm:p-7">
                            <h2 className="font-headline text-4xl">Estimate</h2>
                            <dl className="mt-5 space-y-3 text-[0.95rem]">
                                <Row term="Gear per day" detail={formatMoney(list.perDay)} />
                                <Row
                                    term="Rental"
                                    detail={dates.ok ? `${dates.days} ${dates.days === 1 ? 'day' : 'days'}${dates.billed !== dates.days ? `, billed ${dates.billed}` : ''}` : 'Pick dates'}
                                />
                                {list.fulfillment === 'delivery' && <Row term="Delivery" detail="Quoted by Rob" />}
                            </dl>
                            <div className="mt-5 flex items-baseline justify-between border-t border-ink-700 pt-5">
                                <span className="text-ink-300">Estimated total</span>
                                <span className="font-mono text-3xl tabular-nums">{estimate === null ? '—' : formatMoney(estimate)}</span>
                            </div>
                            <p className="mt-4 text-sm leading-relaxed text-ink-400">
                                Before tax{list.fulfillment === 'delivery' ? ' and delivery' : ''}. A full week is billed as {WEEK_BILLED_AS} days. Rob confirms availability and the final price.
                            </p>
                        </div>

                        {message ? (
                            <div ref={readyPanel} className="scroll-mt-28 border border-t-0 border-paper-300 bg-paper-50 p-6 sm:p-7">
                                <h2 className="font-headline text-4xl">Ready to send</h2>
                                <p className="mt-3 leading-relaxed text-ink-700">Here’s your request, written up. Send it by text and Rob replies to confirm. Nothing goes out until you hit send.</p>
                                <pre className="mt-5 max-h-80 overflow-auto bg-paper-200 p-4 font-mono text-[0.8125rem] leading-relaxed whitespace-pre-wrap text-ink-800">{message}</pre>
                                <ButtonAnchor href={smsHref(message)} className="mt-5 w-full">
                                    Text it to Rob
                                </ButtonAnchor>
                                <div className="mt-3 grid grid-cols-2 gap-3">
                                    <ButtonAnchor
                                        href={`mailto:${site.email}?subject=${encodeURIComponent(`Gear request: ${details.name.trim()}`)}&body=${encodeURIComponent(message)}`}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Email it instead
                                    </ButtonAnchor>
                                    <button type="button" onClick={copy} className={buttonClasses({ variant: 'outline', size: 'sm' })}>
                                        {copied ? 'Copied' : 'Copy the text'}
                                    </button>
                                </div>
                                <button type="button" onClick={() => setMessage(null)} className="mt-5 text-sm font-semibold text-ink-600 underline underline-offset-4 hover:text-ink-900">
                                    Edit your details
                                </button>
                            </div>
                        ) : (
                            <form noValidate onSubmit={submit} className="border border-t-0 border-paper-300 bg-paper-50 p-6 sm:p-7">
                                <h2 className="font-headline text-4xl">Your details</h2>
                                <div className="mt-5 space-y-5">
                                    <Field id="name" label="Name" required value={details.name} onChange={update('name')} error={errors.name} autoComplete="name" />
                                    <Field id="phone" label="Phone" required type="tel" value={details.phone} onChange={update('phone')} error={errors.phone} autoComplete="tel" placeholder="So Rob can text you back" />
                                    <Field id="email" label="Email" type="email" value={details.email} onChange={update('email')} error={errors.email} autoComplete="email" />
                                    <Field id="project" label="Production or company" value={details.project} onChange={update('project')} />
                                    {list.fulfillment === 'delivery' && (
                                        <Field id="address" label="Delivery address" required value={details.address} onChange={update('address')} error={errors.address} autoComplete="street-address" />
                                    )}
                                    <TextArea id="notes" label="Anything else" value={details.notes} onChange={update('notes')} placeholder="What you’re shooting, call times, questions about the gear" />
                                </div>
                                <button type="submit" className={buttonClasses({ variant: 'navy', size: 'lg', className: 'mt-7 w-full' })}>
                                    Write up my request
                                </button>
                                <p className="mt-3 text-center text-sm text-ink-500">Next you’ll see the message before anything is sent.</p>
                            </form>
                        )}
                    </aside>
                </div>
            )}
        </>
    );
}

function Step({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
    return (
        <section>
            <div className="flex items-baseline justify-between border-t border-ink-900 pt-5">
                <h2 className="font-headline text-4xl sm:text-5xl">{title}</h2>
                {aside}
            </div>
            <div className="mt-6">{children}</div>
        </section>
    );
}

function DatePickers({ today, error, onPicked }: { today: string | null; error?: string; onPicked: () => void }) {
    const { pickup, ret, setDates } = useGearList();
    const check = checkDates(pickup, ret, today);
    const problem = error ?? (check.ok ? null : check.problem);

    const pickPickup = (value: string) => {
        const next = value || null;
        // keep the return date after the pickup date; default it to the next day
        const nextReturn = next && (!ret || ret < next) ? addDays(next, 1) : ret;
        setDates(next, nextReturn);
        onPicked();
    };

    return (
        <div>
            <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                    <span className="text-sm font-semibold text-ink-800">Pickup</span>
                    <input id="pickup" type="date" value={pickup ?? ''} min={today ?? undefined} onChange={(event) => pickPickup(event.target.value)} aria-invalid={Boolean(problem)} className={inputClass} />
                </label>
                <label className="block">
                    <span className="text-sm font-semibold text-ink-800">Return</span>
                    <input
                        type="date"
                        value={ret ?? ''}
                        min={pickup ?? today ?? undefined}
                        onChange={(event) => {
                            setDates(pickup, event.target.value || null);
                            onPicked();
                        }}
                        aria-invalid={Boolean(problem)}
                        className={inputClass}
                    />
                </label>
            </div>
            <p className={cn('mt-3 text-sm', problem ? 'text-red-700' : 'text-ink-600')} role={problem ? 'alert' : undefined}>
                {problem ??
                    (check.ok && pickup && ret
                        ? `${formatDate(pickup)} to ${formatDate(ret)}: ${check.days} ${check.days === 1 ? 'day' : 'days'}${check.billed !== check.days ? `, billed as ${check.billed}` : ''}.`
                        : 'A rental day runs from pickup to the same time the next day.')}
            </p>
        </div>
    );
}

function Choice({ checked, onChange, title, body }: { checked: boolean; onChange: () => void; title: string; body: string }) {
    return (
        // the label's text is the title and body below; the rule can't see through the props
        // oxlint-disable-next-line jsx-a11y/label-has-associated-control
        <label className={cn('flex cursor-pointer gap-4 border p-5 transition-colors', checked ? 'border-ink-900 bg-paper-50' : 'border-paper-300 hover:border-ink-500')}>
            <input type="radio" name="fulfillment" checked={checked} onChange={onChange} className="mt-1 h-4 w-4 shrink-0 accent-navy-700" />
            <span>
                <span className="block font-semibold">{title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-600">{body}</span>
            </span>
        </label>
    );
}

function Row({ term, detail }: { term: string; detail: string }) {
    return (
        <div className="flex items-baseline justify-between gap-4">
            <dt className="text-ink-300">{term}</dt>
            <dd className="font-mono tabular-nums">{detail}</dd>
        </div>
    );
}

type FieldProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    type?: string;
    autoComplete?: string;
    placeholder?: string;
};

function Field({ id, label, value, onChange, error, required, type = 'text', autoComplete, placeholder }: FieldProps) {
    const errorId = useId();
    return (
        <label className="block">
            <span className="text-sm font-semibold text-ink-800">
                {label}
                {required ? '' : <span className="font-normal text-ink-500"> (optional)</span>}
            </span>
            <input
                id={`field-${id}`}
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                autoComplete={autoComplete}
                placeholder={placeholder}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                aria-required={required}
                className={inputClass}
            />
            {error && (
                <span id={errorId} className="mt-1.5 block text-sm text-red-700">
                    {error}
                </span>
            )}
        </label>
    );
}

function TextArea({ id, label, value, onChange, placeholder }: Omit<FieldProps, 'error' | 'required' | 'type' | 'autoComplete'>) {
    return (
        <label className="block">
            <span className="text-sm font-semibold text-ink-800">
                {label}
                <span className="font-normal text-ink-500"> (optional)</span>
            </span>
            <textarea
                id={`field-${id}`}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                rows={3}
                className="mt-2 w-full resize-y border border-ink-900/25 bg-paper-50 px-4 py-3 text-base placeholder:text-ink-400 focus:border-ink-900 focus:outline-none"
            />
        </label>
    );
}
