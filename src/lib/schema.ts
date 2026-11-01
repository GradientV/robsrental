// structured data (schema.org JSON-LD) so Google can show the address, phone,
// hours and rental items properly. rendered by <Seo schema={...} />
import type { GearItem } from '@/data/gear';
import { SITE_URL, ONE_LINER, site } from '@/data/site';
import { absoluteUrl } from '@/data/pages';

const BUSINESS_ID = `${SITE_URL}/#business`;

export function businessSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': BUSINESS_ID,
        name: site.name,
        alternateName: site.altName,
        description: ONE_LINER,
        url: `${SITE_URL}/`,
        telephone: site.phone.tel,
        image: `${SITE_URL}/og-image.png`,
        priceRange: '$',
        address: {
            '@type': 'PostalAddress',
            streetAddress: site.address.street,
            addressLocality: site.address.city,
            addressRegion: site.address.region,
            postalCode: site.address.postalCode,
            addressCountry: site.address.country
        },
        geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
        areaServed: { '@type': 'City', name: 'New York' },
        openingHoursSpecification: [
            { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '00:00', closes: '23:59' },
            { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '07:00', closes: '23:00' },
            { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '10:00', closes: '23:00' }
        ],
        sameAs: [site.facebook, site.links.googleMaps],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: site.rating.value, reviewCount: site.rating.count, bestRating: 5 }
    };
}

export function productSchema(item: GearItem) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: item.name,
        brand: { '@type': 'Brand', name: item.brand },
        description: item.summary,
        url: absoluteUrl(`/gear/${item.slug}`),
        offers: {
            '@type': 'Offer',
            businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
            priceSpecification: { '@type': 'UnitPriceSpecification', price: item.dayRate, priceCurrency: 'USD', unitCode: 'DAY' },
            availability: 'https://schema.org/InStock',
            seller: { '@id': BUSINESS_ID }
        }
    };
}
