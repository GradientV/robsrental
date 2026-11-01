// a decorative background texture (see .tx in src/index.css). the parent needs
// `relative overflow-hidden`, and the content after it needs `relative` to sit on top
import { cn } from '@/lib/cn';

type Props = {
    /** folds: light sections. ribs: dark bands. ribs-color: a colored band like the navy one */
    kind: 'folds' | 'ribs' | 'ribs-color';
    className?: string;
};

export default function Texture({ kind, className }: Props) {
    const classes = kind === 'ribs-color' ? 'tx tx-ribs tx-ribs-color' : `tx tx-${kind}`;
    return <div aria-hidden="true" className={cn(classes, className)} />;
}
