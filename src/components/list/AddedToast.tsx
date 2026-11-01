// the little "added" note in the corner after something goes on the list.
// screen readers hear the same thing from the live region in the layout
import { useGearList } from '@/components/list/GearListContext';
import { cn } from '@/lib/cn';

export default function AddedToast({ raised }: { raised: boolean }) {
    const { toast, dismissToast, openDrawer } = useGearList();
    if (!toast) return null;

    return (
        <div
            key={toast.id}
            className={cn(
                'fixed right-4 left-4 z-40 flex animate-toast-in items-center justify-between gap-4 bg-ink-900 py-3.5 pr-3.5 pl-5 text-paper-50 shadow-2xl sm:left-auto sm:w-[25rem]',
                raised ? 'bottom-20 md:bottom-6' : 'bottom-4 sm:bottom-6'
            )}
        >
            <p className="min-w-0 text-sm leading-snug">
                <span className="block text-ink-400">Added to your list</span>
                <span className="block truncate font-semibold">{toast.text}</span>
            </p>
            <div className="flex shrink-0 items-center gap-1">
                <button type="button" onClick={openDrawer} className="h-10 bg-paper-50 px-4 text-sm font-semibold text-ink-900 hover:bg-white">
                    View list
                </button>
                <button type="button" onClick={dismissToast} aria-label="Dismiss" className="grid h-10 w-10 place-items-center text-lg text-ink-400 hover:text-paper-50">
                    ×
                </button>
            </div>
        </div>
    );
}
