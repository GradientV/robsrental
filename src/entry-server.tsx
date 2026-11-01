// the same <App /> as main.tsx, drawn to a string of HTML instead of to the screen.
// nothing in the browser loads this file: `npm run build` compiles it, and
// scripts/prerender.ts calls render() once per page to write the real HTML files.
//
// StaticRouter is BrowserRouter's twin for when there's no browser: you hand it
// the address as text and it shows that page.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';

// the prerender script needs the page list and the site address
export { PRERENDER_PATHS } from './data/pages';
export { SITE_URL } from './data/site';

export function render(path: string): string {
    return renderToString(
        <StrictMode>
            <StaticRouter location={path}>
                <App />
            </StaticRouter>
        </StrictMode>
    );
}
