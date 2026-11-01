# Rob's Rentals: preview site

Preview website for Rob's Rentals (Rob's Film & Photo on Google), a by-appointment camera, lighting and audio rental house at 133 Woodbine St, Bushwick, Brooklyn. Built by [GradientV](https://gradientv.com) to show Rob how a site with a rental "cart" could look and work.

## What it does

- **Catalog** (`/gear`): 36 items across cameras, lenses, lighting, audio, grip, monitors and kits, with category filters, search and sort. Every item has its own page (`/gear/<slug>`) with specs, what's in the case, the week price, a photo gallery when there's more than one photo, and "goes well with" suggestions.
- **A photo on every item.** Nine are Rob's own, from his Google listing. The rest are the makers' product shots on white, standing in until he photographs his own gear. Kits show the pieces inside them, four to a tile. Sources are in `RESEARCH.md`.
- **"What are you shooting?"** on the home page: pick interview, music video, short film, podcast, product or doc, see a ready-made set from the catalog with its day rate, and add the whole set in one tap. Sets built on a kit go on the list at the kit price (`src/data/shoots.ts`).
- **Gear list** (the cart): add from any card or item page, change quantities from the card, the slide-out drawer or the list page. Saved in the browser, so a reload keeps it. On phones a bar along the bottom shows the list once something's on it. The drawer and the list page suggest gear that goes with what's already on it (from each item's `pairs`), one tap to add.
- **Small motion:** adding something sends a strip of tape with its label into the gear list count, which bumps when it lands, and cards lift a little on hover. Both turn off for people who've asked their device for reduced motion.
- **Reviews** grouped by what people praise, with Google's own counts of what his reviews mention (knowledgeable staff, 23).
- **List page** (`/list`): pick pickup and return dates, choose pickup or delivery, and see a live estimate (a full week is billed as 4 days). The details form writes the request up as a message, and the renter sends it to Rob with one tap by text (it opens their messages app with everything filled in), by email, or copies it. There's no server: nothing is stored or sent by the site itself.
- **Kits** priced below the sum of their parts, with the "separately" price shown.
- Renting info and FAQ (`/renting`), contact with hours and a click-to-load map (`/contact`), privacy (`/privacy`) and a 404.

## Stack

- React 19, TypeScript 6, Vite 8, Tailwind CSS 4, React Router 8. Same setup as Sariling Atin and Ditko Club.
- Every page, including all 36 gear pages, is prerendered to static HTML by `scripts/prerender.ts`, so link previews and search engines see real content.
- Fonts are self-hosted through Fontsource: League Gothic (headlines, after the condensed lettering on Rob's tape labels), Instrument Sans (body), IBM Plex Mono (prices and specs).

## Design

Rob labels his cases with strips of white camera tape lettered in navy, and his gear lives in black foam inside silver flight cases. The site is built on that:

- Warm paper white, near-black ink, and navy as the only accent. Square corners everywhere.
- The logo is a tape label (a stand-in until we get his real logo file).
- The home page leads with the catalog: a two-line headline, then category tabs, search and the gear (12 to start, "Show all" for the rest). Copy is kept short everywhere; the detail lives on each item's page.
- Background textures, the same idea as gradientv.com but original to this site: soft folds (like a silk on a frame) behind page tops, navy ribs in the dark bands. They're grey or navy images blended into the section color and faded out before the text (`.tx` in `src/index.css`, drawn by `npm run textures`).
- Every photo gets the item's tape label stuck on the corner. Rob's own photos fill the frame; product shots sit whole on white. A kit without its own photo shows four of its pieces, and anything with no photo at all falls back to a foam cutout with the tape label across it (`GearTile`).
- The footer signs off with his own bio line: "Don't break it."

Things we keep off GradientV sites because they read as AI-generated: two-color headlines, icons in front of text, colored dots and round badges, pill-shaped chips, numbered or "how it works" step rows (especially 01 / 02), and labels that go stale. The category filter is plain text links, and the renting steps are written as prose.

## Commands

```bash
npm install
npm run dev       # http://localhost:5178
npm run build     # type-checks, builds, prerenders every page to dist/
npm run preview   # serves dist/ at http://localhost:4178
npm run lint
npm run images    # turns new .jpg/.png files in public/images into .webp (originals go to images-raw/)
npm run textures  # redraws public/textures/folds.webp and ribs.webp
npm run brand     # regenerates the icons and public/og-image.png
```

## Updating content

| What | Where |
| --- | --- |
| Name, phone, email, address, hours, links, Google rating | `src/data/site.ts` |
| Gear, day rates, stock, specs, kits | `src/data/gear.ts` |
| How a week is billed | `WEEK_BILLED_AS` in `src/lib/rental.ts` |
| Review quotes and Google's review tags | `src/data/reviews.ts` |
| "What are you shooting?" sets | `src/data/shoots.ts` |
| Photos (files in `public/images/gear`, alt text and crop point) | `src/data/photos.ts`, then list them under `photos` on the item in `gear.ts` |
| Page titles and descriptions | `src/data/pages.ts` |
| Colors, fonts, the tape and foam styles | `src/index.css` |
| The text message the list turns into | `buildRequestMessage` in `src/lib/rental.ts` |

## Before launch

- [ ] **Inventory and rates.** Everything in `src/data/gear.ts` is a placeholder built from gear in Rob's photos. Replace it with his real list, rates and quantities, and confirm the gimbal and follow focus models.
- [ ] **Policies.** The 4-day week, the insurance answer and the damage answer on `/renting` are placeholders. Confirm each with Rob.
- [ ] **Name, phone, address.** Google and Facebook disagree on all three. See `RESEARCH.md`, then fix whichever profile is out of date.
- [ ] **Email.** Confirm `robertdouthatphotography@gmail.com` is the inbox he wants.
- [ ] **Photos.** Get Rob's OK to use the nine photos from his Google listing. Everything else is a maker's product shot standing in; swap in his own photos of his own gear as he takes them (the Canon 70-200 image is the lowest resolution, so that one first).
- [ ] **Shoot sets.** Have Rob adjust the sets in `src/data/shoots.ts` to what he'd actually send out for each kind of job.
- [ ] **Logo.** Swap the tape-label stand-in for his file, and update `public/favicon.svg` and the share image.
- [ ] **Reviews.** Get his OK to quote the five reviews (first name and last initial).
- [ ] **Requests.** Decide whether text-only is enough or requests should also land in an inbox (a form service, or a small API route on Vercel).
- [ ] **Domain.** Register it in Rob's name, then update `SITE_URL` in `src/data/site.ts` and rebuild.
- [ ] Add the domain to his Google profile and Facebook page.
