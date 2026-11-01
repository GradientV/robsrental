// on phones, a bar along the bottom once there's something on the list
import { Link } from 'react-router';
import { useGearList } from '@/components/list/GearListContext';
import { formatMoney } from '@/lib/rental';

export default function MobileListBar() {
    const { count, perDay } = useGearList();
    return (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-700 bg-ink-900 px-4 py-3 text-paper-50 md:hidden">
            <div className="flex items-center justify-between gap-4">
                <p className="text-sm leading-tight">
                    <span className="block font-semibold">
                        Gear list, {count} {count === 1 ? 'piece' : 'pieces'}
                    </span>
                    <span className="font-mono text-ink-300 tabular-nums">{formatMoney(perDay)}/day</span>
                </p>
                <Link to="/list" className="grid h-11 place-items-center bg-paper-50 px-5 text-sm font-semibold text-ink-900">
                    Review list
                </Link>
            </div>
        </div>
    );
}
