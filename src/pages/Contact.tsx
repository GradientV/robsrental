import MapFacade from '@/components/MapFacade';
import Seo from '@/components/Seo';
import { ButtonAnchor } from '@/components/ui/Button';
import Texture from '@/components/ui/Texture';
import { hours, site, smsHref, telHref } from '@/data/site';
import { businessSchema } from '@/lib/schema';

export default function Contact() {
    return (
        <>
            <Seo pageId="contact" schema={businessSchema()} />

            <div className="relative overflow-hidden">
            <Texture kind="folds" className="h-[32rem]" />
            <div className="relative mx-auto grid max-w-7xl gap-14 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:pt-16">
                <div>
                    <h1 className="font-headline text-7xl sm:text-8xl">Call or text</h1>
                    <a href={telHref} className="mt-6 block font-mono text-3xl tabular-nums hover:underline sm:text-4xl">
                        {site.phone.display}
                    </a>
                    <p className="mt-4 text-lg text-ink-700">By appointment. Texting is fastest.</p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <ButtonAnchor href={smsHref('Hi Rob, ')} size="lg">
                            Send a text
                        </ButtonAnchor>
                        <ButtonAnchor href={telHref} variant="outline" size="lg">
                            Call
                        </ButtonAnchor>
                    </div>

                    <dl className="mt-14 border-t border-ink-900">
                        <div className="grid gap-1 border-b border-paper-300 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
                            <dt className="text-sm font-semibold tracking-[0.08em] text-ink-500 uppercase">Pickup</dt>
                            <dd className="leading-relaxed">
                                <a href={site.links.googleMaps} target="_blank" rel="noreferrer" className="hover:underline">
                                    {site.address.street}
                                    <br />
                                    {site.address.city}, {site.address.region} {site.address.postalCode}
                                </a>
                                <span className="mt-1 block text-ink-600">{site.address.neighborhood}. By appointment only.</span>
                            </dd>
                        </div>
                        <div className="grid gap-1 border-b border-paper-300 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
                            <dt className="text-sm font-semibold tracking-[0.08em] text-ink-500 uppercase">Delivery</dt>
                            <dd className="leading-relaxed">Anywhere in NYC, quoted with your list.</dd>
                        </div>
                        <div className="grid gap-1 border-b border-paper-300 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
                            <dt className="text-sm font-semibold tracking-[0.08em] text-ink-500 uppercase">Email</dt>
                            <dd>
                                <a href={`mailto:${site.email}`} className="break-all hover:underline">
                                    {site.email}
                                </a>
                            </dd>
                        </div>
                        <div className="grid gap-1 border-b border-paper-300 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
                            <dt className="text-sm font-semibold tracking-[0.08em] text-ink-500 uppercase">Elsewhere</dt>
                            <dd className="flex flex-wrap gap-x-6 gap-y-1">
                                <a href={site.facebook} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:decoration-2">
                                    Facebook
                                </a>
                                <a href={site.links.googleMaps} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:decoration-2">
                                    Google, {site.rating.value.toFixed(1)} from {site.rating.count} reviews
                                </a>
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="space-y-10">
                    <MapFacade className="aspect-[4/3] w-full" />
                    <section aria-labelledby="hours-title">
                        <h2 id="hours-title" className="font-headline text-4xl">
                            Pickup and return hours
                        </h2>
                        <table className="mt-5 w-full border-t border-ink-900 text-[0.95rem]">
                            <tbody>
                                {hours.map((day) => (
                                    <tr key={day.day} className="border-b border-paper-300">
                                        <th scope="row" className="py-3 text-left font-normal text-ink-600">
                                            {day.day}
                                        </th>
                                        <td className="py-3 text-right font-mono">{day.label}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </div>
            </div>
            </div>
        </>
    );
}
