// the full catalog page. same catalog as the home page, without the "show all" cap
import { Link } from 'react-router';
import Catalog from '@/components/gear/Catalog';
import Seo from '@/components/Seo';
import Texture from '@/components/ui/Texture';
import { smsHref } from '@/data/site';
import { WEEK_BILLED_AS } from '@/lib/rental';

export default function Gear() {
    return (
        <>
            <Seo pageId="gear" />

            <header className="relative overflow-hidden">
                <Texture kind="folds" />
                <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6 lg:pt-16">
                    <h1 className="font-headline text-7xl sm:text-8xl">The gear</h1>
                    <p className="mt-4 text-ink-600">Day rates. A full week is billed as {WEEK_BILLED_AS} days.</p>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
                <Catalog />

                <p className="mt-20 border-t border-paper-300 pt-8 text-ink-600">
                    Need something you don’t see?{' '}
                    <a href={smsHref('Hi Rob, do you have ')} className="font-semibold text-ink-900 underline underline-offset-4">
                        Text Rob
                    </a>{' '}
                    or read{' '}
                    <Link to="/renting" className="font-semibold text-ink-900 underline underline-offset-4">
                        how renting works
                    </Link>
                    .
                </p>
            </div>
        </>
    );
}
