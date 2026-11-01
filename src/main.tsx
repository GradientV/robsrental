import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';
// fonts are served by Vite from node_modules: no Google Fonts request, no third-party host
import '@fontsource-variable/league-gothic/index.css'; // headlines, like the lettering on Rob's tape labels
import '@fontsource-variable/instrument-sans/index.css'; // body text
import '@fontsource/ibm-plex-mono/latin-400.css'; // prices and specs
import '@fontsource/ibm-plex-mono/latin-500.css';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('missing #root');

const app = (
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
);

// two ways to start, depending on what's already in the page:
//
// after `npm run build`, the HTML for this exact page is already inside #root,
// because scripts/prerender.ts drew it at build time and stamped the div with
// which page it is. hydrate = keep that HTML and just wire up the clicks.
//
// with `npm run dev` nothing is prerendered, so React draws the page from scratch.
// same for the 404 page: its stamp never matches the address someone typed.
const here = window.location.pathname.replace(/(.)\/$/, '$1');

if (container.dataset.prerendered === here) {
    hydrateRoot(container, app);
} else {
    clearPrerenderedHead();
    createRoot(container).render(app);
}

/**
 * when the HTML that arrived is for a different page than the one about to be drawn
 * (the 404 page), its <title> and <meta> tags are for the wrong page. prerender.ts
 * fences them between two comment markers; this removes them, and React adds the right ones.
 */
function clearPrerenderedHead() {
    const nodes = [...document.head.childNodes];
    const isMarker = (node: ChildNode, text: string) => node.nodeType === Node.COMMENT_NODE && (node as Comment).data === text;
    const start = nodes.findIndex((node) => isMarker(node, 'page-head'));
    const end = nodes.findIndex((node) => isMarker(node, '/page-head'));
    if (start === -1 || end === -1) return;
    nodes.slice(start + 1, end).forEach((node) => node.remove());
}
