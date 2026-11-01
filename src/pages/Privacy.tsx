import { Link } from 'react-router';
import Seo from '@/components/Seo';
import Texture from '@/components/ui/Texture';
import { site } from '@/data/site';

export default function Privacy() {
    return (
        <>
            <Seo pageId="privacy" />
            <div className="relative overflow-hidden">
            <Texture kind="folds" className="h-[28rem]" />
            <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-24 sm:px-6 lg:pt-16">
                <h1 className="font-headline text-7xl sm:text-8xl">Privacy</h1>
                <p className="mt-3 text-sm text-ink-500">Last updated November 1, 2026</p>

                <div className="prose-page mt-10">
                    <p>The short version: this website doesn’t collect your information. Your gear list stays in your own browser until you choose to send it to Rob yourself.</p>

                    <h2>Your gear list</h2>
                    <p>
                        What you add to your <Link to="/list">gear list</Link>, your dates and your pickup or delivery choice are saved in your browser’s local storage so they’re still there if you
                        reload. They never reach a server. Clearing your browser data, or using a private window, removes them.
                    </p>

                    <h2>Sending a request</h2>
                    <p>
                        The details form doesn’t submit anywhere. It writes your request up as a message, and you send it from your own phone or email app. Once you do, Rob has what you sent: your
                        name, phone number, any email, address and notes you included. He uses it to confirm your rental and get in touch about it, and doesn’t sell or share it.
                    </p>

                    <h2>Maps</h2>
                    <p>The contact page only loads Google Maps if you ask it to. Once loaded, Google’s own privacy policy applies to the map.</p>

                    <h2>Hosting</h2>
                    <p>Like any website, the host keeps standard server logs (such as IP address and browser type) to keep the site running and secure.</p>

                    <h2>Questions</h2>
                    <p>
                        Call or text {site.phone.display}, or email <a href={`mailto:${site.email}`}>{site.email}</a>.
                    </p>
                </div>
            </div>
            </div>
        </>
    );
}
