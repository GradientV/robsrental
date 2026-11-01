// square buttons, text only. ButtonLink for pages on this site,
// ButtonAnchor for phone numbers, texts and other sites.
import type { ComponentProps, ReactNode } from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/cn';

const VARIANTS = {
    navy: 'bg-navy-700 text-paper-50 hover:bg-navy-800',
    ink: 'bg-ink-900 text-paper-50 hover:bg-ink-700',
    paper: 'bg-paper-50 text-ink-900 hover:bg-white',
    outline: 'border border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-paper-50',
    outlineLight: 'border border-paper-50/45 text-paper-50 hover:border-paper-50 hover:bg-paper-50 hover:text-ink-900'
} as const;

const SIZES = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-12 px-6 text-[0.95rem]',
    lg: 'h-14 px-7 text-base'
} as const;

export type ButtonStyle = { variant?: keyof typeof VARIANTS; size?: keyof typeof SIZES; className?: string };

export function buttonClasses({ variant = 'navy', size = 'md', className }: ButtonStyle = {}) {
    return cn(
        'inline-flex items-center justify-center font-semibold tracking-[0.01em] whitespace-nowrap transition-colors duration-150',
        'disabled:pointer-events-none disabled:opacity-40',
        VARIANTS[variant],
        SIZES[size],
        className
    );
}

type LinkProps = ButtonStyle & { to: string; children: ReactNode } & Omit<ComponentProps<typeof Link>, 'to' | 'className' | 'children'>;

export function ButtonLink({ variant, size, className, children, ...rest }: LinkProps) {
    return (
        <Link className={buttonClasses({ variant, size, className })} {...rest}>
            {children}
        </Link>
    );
}

type AnchorProps = ButtonStyle & ComponentProps<'a'>;

export function ButtonAnchor({ variant, size, className, children, ...rest }: AnchorProps) {
    return (
        <a className={buttonClasses({ variant, size, className })} {...rest}>
            {children}
        </a>
    );
}

/** the underlined text link used next to buttons and at the end of sections */
export const textLink = 'font-semibold underline decoration-1 underline-offset-[5px] transition-colors hover:decoration-2';
