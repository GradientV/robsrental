// a responsive <img>: the phone-sized file on small screens, the big one on large
// screens, and the real width/height from src/data/image-manifest.json so the
// page doesn't jump while it loads.
//
// Rob's own photos fill their frame (cropped around `focus`); manufacturer product
// images ("stock") sit whole on white, the way product shots usually do.
import manifest from '@/data/image-manifest.json';
import { PHOTOS, type PhotoInfo, type PhotoKey } from '@/data/photos';
import { cn } from '@/lib/cn';

type Size = { w: number; h: number };
const SIZES = manifest as Record<string, Size & { sm?: Size }>;

type Props = {
    photo: PhotoKey | PhotoInfo;
    /** the CSS width the image is shown at, for the browser to pick a file. e.g. '(min-width: 1024px) 40vw, 100vw' */
    sizes: string;
    className?: string;
    /** above-the-fold images load right away */
    eager?: boolean;
    alt?: string;
};

export default function Photo({ photo, sizes, className, eager = false, alt }: Props) {
    const info: PhotoInfo = typeof photo === 'string' ? PHOTOS[photo] : photo;
    const size = SIZES[info.src];
    const small = info.src.replace(/\.webp$/, '-sm.webp');
    const srcSet = size?.sm ? `${small} ${size.sm.w}w, ${info.src} ${size.w}w` : undefined;
    const stock = info.kind === 'stock';

    return (
        <img
            src={info.src}
            srcSet={srcSet}
            sizes={srcSet ? sizes : undefined}
            width={size?.w}
            height={size?.h}
            alt={alt ?? info.alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            className={cn(stock ? 'bg-white object-contain p-[8%]' : 'object-cover', className)}
            style={!stock && info.focus ? { objectPosition: info.focus } : undefined}
        />
    );
}
