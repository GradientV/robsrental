// the home page leads with the catalog: a short headline, then the gear. below it:
// ready-made sets by kind of shoot, the essentials, reviews, and a way to reach Rob.
import { Link } from 'react-router';
import Catalog from '@/components/gear/Catalog';
import ShootPicker from '@/components/gear/ShootPicker';
import Seo from '@/components/Seo';
import { ButtonAnchor, textLink } from '@/components/ui/Button';
import Texture from '@/components/ui/Texture';
import { featuredReview, reviewTags, reviews } from '@/data/reviews';
import { site, smsHref, telHref } from '@/data/site';
import { businessSchema } from '@/lib/schema';

const FACTS: Array<[term: string, detail: string]> = [
    ['Pickup', `${site.address.street}, ${site.address.neighborhood}. By appointment.`],
    ['Delivery', 'Anywhere in NYC.'],
    ['Hours', 'Weekdays 24 hours. Sat 7 AM – 11 PM, Sun 10 AM – 11 PM.'],
    ['Book', `Call or text ${site.phone.display}.`]
];

export default function Home() {
    return (
        <>
            <Seo pageId="home" schema={businessSchema()} />

            {/* the folds run behind the headline and the catalog's tabs, and fade out before the cards */}
            <div className="relative overflow-hidden">
            <Texture kind="folds" className="h-[34rem]" />
            <section className="relative">
                <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 pt-12 pb-8 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:pt-16 lg:pb-10">
                    {/* sized so "Lighting & rigs." (about 4.8 times the font size wide) fits a phone */}
                    <h1 className="font-headline text-[min(calc(20.5vw-8px),5.5rem)]">
                        <span className="block whitespace-nowrap">Camera &amp; lens.</span>
                        <span className="block whitespace-nowrap">Lighting &amp; rigs.</span>
                    </h1>
                    <div className="lg:pb-1.5 lg:text-right">
                        <p className="text-lg text-ink-700">Bushwick, Brooklyn. Pickup or delivery anywhere in NYC.</p>
                        <p className="mt-1.5 text-sm text-ink-500">
                            <span className="font-mono text-ink-900">{site.rating.value.toFixed(1)}</span> on Google from {site.rating.count} reviews
                        </p>
                    </div>
                </div>
            </section>

            <section aria-label="Gear" className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6">
                <Catalog limit={12} />
            </section>
            </div>

            <ShootPicker />

            {/* the essentials, no paragraphs */}
            <section aria-labelledby="renting-title" className="border-t border-paper-300">
                <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
                    <div className="flex items-baseline justify-between gap-6">
                        <h2 id="renting-title" className="font-headline text-5xl">
                            Renting from Rob
                        </h2>
                        <Link to="/renting" className={`${textLink} shrink-0 text-sm text-ink-900`}>
                            How it works
                        </Link>
                    </div>
                    <dl className="mt-8 grid gap-x-8 gap-y-6 border-t border-ink-900 pt-6 sm:grid-cols-2 lg:grid-cols-4">
                        {FACTS.map(([term, detail]) => (
                            <div key={term}>
                                <dt className="text-xs font-semibold tracking-[0.12em] text-ink-500 uppercase">{term}</dt>
                                <dd className="mt-2 leading-relaxed text-ink-800">{detail}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            {/* reviews, grouped by what people praise. the counts are Google's own tags */}
            <section aria-labelledby="reviews-title" className="bg-paper-200">
                <div className="mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,2fr)] lg:gap-16 lg:py-20">
                    <div>
                        <h2 id="reviews-title" className="sr-only">
                            Reviews
                        </h2>
                        <p className="font-headline text-[8rem] leading-[0.8] sm:text-[9.5rem]">{site.rating.value.toFixed(1)}</p>
                        <p className="mt-4 text-ink-700">{site.rating.count} Google reviews, every one five stars.</p>
                        <h3 className="mt-10 text-xs font-semibold tracking-[0.14em] text-ink-500 uppercase">What they mention</h3>
                        <dl className="mt-3 border-t border-ink-900/80">
                            {reviewTags.map(([tag, count]) => (
                                <div key={tag} className="flex items-baseline justify-between gap-4 border-b border-ink-900/15 py-2.5">
                                    <dt className="text-ink-800">{tag}</dt>
                                    <dd className="font-mono text-sm text-ink-600 tabular-nums">{count}</dd>
                                </div>
                            ))}
                        </dl>
                        <a href={site.links.googleMaps} target="_blank" rel="noreferrer" className={`${textLink} mt-6 inline-block text-sm text-ink-900`}>
                            Read them on Google
                        </a>
                    </div>

                    <div className="min-w-0">
                        <figure className="border-t border-ink-900/80 pt-6">
                            <p className="text-xs font-semibold tracking-[0.14em] text-ink-500 uppercase">
                                {featuredReview.topic}, in {reviewTags[0][1]} reviews
                            </p>
                            <blockquote className="mt-4 text-[1.75rem] leading-snug tracking-[-0.01em] text-ink-900 sm:text-4xl">“{featuredReview.quote}”</blockquote>
                            <figcaption className="mt-5 text-sm text-ink-600">
                                <span className="font-semibold text-ink-900">{featuredReview.name}</span> · {featuredReview.source}
                            </figcaption>
                        </figure>
                        <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2">
                            {reviews.map((review) => (
                                <figure key={review.name} className="border-t border-ink-900/80 pt-5">
                                    <p className="text-xs font-semibold tracking-[0.14em] text-ink-500 uppercase">{review.topic}</p>
                                    <blockquote className="mt-3 text-xl leading-snug text-ink-900">“{review.quote}”</blockquote>
                                    <figcaption className="mt-4 text-sm text-ink-600">
                                        <span className="font-semibold text-ink-900">{review.name}</span> · {review.source}
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section aria-labelledby="cta-title" className="relative overflow-hidden bg-navy-700 text-paper-50">
                <Texture kind="ribs-color" />
                <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-24">
                    <h2 id="cta-title" className="font-headline text-6xl sm:text-8xl">
                        Shooting this week?
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        <ButtonAnchor href={smsHref('Hi Rob, I’m shooting ')} variant="paper" size="lg">
                            Text Rob
                        </ButtonAnchor>
                        <ButtonAnchor href={telHref} variant="outlineLight" size="lg">
                            Call {site.phone.display}
                        </ButtonAnchor>
                    </div>
                </div>
            </section>
        </>
    );
}
