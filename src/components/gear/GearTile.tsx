// the picture for a piece of gear. with a photo: the photo, with the item's tape label
// stuck on the corner the way Rob labels his cases. a kit without its own photo: the
// pieces inside it, four to a tile. nothing at all: a cutout in black case foam with the
// tape label across it.
import TapeLabel from '@/components/brand/TapeLabel';
import Photo from '@/components/ui/Photo';
import { getGear, type GearItem } from '@/data/gear';
import type { PhotoKey } from '@/data/photos';
import { cn } from '@/lib/cn';
import { tiltFor } from '@/lib/tilt';

type Props = {
    item: GearItem;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    /** cards repeat the name right below, so the picture is hidden from screen readers there */
    decorative?: boolean;
    eager?: boolean;
};

const TAPE_SIZE = { sm: 'xs', md: 'md', lg: 'lg' } as const;
const CORNER_TAPE = { md: 'sm', lg: 'md' } as const;
const SIZES = {
    sm: '128px',
    md: '(min-width: 1280px) 300px, (min-width: 640px) 45vw, 100vw',
    lg: '(min-width: 1024px) 55vw, 100vw'
} as const;
/** a quarter of the tile, for the kit collage */
const HALF_SIZES = {
    md: '(min-width: 1024px) 200px, 50vw',
    lg: '(min-width: 1024px) 28vw, 50vw'
} as const;

/** the first four different photos of the pieces inside a kit */
function partPhotos(item: GearItem): PhotoKey[] {
    const keys = (item.parts ?? []).map((part) => getGear(part.slug)?.photos?.[0]).filter((key): key is PhotoKey => Boolean(key));
    return [...new Set(keys)].slice(0, 4);
}

export default function GearTile({ item, size = 'md', className, decorative = true, eager = false }: Props) {
    const parts = item.photos?.length ? [] : partPhotos(item);
    // small thumbnails of a kit just show its first piece
    const photo = item.photos?.[0] ?? (size === 'sm' ? parts[0] : undefined);

    if (photo) {
        return (
            <div className={cn('relative overflow-hidden bg-ink-900', className)} aria-hidden={decorative || undefined}>
                <Photo photo={photo} sizes={SIZES[size]} eager={eager} alt={decorative ? '' : undefined} className="absolute inset-0 h-full w-full" />
                {size !== 'sm' && (
                    <TapeLabel size={CORNER_TAPE[size]} tilt={tiltFor(item.slug)} className="absolute bottom-3.5 left-3.5">
                        {item.tape}
                    </TapeLabel>
                )}
            </div>
        );
    }

    if (size !== 'sm' && parts.length === 4) {
        const inside = (item.parts ?? []).map((part) => getGear(part.slug)?.name).filter(Boolean);
        return (
            <div
                className={cn('relative grid grid-cols-2 grid-rows-2 gap-px overflow-hidden bg-paper-300', className)}
                aria-hidden={decorative || undefined}
                role={decorative ? undefined : 'img'}
                aria-label={decorative ? undefined : `${item.name}: ${inside.join(', ')}`}
            >
                {parts.map((key) => (
                    <div key={key} className="relative min-h-0">
                        <Photo photo={key} sizes={HALF_SIZES[size]} eager={eager} alt="" className="absolute inset-0 h-full w-full" />
                    </div>
                ))}
                <TapeLabel size={CORNER_TAPE[size]} tilt={tiltFor(item.slug)} className="absolute bottom-3.5 left-3.5">
                    {item.tape}
                </TapeLabel>
            </div>
        );
    }

    return (
        <div className={cn('foam relative grid place-items-center overflow-hidden', className)} aria-hidden="true">
            <div className={cn('cutout absolute', size === 'sm' ? 'inset-[16%]' : 'inset-x-[14%] inset-y-[20%]')} />
            <TapeLabel size={TAPE_SIZE[size]} tilt={tiltFor(item.slug)} className="relative">
                {item.tape}
            </TapeLabel>
            {size !== 'sm' && (
                <span className={cn('absolute bottom-3 left-3.5 font-mono tracking-[0.12em] text-ink-400 uppercase', size === 'lg' ? 'text-xs' : 'text-[0.65rem]')}>{item.brand}</span>
            )}
        </div>
    );
}
