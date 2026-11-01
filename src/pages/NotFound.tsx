import { Link } from 'react-router';
import TapeLabel from '@/components/brand/TapeLabel';
import Seo from '@/components/Seo';
import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
    return (
        <>
            <Seo notFound title="Not found | Rob’s Rentals" description="That page isn’t on the shelf." />
            <div className="mx-auto flex max-w-7xl flex-col items-start px-4 py-24 sm:px-6 lg:py-32">
                <TapeLabel size="md" tilt={-3}>
                    Out on a job
                </TapeLabel>
                <h1 className="mt-10 font-headline text-7xl sm:text-9xl">Not on the shelf</h1>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-700">That page doesn’t exist, or it moved. The gear is still here.</p>
                <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                    <ButtonLink to="/gear">Browse the gear</ButtonLink>
                    <Link to="/" className="font-semibold underline underline-offset-[5px]">
                        Home
                    </Link>
                </div>
            </div>
        </>
    );
}
