import { Link } from 'react-router';
import Logo from '@/components/brand/Logo';
import Texture from '@/components/ui/Texture';
import { HOURS_SUMMARY, nav, site, smsHref, telHref } from '@/data/site';

const YEAR = new Date().getFullYear();

const linkClass = 'text-paper-200 transition-colors hover:text-paper-50';

export default function Footer() {
    return (
        <footer className="relative overflow-hidden bg-ink-950 text-paper-200">
            <Texture kind="ribs" className="opacity-40" />
            <div className="relative mx-auto max-w-7xl px-4 pt-20 sm:px-6">
                <p className="font-headline text-[clamp(4.5rem,15vw,12rem)] text-paper-50">{site.signoff}</p>

                <div className="mt-14 grid gap-12 border-t border-ink-700 pt-12 pb-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_0.8fr]">
                    <div>
                        <Link to="/" aria-label="Rob’s Rentals home" className="inline-block">
                            <Logo />
                        </Link>
                        <p className="mt-6 max-w-xs leading-relaxed text-ink-300">{site.bio}</p>
                    </div>

                    <div>
                        <h2 className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">Pickup</h2>
                        <address className="mt-4 leading-relaxed not-italic">
                            <a href={site.links.googleMaps} target="_blank" rel="noreferrer" className={linkClass}>
                                {site.address.street}
                                <br />
                                {site.address.city}, {site.address.region} {site.address.postalCode}
                            </a>
                        </address>
                        <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-ink-400">By appointment. {HOURS_SUMMARY}</p>
                    </div>

                    <div>
                        <h2 className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">Call or text</h2>
                        <ul className="mt-4 space-y-2.5">
                            <li>
                                <a href={telHref} className="font-mono text-paper-50 tabular-nums hover:underline">
                                    {site.phone.display}
                                </a>
                            </li>
                            <li>
                                <a href={smsHref()} className={linkClass}>
                                    Send a text
                                </a>
                            </li>
                            <li>
                                <a href={site.facebook} target="_blank" rel="noreferrer" className={linkClass}>
                                    Facebook
                                </a>
                            </li>
                            <li>
                                <a href={site.links.googleMaps} target="_blank" rel="noreferrer" className={linkClass}>
                                    Google reviews
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">Site</h2>
                        <ul className="mt-4 space-y-2.5">
                            {nav.map((item) => (
                                <li key={item.to}>
                                    <Link to={item.to} className={linkClass}>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link to="/list" className={linkClass}>
                                    Your gear list
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="relative border-t border-ink-700">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-ink-400 sm:px-6 md:flex-row md:items-center md:justify-between">
                    <p>
                        © <span suppressHydrationWarning>{YEAR}</span> {site.name} · {site.address.neighborhood}, Brooklyn ·{' '}
                        <Link to="/privacy" className="hover:text-paper-50">
                            Privacy
                        </Link>
                    </p>
                    <p>
                        Designed &amp; built by{' '}
                        <a href="https://gradientv.com" target="_blank" rel="noopener" className="font-semibold text-paper-100 underline decoration-paper-100/30 underline-offset-[3px] hover:decoration-paper-100">
                            GradientV
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
