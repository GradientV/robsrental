// minus / count / plus. going below one is the parent's call (usually: remove it)
import { cn } from '@/lib/cn';

type Props = {
    value: number;
    max: number;
    onChange: (next: number) => void;
    label: string;
    size?: 'sm' | 'md';
    tone?: 'light' | 'dark';
    className?: string;
};

export default function QtyStepper({ value, max, onChange, label, size = 'md', tone = 'light', className }: Props) {
    const box = size === 'sm' ? 'h-9 w-9 text-base' : 'h-12 w-12 text-lg';
    const border = tone === 'dark' ? 'border-paper-50/30' : 'border-ink-900/25';
    const hover = tone === 'dark' ? 'hover:bg-paper-50 hover:text-ink-900' : 'hover:bg-ink-900 hover:text-paper-50';

    return (
        <fieldset className={cn('inline-flex min-w-0 items-stretch border', border, className)}>
            <legend className="sr-only">Quantity of {label}</legend>
            <button type="button" onClick={() => onChange(value - 1)} aria-label={value <= 1 ? `Remove ${label}` : `One fewer ${label}`} className={cn('grid place-items-center transition-colors', box, hover)}>
                −
            </button>
            <output aria-live="polite" className={cn('grid min-w-10 place-items-center border-x px-2 font-mono tabular-nums', border, size === 'sm' ? 'text-sm' : 'text-base')}>
                {value}
            </output>
            <button
                type="button"
                onClick={() => onChange(value + 1)}
                disabled={value >= max}
                aria-label={`One more ${label}`}
                className={cn('grid place-items-center transition-colors disabled:cursor-not-allowed disabled:opacity-30', box, value < max && hover)}
            >
                +
            </button>
        </fieldset>
    );
}
