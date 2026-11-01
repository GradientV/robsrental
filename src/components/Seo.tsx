// the <head> tags for one page: title, description, the canonical address and what
// a shared link looks like.
//
// every page renders one <Seo /> at its top. React 19 moves <title>, <meta> and <link>
// into <head> by itself, wherever they're rendered, and swaps them on navigation.
// scripts/prerender.ts bakes the same tags into each HTML file at build time, so
// crawlers and link previews that don't run JavaScript see them too.
import { absoluteUrl, getPage, type PageId } from '@/data/pages';
import { SITE_URL, site } from '@/data/site';

const SHARE_IMAGE = { path: '/og-image.png', width: 1200, height: 630, alt: 'Rob’s Rentals: camera, lighting and audio rentals in Bushwick, Brooklyn' };

type Props =
    | { pageId: PageId; title?: string; description?: string; schema?: object }
    /** pages that aren't in PAGES (each piece of gear) pass their own path */
    | { path: string; title: string; description: string; schema?: object; pageId?: undefined }
    /** the 404 page */
    | { notFound: true; title: string; description: string; pageId?: undefined; schema?: undefined };

export default function Seo(props: Props) {
    if ('notFound' in props) {
        return (
            <>
                <title>{props.title}</title>
                <meta name="description" content={props.description} />
                <meta name="robots" content="noindex, follow" />
            </>
        );
    }

    const page = props.pageId ? getPage(props.pageId) : undefined;
    const title = props.title ?? page?.title ?? site.name;
    const description = props.description ?? page?.description ?? '';
    const url = absoluteUrl(page ? page.path : 'path' in props ? props.path : '/');
    const image = `${SITE_URL}${SHARE_IMAGE.path}`;

    return (
        <>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />
            {page?.noindex && <meta name="robots" content="noindex, follow" />}

            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={site.name} />
            <meta property="og:locale" content="en_US" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content={String(SHARE_IMAGE.width)} />
            <meta property="og:image:height" content={String(SHARE_IMAGE.height)} />
            <meta property="og:image:alt" content={SHARE_IMAGE.alt} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* "<" is escaped so nothing inside the data can close the script tag early */}
            {props.schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(props.schema).replace(/</g, '\\u003c') }} />}
        </>
    );
}
