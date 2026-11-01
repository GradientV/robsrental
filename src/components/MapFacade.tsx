// the map only loads when someone asks for it. until then nothing is requested
// from Google: faster pages, and no third-party cookies for people who don't need a map.
import { useState } from 'react';
import TapeLabel from '@/components/brand/TapeLabel';
import { buttonClasses } from '@/components/ui/Button';
import { site } from '@/data/site';
import { cn } from '@/lib/cn';

export default function MapFacade({ className }: { className?: string }) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={cn('relative overflow-hidden', className)}>
            {loaded ? (
                <iframe
                    title={`Map of ${site.address.street}, ${site.address.city}`}
                    src={site.links.mapEmbed}
                    className="h-full min-h-80 w-full grayscale-[0.4]"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                />
            ) : (
                <div className="foam flex h-full min-h-80 flex-col items-center justify-center gap-7 p-8 text-center">
                    <TapeLabel size="md" tilt={-2}>
                        {site.address.street}
                    </TapeLabel>
                    <p className="text-ink-300">
                        {site.address.neighborhood}, {site.address.city} {site.address.postalCode}
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <a href={site.links.directions} target="_blank" rel="noreferrer" className={buttonClasses({ variant: 'paper', size: 'sm' })}>
                            Get directions
                        </a>
                        <button type="button" onClick={() => setLoaded(true)} className={buttonClasses({ variant: 'outlineLight', size: 'sm' })}>
                            Show the map here
                        </button>
                    </div>
                    <p className="max-w-xs text-xs leading-relaxed text-ink-400">
                        Showing the map loads Google Maps, which has its own{' '}
                        <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="underline underline-offset-2">
                            privacy policy
                        </a>
                        .
                    </p>
                </div>
            )}
        </div>
    );
}
