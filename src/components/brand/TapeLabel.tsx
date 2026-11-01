// a strip of camera tape with navy lettering: how Rob labels his cases,
// and the one visual idea that runs through the whole site
import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';

const SIZES = {
    xs: 'px-2.5 pt-[0.32em] pb-[0.22em] text-base',
    sm: 'px-3 pt-[0.3em] pb-[0.2em] text-xl',
    md: 'px-4 pt-[0.28em] pb-[0.18em] text-3xl',
    lg: 'px-5 pt-[0.26em] pb-[0.16em] text-5xl',
    xl: 'px-6 pt-[0.24em] pb-[0.14em] text-6xl sm:text-7xl'
} as const;

type Props = {
    children: string;
    size?: keyof typeof SIZES;
    /** degrees. small tilts look hand-applied */
    tilt?: number;
    className?: string;
};

export default function TapeLabel({ children, size = 'md', tilt = 0, className }: Props) {
    const style: CSSProperties | undefined = tilt ? { transform: `rotate(${tilt}deg)` } : undefined;
    return (
        <span className={cn('tape-shadow inline-block', className)} style={style}>
            <span className={cn('tape block font-headline whitespace-nowrap', SIZES[size])}>{children}</span>
        </span>
    );
}
