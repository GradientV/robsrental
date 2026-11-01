// "Add to list", which turns into a quantity stepper once the item is on the list
import { useGearList } from '@/components/list/GearListContext';
import QtyStepper from '@/components/gear/QtyStepper';
import { buttonClasses } from '@/components/ui/Button';
import type { GearItem } from '@/data/gear';
import { cn } from '@/lib/cn';
import { flyToList } from '@/lib/fly';

type Props = {
    item: GearItem;
    tone?: 'light' | 'dark';
    className?: string;
};

export default function AddToList({ item, tone = 'light', className }: Props) {
    const { qtyOf, add, setQty, openDrawer } = useGearList();
    const qty = qtyOf(item.slug);

    if (qty === 0) {
        return (
            <button
                type="button"
                onClick={(event) => {
                    flyToList(event.currentTarget, item.tape);
                    add(item.slug);
                }}
                className={buttonClasses({ variant: tone === 'dark' ? 'outlineLight' : 'outline', size: 'sm', className: cn('w-full', className) })}
            >
                Add to list
            </button>
        );
    }

    return (
        <div className={cn('flex items-center justify-between gap-3', className)}>
            <QtyStepper value={qty} max={item.stock} onChange={(next) => setQty(item.slug, next)} label={item.name} size="sm" tone={tone} />
            <button
                type="button"
                onClick={openDrawer}
                className={cn('text-sm font-semibold underline decoration-1 underline-offset-4 hover:decoration-2', tone === 'dark' ? 'text-paper-50' : 'text-navy-700')}
            >
                On your list
            </button>
        </div>
    );
}
