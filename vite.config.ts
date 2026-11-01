// vite config: react + tailwind and the @ alias for src/.
// `npm run build` runs vite twice (the browser build, then an SSR build of
// src/entry-server.tsx) and scripts/prerender.ts turns that into one HTML file per page
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(root, 'src')
        }
    },
    server: {
        port: 5178
    },
    preview: {
        port: 4178
    }
});
