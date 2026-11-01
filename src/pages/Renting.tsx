// how renting works, plus the questions people ask before their first rental.
// the process comes from the Google and Facebook listings ("by appointment, just call
// or text", "delivery or pickup in NYC"). the policy answers marked in RESEARCH.md
// are placeholders until Rob confirms how he handles them.
import Seo from '@/components/Seo';
import { ButtonAnchor, ButtonLink } from '@/components/ui/Button';
import Photo from '@/components/ui/Photo';
import Texture from '@/components/ui/Texture';
import { HOURS_SUMMARY, site, smsHref } from '@/data/site';
import { WEEK_BILLED_AS } from '@/lib/rental';

const QUESTIONS: Array<{ q: string; a: string }> = [
    {
        q: 'How do I book?',
        a: 'Add gear to your list on this site, pick your dates and send it to Rob by text. Or skip the site and text him what you’re shooting. He checks the shelf and texts back to confirm the gear, the dates and the price.'
    },
    {
        q: 'When can I pick up?',
        a: `Any day, by appointment. ${HOURS_SUMMARY} Early call time? Ask about picking up the night before.`
    },
    {
        q: 'Do you deliver?',
        a: 'Yes, anywhere in NYC. Delivery is quoted with your list, based on where it’s going and how much gear there is.'
    },
    {
        q: 'How is a rental day counted?',
        a: `A day runs from pickup to the same time the next day. A full week is billed as ${WEEK_BILLED_AS} days, and a five- or six-day rental never costs more than a week.`
    },
    {
        q: 'Do I need insurance?',
        a: 'For bigger orders Rob may ask for a certificate of insurance or a deposit. Send your list and he’ll tell you what it needs before you pick up.'
    },
    {
        q: 'Can you help me figure out what I need?',
        a: 'That’s most of the job. Tell Rob what you’re shooting, where, and with how many people, and he’ll suggest a kit: lenses, adapters, lighting, sound, the works.'
    },
    {
        q: 'What if something breaks?',
        a: 'Tell Rob right away, before the next renter finds out the hard way. Damage and loss are handled case by case. The best policy is the one on the Facebook page: don’t break it.'
    }
];

export default function Renting() {
    return (
        <>
            <Seo pageId="renting" />

            <header className="relative overflow-hidden">
                <Texture kind="folds" />
                <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-10 sm:px-6 lg:pt-16">
                    <h1 className="font-headline text-7xl sm:text-8xl">How renting works</h1>
                    <p className="mt-4 max-w-xl text-lg text-ink-700">
                        Send a list. Rob texts back to confirm. Pick up on {site.address.street} or get it delivered.
                    </p>
                </div>
            </header>

            <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:pb-20">
                <div className="grid gap-4 sm:grid-cols-2">
                    <figure>
                        <Photo photo="cameraRig" sizes="(min-width: 640px) 50vw, 100vw" className="aspect-[4/3] w-full" />
                        <figcaption className="mt-3 text-sm text-ink-500">A rigged Sony with a G Master zoom, on sticks.</figcaption>
                    </figure>
                    <figure>
                        <Photo photo="blackmagic6k" sizes="(min-width: 640px) 50vw, 100vw" className="aspect-[4/3] w-full" />
                        <figcaption className="mt-3 text-sm text-ink-500">The Pocket 6K and a Canon 16-35, cased up.</figcaption>
                    </figure>
                </div>
            </section>

            <section aria-labelledby="faq-title" className="border-t border-paper-300 bg-paper-200/60">
                <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.6fr] lg:gap-20 lg:py-24">
                    <div>
                        <h2 id="faq-title" className="font-headline text-6xl">
                            Questions
                        </h2>
                        <p className="mt-4 max-w-xs text-ink-600">Anything else, text Rob.</p>
                        <ButtonAnchor href={smsHref()} variant="outline" className="mt-7">
                            Text {site.phone.display}
                        </ButtonAnchor>
                    </div>
                    <div className="border-t border-ink-900">
                        {QUESTIONS.map(({ q, a }) => (
                            <details key={q} className="group border-b border-paper-400">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-xl font-semibold [&::-webkit-details-marker]:hidden">
                                    {q}
                                    <span aria-hidden="true" className="font-mono text-2xl font-normal text-ink-500 transition-transform duration-200 group-open:rotate-45">
                                        +
                                    </span>
                                </summary>
                                <p className="max-w-2xl pb-7 text-lg leading-relaxed text-ink-700">{a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-20 sm:px-6 md:flex-row md:items-center md:justify-between">
                <p className="max-w-xl font-headline text-5xl sm:text-6xl">Ready when you are.</p>
                <div className="flex flex-wrap gap-3">
                    <ButtonLink to="/gear" size="lg">
                        Browse the gear
                    </ButtonLink>
                    <ButtonAnchor href={smsHref('Hi Rob, I’m shooting ')} variant="outline" size="lg">
                        Text Rob
                    </ButtonAnchor>
                </div>
            </section>
        </>
    );
}
