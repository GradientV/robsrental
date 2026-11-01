import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import AddedToast from '@/components/list/AddedToast';
import GearListDrawer from '@/components/list/GearListDrawer';
import { GearListProvider, useGearList } from '@/components/list/GearListContext';
import MobileListBar from '@/components/list/MobileListBar';
import Footer from './Footer';
import Header from './Header';

/** new page: back to the top. a #hash in the link: scroll to that section instead.
 *  a change to ?category= alone (the catalog filter) keeps the scroll where it is */
function ScrollManager() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
        } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, [pathname, hash]);

    return null;
}

function Shell() {
    const { pathname } = useLocation();
    const { count, announcement } = useGearList();
    const showBar = count > 0 && pathname !== '/list';

    return (
        <>
            <a href="#main" className="sr-only z-[60] bg-ink-900 px-4 py-2 font-semibold text-paper-50 focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
                Skip to content
            </a>
            <ScrollManager />
            <Header />
            <main id="main" tabIndex={-1} className="outline-none">
                <Outlet />
            </main>
            <Footer />
            {showBar && <MobileListBar />}
            {/* room for the phone list bar, so it never covers the footer */}
            {showBar && <div className="h-[4.25rem] bg-ink-950 md:hidden" />}
            <AddedToast raised={showBar} />
            <GearListDrawer />
            <p aria-live="polite" className="sr-only">
                {announcement}
            </p>
        </>
    );
}

export default function Layout() {
    return (
        <GearListProvider>
            <Shell />
        </GearListProvider>
    );
}
