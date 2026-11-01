import type { ComponentType } from 'react';
import { Route, Routes } from 'react-router';
import Layout from '@/components/layout/Layout';
import { PAGES, type PageId } from '@/data/pages';
import Contact from '@/pages/Contact';
import Gear from '@/pages/Gear';
import GearItem from '@/pages/GearItem';
import Home from '@/pages/Home';
import List from '@/pages/List';
import NotFound from '@/pages/NotFound';
import Privacy from '@/pages/Privacy';
import Renting from '@/pages/Renting';

/** which component draws each page in src/data/pages.ts */
const PAGE_COMPONENTS: Record<PageId, ComponentType> = {
    home: Home,
    gear: Gear,
    list: List,
    renting: Renting,
    contact: Contact,
    privacy: Privacy
};

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                {PAGES.map((page) => {
                    const Page = PAGE_COMPONENTS[page.id];
                    return page.path === '/' ? <Route key={page.id} index element={<Page />} /> : <Route key={page.id} path={page.path.slice(1)} element={<Page />} />;
                })}
                <Route path="gear/:slug" element={<GearItem />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
