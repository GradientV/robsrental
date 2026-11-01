// short excerpts from public reviews (Google and Facebook, read Nov 1, 2026), grouped by
// what people praise. `tags` are Google's own counts of what his reviews mention.
// get Rob's OK before launch, and ask whether he'd like first names only.

export type Review = {
    quote: string;
    name: string;
    /** what this review is an example of, shown above it */
    topic: string;
    source: 'Google' | 'Facebook';
};

/** the big one: what 23 of his reviews mention */
export const featuredReview: Review = {
    quote: 'Rob & crew are incredibly knowledgeable, passionate, and steeped in the artistry of film equipment. I could have talked with Rob for hours about the characteristics of different lenses.',
    name: 'Ty M.',
    topic: 'Knowledgeable',
    source: 'Google'
};

export const reviews: Review[] = [
    {
        quote: 'Saved the day for our short film shoot! … needed to grab an XLR cord last minute and Rob and Em were super accommodating and timely.',
        name: 'Lindsay B.',
        topic: 'Last-minute saves',
        source: 'Google'
    },
    {
        quote: 'Rob’s gear and turnaround time have never let me down.',
        name: 'Benjamin C.',
        topic: 'Turnaround',
        source: 'Google'
    },
    {
        quote: 'Working with Rob has always been a smooth, easy process from start to finish.',
        name: 'Angel P.',
        topic: 'Smooth process',
        source: 'Google'
    },
    {
        quote: 'A one-stop-shop for lighting, audio, cameras, and G&E.',
        name: 'Emeline L.',
        topic: 'One stop',
        source: 'Facebook'
    }
];

/** Google's tags on his reviews, with how many mention each (the top six) */
export const reviewTags: Array<[tag: string, count: number]> = [
    ['Knowledgeable staff', 23],
    ['Flexible times', 5],
    ['Gear condition', 5],
    ['Smooth process', 5],
    ['Gear quality', 4],
    ['Quick response', 3]
];
