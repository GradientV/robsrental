// the rental catalog: every item, its day rate, what comes in the case, and specs.
//
// SAMPLE DATA FOR THE PREVIEW. the items are based on gear that shows up in Rob's
// own photos (ARRI fresnel kit with scrims, Aputure LS 300x, a DJI RS gimbal, a
// Blackmagic Pocket 6K with a Canon 16-35mm, a Sony rig with wooden handgrips, a
// wireless follow focus, GoPro, Glide Gear TMP100 teleprompter, DJI FPV) and in his
// reviews (a Laowa probe lens, sound gear and XLR, G&E). the rest fills it out to a
// believable rental-house catalog. quantities and every price are placeholders
// until Rob sends his real inventory and rate sheet.
//
// adding an item: one entry in GEAR. its page (/gear/<slug>) and its spot in the
// catalog, search and sitemap all come from this list.

import type { PhotoKey } from './photos';

export type CategoryId = 'cameras' | 'lenses' | 'lighting' | 'audio' | 'grip' | 'monitors' | 'kits';

export type Category = {
    id: CategoryId;
    label: string;
};

export const CATEGORIES: Category[] = [
    { id: 'cameras', label: 'Cameras' },
    { id: 'lenses', label: 'Lenses & filters' },
    { id: 'lighting', label: 'Lighting' },
    { id: 'audio', label: 'Audio' },
    { id: 'grip', label: 'Grip & support' },
    { id: 'monitors', label: 'Monitors & more' },
    { id: 'kits', label: 'Kits' }
];

export type KitPart = { slug: string; qty: number };

export type GearItem = {
    slug: string;
    name: string;
    brand: string;
    category: CategoryId;
    /** what's written on the tape: short, the way you'd label a case */
    tape: string;
    /** day rate in dollars. PLACEHOLDER until Rob's rate sheet */
    dayRate: number;
    summary: string;
    /** what comes in the case */
    includes: string[];
    specs: Array<[label: string, value: string]>;
    /** how many Rob has, which caps the quantity on a list. PLACEHOLDER */
    stock: number;
    /** other items that go with it, shown on its page */
    pairs: string[];
    /** shown on the home page */
    featured?: boolean;
    /** anything a renter needs to know before booking */
    note?: string;
    /** photos of it, first one on the card (see photos.ts). none: the tape-label tile stands in */
    photos?: PhotoKey[];
    /** kits only: what's inside */
    parts?: KitPart[];
};

export const GEAR: GearItem[] = [
    // --- cameras
    {
        slug: 'sony-fx3',
        name: 'Sony FX3',
        brand: 'Sony',
        category: 'cameras',
        tape: 'FX3',
        dayRate: 110,
        summary: 'Full-frame Cinema Line body. Small enough for a gimbal, clean enough for a feature.',
        includes: ['FX3 body with XLR top handle', 'Four NP-FZ100 batteries and a dual charger', 'Two 160GB CFexpress Type A cards and a reader', 'Body cap, strap and Pelican case'],
        specs: [
            ['Sensor', 'Full-frame, 12.1MP'],
            ['Recording', '4K up to 120p, 10-bit 4:2:2'],
            ['Log', 'S-Log3, S-Cinetone'],
            ['Base ISO', '800 / 12,800'],
            ['Mount', 'Sony E'],
            ['Media', 'CFexpress Type A, SD']
        ],
        stock: 2,
        pairs: ['sony-24-70-gm2', 'dji-rs3-pro', 'smallhd-indie-7', 'g4-lav'],
        featured: true,
        photos: ['sonyFx3']
    },
    {
        slug: 'blackmagic-6k',
        name: 'Blackmagic Pocket Cinema Camera 6K',
        brand: 'Blackmagic Design',
        category: 'cameras',
        tape: 'POCKET 6K',
        dayRate: 75,
        summary: 'Super 35 sensor, Blackmagic RAW and a native EF mount, so all the Canon glass just fits.',
        includes: ['Pocket 6K body in a SmallRig cage with top handle', 'Four batteries and a charger', 'Two 128GB CFast cards and a reader', 'Hard case'],
        specs: [
            ['Sensor', 'Super 35, 6144 × 3456'],
            ['Recording', 'Blackmagic RAW, ProRes, up to 6K 50p'],
            ['Dynamic range', '13 stops'],
            ['Mount', 'Canon EF'],
            ['Media', 'CFast 2.0, SD, USB-C SSD']
        ],
        stock: 1,
        pairs: ['canon-16-35', 'canon-70-200', 'sigma-18-35', 'tilta-nucleus'],
        featured: true,
        photos: ['blackmagic6k']
    },
    {
        slug: 'sony-a7s3',
        name: 'Sony a7S III',
        brand: 'Sony',
        category: 'cameras',
        tape: 'A7S III',
        dayRate: 85,
        summary: 'The low-light run-and-gun body. Balances on a Ronin in about a minute.',
        includes: ['a7S III body', 'Three NP-FZ100 batteries and a charger', 'Two 128GB SD cards', 'Body cap and strap'],
        specs: [
            ['Sensor', 'Full-frame, 12.1MP'],
            ['Recording', '4K up to 120p, 10-bit 4:2:2'],
            ['Log', 'S-Log3'],
            ['Stabilization', '5-axis in-body'],
            ['Mount', 'Sony E'],
            ['Media', 'CFexpress Type A, SD']
        ],
        stock: 2,
        pairs: ['dji-rs3-pro', 'sony-24-70-gm2', 'metabones-ef-e'],
        photos: ['sonyA7s3']
    },
    {
        slug: 'gopro-hero11',
        name: 'GoPro HERO11 Black',
        brand: 'GoPro',
        category: 'cameras',
        tape: 'HERO11',
        dayRate: 25,
        summary: 'For the shot nobody wants to risk the A camera on: car mounts, water, crash cams.',
        includes: ['HERO11 Black', 'Three Enduro batteries and a dual charger', '128GB microSD card', 'Suction, clamp and helmet mounts'],
        specs: [
            ['Recording', '5.3K 60p, 4K 120p'],
            ['Stabilization', 'HyperSmooth 5.0'],
            ['Waterproof', 'To 33 ft without a housing'],
            ['Media', 'microSD']
        ],
        stock: 3,
        pairs: ['dji-fpv', 'sony-a7s3'],
        photos: ['goproHero']
    },

    // --- lenses & filters
    {
        slug: 'sony-24-70-gm2',
        name: 'Sony FE 24-70mm f/2.8 GM II',
        brand: 'Sony',
        category: 'lenses',
        tape: '24-70 GM II',
        dayRate: 45,
        summary: 'The one zoom that stays on all day. Light, sharp wide open, quiet autofocus.',
        includes: ['Lens with front and rear caps', 'Hood', '82mm clear protector'],
        specs: [
            ['Mount', 'Sony E'],
            ['Aperture', 'f/2.8 constant'],
            ['Filter', '82mm'],
            ['Weight', '695 g']
        ],
        stock: 2,
        pairs: ['sony-fx3', 'sony-a7s3', 'diffusion-set'],
        photos: ['sony2470']
    },
    {
        slug: 'canon-16-35',
        name: 'Canon EF 16-35mm f/2.8L II',
        brand: 'Canon',
        category: 'lenses',
        tape: '16-35L',
        dayRate: 30,
        summary: 'Red-ring wide zoom. Lives in the case with the Pocket 6K, or goes on a Sony with the Metabones.',
        includes: ['Lens with front and rear caps', 'Petal hood', '82mm clear protector'],
        specs: [
            ['Mount', 'Canon EF'],
            ['Aperture', 'f/2.8 constant'],
            ['Filter', '82mm'],
            ['Weight', '640 g']
        ],
        stock: 1,
        pairs: ['blackmagic-6k', 'metabones-ef-e', 'canon-70-200'],
        photos: ['canon1635']
    },
    {
        slug: 'canon-70-200',
        name: 'Canon EF 70-200mm f/2.8L IS III',
        brand: 'Canon',
        category: 'lenses',
        tape: '70-200L',
        dayRate: 40,
        summary: 'Compression for interviews, reach for events, stabilized for handheld.',
        includes: ['Lens with front and rear caps', 'Hood and tripod collar', '77mm clear protector'],
        specs: [
            ['Mount', 'Canon EF'],
            ['Aperture', 'f/2.8 constant'],
            ['Stabilization', '3.5 stops'],
            ['Filter', '77mm']
        ],
        stock: 1,
        pairs: ['blackmagic-6k', 'metabones-ef-e', 'tripod-flowtech'],
        photos: ['canon70200']
    },
    {
        slug: 'sigma-18-35',
        name: 'Sigma 18-35mm f/1.8 Art',
        brand: 'Sigma',
        category: 'lenses',
        tape: '18-35 ART',
        dayRate: 30,
        summary: 'Fast Super 35 zoom that covers three primes’ worth of focal lengths.',
        includes: ['Lens with front and rear caps', 'Hood'],
        specs: [
            ['Mount', 'Canon EF'],
            ['Aperture', 'f/1.8 constant'],
            ['Coverage', 'APS-C / Super 35'],
            ['Filter', '72mm']
        ],
        stock: 1,
        pairs: ['blackmagic-6k', 'metabones-ef-e', 'sony-fx3'],
        photos: ['sigma1835']
    },
    {
        slug: 'laowa-probe',
        name: 'Laowa 24mm f/14 2X Macro Probe',
        brand: 'Laowa',
        category: 'lenses',
        tape: 'PROBE',
        dayRate: 85,
        summary: 'The bug’s-eye lens. A long, skinny barrel that gets inside sets, plates and products. Waterproof tip.',
        includes: ['Probe lens with caps', 'Mount adapters for the body you’re shooting', 'LED ring at the tip'],
        specs: [
            ['Focal length', '24mm'],
            ['Magnification', '2:1 macro'],
            ['Aperture', 'f/14 – f/40'],
            ['Barrel', '40 cm, waterproof front']
        ],
        stock: 1,
        pairs: ['aputure-mc-kit', 'sony-fx3', 'tripod-flowtech'],
        featured: true,
        note: 'Tell Rob what body you’re on and he’ll pack the right adapter.',
        photos: ['laowaProbe']
    },
    {
        slug: 'metabones-ef-e',
        name: 'Metabones EF to E-mount Smart Adapter',
        brand: 'Metabones',
        category: 'lenses',
        tape: 'EF › E',
        dayRate: 15,
        summary: 'Canon glass on a Sony body, with autofocus and stabilization intact.',
        includes: ['Adapter with caps'],
        specs: [
            ['From', 'Canon EF'],
            ['To', 'Sony E'],
            ['Electronics', 'Aperture, AF, IS']
        ],
        stock: 3,
        pairs: ['canon-16-35', 'canon-70-200', 'sigma-18-35'],
        photos: ['metabones']
    },
    {
        slug: 'diffusion-set',
        name: 'Black Pro-Mist filter set',
        brand: 'Tiffen',
        category: 'lenses',
        tape: 'PRO-MIST',
        dayRate: 25,
        summary: 'Softens digital edges and blooms the highlights. The music video look in three strengths.',
        includes: ['1/8, 1/4 and 1/2 Black Pro-Mist, 82mm', 'Step-up rings for 67, 72 and 77mm', 'Filter wallet'],
        specs: [
            ['Size', '82mm screw-in'],
            ['Strengths', '1/8, 1/4, 1/2']
        ],
        stock: 1,
        pairs: ['sony-24-70-gm2', 'canon-16-35'],
        photos: ['proMist']
    },

    // --- lighting
    {
        slug: 'arri-fresnel-kit',
        name: 'ARRI tungsten fresnel kit',
        brand: 'ARRI',
        category: 'lighting',
        tape: 'ARRI KIT',
        dayRate: 85,
        summary: 'Three classic hot lights in one case. Hard, beautiful light that skin loves.',
        includes: ['Two ARRI 650 Plus and one 300 Plus', 'Three light stands', 'Barn doors, wire scrims and gel frames', 'Chimera speed ring', 'Stingers and the case'],
        specs: [
            ['Output', '2 × 650W, 1 × 300W tungsten'],
            ['Color', '3200K'],
            ['Power', 'Standard household outlets'],
            ['Case', 'Aluminum hard case']
        ],
        stock: 2,
        pairs: ['frame-6x6', 'c-stand', 'sandbag'],
        featured: true,
        photos: ['arriKit', 'arriScrims']
    },
    {
        slug: 'aputure-300x',
        name: 'Aputure LS 300x',
        brand: 'Aputure',
        category: 'lighting',
        tape: '300X',
        dayRate: 50,
        summary: 'Bi-color LED with real punch. The key light for most interviews that come through.',
        includes: ['Light head and control box', 'Hyper reflector', 'AC power cable and V-mount plate', 'Carry case'],
        specs: [
            ['Output', '350W equivalent'],
            ['Color', '2700K – 6500K bi-color'],
            ['Mount', 'Bowens'],
            ['Control', 'App, DMX, onboard dimmer']
        ],
        stock: 3,
        pairs: ['light-dome', 'c-stand', 'sandbag'],
        featured: true,
        photos: ['aputure300x']
    },
    {
        slug: 'aputure-600d',
        name: 'Aputure LS 600d Pro',
        brand: 'Aputure',
        category: 'lighting',
        tape: '600D',
        dayRate: 90,
        summary: 'Daylight LED that stands in for a small HMI. Push it through a frame and fake the sun.',
        includes: ['Light head and control box', 'Hyper reflector', 'Head cable, AC cable and V-mount plate', 'Weatherproof case'],
        specs: [
            ['Output', '600W, roughly a 1.2K HMI'],
            ['Color', '5600K daylight'],
            ['Mount', 'Bowens'],
            ['Weather', 'IP54']
        ],
        stock: 1,
        pairs: ['frame-6x6', 'lantern', 'c-stand'],
        photos: ['aputure600d']
    },
    {
        slug: 'aputure-mc-kit',
        name: 'Aputure MC 4-light kit',
        brand: 'Aputure',
        category: 'lighting',
        tape: 'MC KIT',
        dayRate: 35,
        summary: 'Four pocket RGB lights with magnets. Practicals, edge light, color in the background.',
        includes: ['Four MC lights', 'Charging case', 'Diffusers and magnetic mounts'],
        specs: [
            ['Color', 'Full RGBWW, 3200K – 6500K'],
            ['Battery', 'About 2 hours each at full'],
            ['Control', 'Sidus Link app']
        ],
        stock: 2,
        pairs: ['laowa-probe', 'aputure-300x'],
        photos: ['aputureMc']
    },
    {
        slug: 'light-dome',
        name: 'Aputure Light Dome III',
        brand: 'Aputure',
        category: 'lighting',
        tape: 'DOME III',
        dayRate: 20,
        summary: 'A deep parabolic softbox with a grid. Turns a 300x into a soft, controllable key.',
        includes: ['Softbox', '1-stop and 2-stop diffusion', '40° fabric grid', 'Carry bag'],
        specs: [
            ['Diameter', '3 ft (90 cm)'],
            ['Mount', 'Bowens']
        ],
        stock: 3,
        pairs: ['aputure-300x', 'aputure-600d'],
        photos: ['lightDome']
    },
    {
        slug: 'lantern',
        name: 'Aputure Lantern 90',
        brand: 'Aputure',
        category: 'lighting',
        tape: 'LANTERN',
        dayRate: 15,
        summary: 'Soft, wraparound light for overhead fill or a table full of people.',
        includes: ['Lantern', 'Skirt'],
        specs: [
            ['Diameter', '35 in'],
            ['Mount', 'Bowens']
        ],
        stock: 2,
        pairs: ['aputure-600d', 'c-stand'],
        photos: ['lantern']
    },

    // --- audio
    {
        slug: 'mkh-416',
        name: 'Sennheiser MKH 416',
        brand: 'Sennheiser',
        category: 'audio',
        tape: '416',
        dayRate: 25,
        summary: 'The shotgun on half the sets in New York, for good reason.',
        includes: ['MKH 416', 'Foam windscreen', 'Clip and pouch'],
        specs: [
            ['Pattern', 'Supercardioid / lobar'],
            ['Power', '48V phantom'],
            ['Connector', 'XLR-3']
        ],
        stock: 3,
        pairs: ['boom-kit', 'zoom-f6', 'xlr-25'],
        photos: ['mkh416']
    },
    {
        slug: 'g4-lav',
        name: 'Sennheiser EW 112P G4 wireless lav',
        brand: 'Sennheiser',
        category: 'audio',
        tape: 'G4 LAV',
        dayRate: 35,
        summary: 'One channel of reliable wireless: bodypack, lav and camera receiver.',
        includes: ['SK 100 bodypack transmitter', 'EK 100 camera receiver', 'ME 2 lavalier', 'AA batteries for the day', 'Camera and XLR cables'],
        specs: [
            ['Range', 'Up to 100 m line of sight'],
            ['Band', 'UHF, frequency scan'],
            ['Power', '2 × AA per unit']
        ],
        stock: 4,
        pairs: ['zoom-f6', 'sony-fx3'],
        photos: ['g4Lav']
    },
    {
        slug: 'zoom-f6',
        name: 'Zoom F6 field recorder',
        brand: 'Zoom',
        category: 'audio',
        tape: 'F6',
        dayRate: 35,
        summary: 'Six inputs and 32-bit float, so nobody clips the take.',
        includes: ['F6 recorder', 'Battery sled and NP batteries', '64GB SD card', 'Timecode cable'],
        specs: [
            ['Inputs', '6 XLR/TRS'],
            ['Recording', '32-bit float, up to 192kHz'],
            ['Timecode', 'In / out']
        ],
        stock: 1,
        pairs: ['mkh-416', 'g4-lav', 'xlr-25'],
        photos: ['zoomF6']
    },
    {
        slug: 'boom-kit',
        name: 'Boom pole kit',
        brand: 'K-Tek / Rycote',
        category: 'audio',
        tape: 'BOOM',
        dayRate: 20,
        summary: 'Everything to fly a shotgun except the mic and the person holding it.',
        includes: ['K-Tek boom pole, internally cabled', 'Rycote shock mount', 'Blimp and furry windjammer', '25 ft XLR'],
        specs: [
            ['Length', '2 – 9 ft'],
            ['Cable', 'Internal coil, side exit']
        ],
        stock: 2,
        pairs: ['mkh-416', 'zoom-f6'],
        photos: ['rycoteWindshield']
    },
    {
        slug: 'xlr-25',
        name: 'XLR cable, 25 ft',
        brand: 'Rob’s Rentals',
        category: 'audio',
        tape: 'XLR 25′',
        dayRate: 3,
        summary: 'The one you forgot to pack. Rob keeps a pile.',
        includes: ['25 ft XLR-3 cable'],
        specs: [
            ['Length', '25 ft'],
            ['Connector', 'XLR-3 male to female']
        ],
        stock: 12,
        pairs: ['mkh-416', 'zoom-f6'],
        photos: ['xlrCable']
    },

    // --- grip & support
    {
        slug: 'dji-rs3-pro',
        name: 'DJI RS 3 Pro gimbal',
        brand: 'DJI',
        category: 'grip',
        tape: 'RS 3 PRO',
        dayRate: 55,
        summary: 'Carries an FX3 or a7S III with a zoom. Rob will help you balance it at pickup.',
        includes: ['RS 3 Pro with battery grip', 'Extended quick-release plates', 'Briefcase handle and tripod legs', 'Control cables for Sony and Canon', 'Charger and case'],
        specs: [
            ['Payload', 'Up to 4.5 kg'],
            ['Battery', 'About 12 hours'],
            ['Extras', 'Lidar focus compatible']
        ],
        stock: 2,
        pairs: ['sony-fx3', 'sony-a7s3', 'smallhd-indie-7'],
        featured: true,
        photos: ['djiGimbal']
    },
    {
        slug: 'tripod-flowtech',
        name: 'Sachtler Flowtech 75 with FSB 8 head',
        brand: 'Sachtler',
        category: 'grip',
        tape: 'FLOWTECH',
        dayRate: 45,
        summary: 'Fluid head sticks that set up in seconds and pan like butter.',
        includes: ['Flowtech 75 carbon legs', 'FSB 8 fluid head', 'Mid-level spreader', 'Padded bag'],
        specs: [
            ['Payload', 'Up to 10 kg'],
            ['Height', '25 – 61 in'],
            ['Bowl', '75mm']
        ],
        stock: 2,
        pairs: ['canon-70-200', 'sony-fx3', 'teleprompter'],
        photos: ['sachtlerTripod']
    },
    {
        slug: 'shoulder-rig',
        name: 'Shoulder rig with matte box',
        brand: 'Rob’s Rentals',
        category: 'grip',
        tape: 'SHOULDER RIG',
        dayRate: 30,
        summary: 'Wooden handles, counterweight and a clamp-on matte box. Handheld that looks intentional.',
        includes: ['Shoulder pad and 15mm rods', 'Wooden handgrips', 'Counterweight', 'Clamp-on matte box with flags'],
        specs: [
            ['Rods', '15mm LWS'],
            ['Matte box', 'Fits up to 114mm']
        ],
        stock: 1,
        pairs: ['sony-fx3', 'tilta-nucleus', 'smallhd-indie-7'],
        featured: true,
        photos: ['cameraRig']
    },
    {
        slug: 'tilta-nucleus',
        name: 'Tilta Nucleus-M wireless follow focus',
        brand: 'Tilta',
        category: 'grip',
        tape: 'NUCLEUS-M',
        dayRate: 45,
        summary: 'Two lens motors and a hand wheel, so your focus puller can work from across the room.',
        includes: ['Two Nucleus-M lens motors', 'Hand unit with focus wheel', 'Marking rings and lens gears', 'Rod clamps and run/stop cables', 'Zip case'],
        specs: [
            ['Motors', '2, focus / iris / zoom'],
            ['Range', 'Up to 1,000 ft line of sight'],
            ['Rods', '15mm']
        ],
        stock: 1,
        pairs: ['shoulder-rig', 'blackmagic-6k', 'smallhd-indie-7'],
        photos: ['followFocus']
    },
    {
        slug: 'c-stand',
        name: 'C-stand with grip arm',
        brand: 'Avenger',
        category: 'grip',
        tape: 'C-STAND',
        dayRate: 10,
        summary: 'Forty-inch C-stand with arm and head. You will want more than you think.',
        includes: ['40 in C-stand', '40 in grip arm and gobo head'],
        specs: [
            ['Max height', '10.5 ft'],
            ['Base', 'Turtle, removable']
        ],
        stock: 10,
        pairs: ['sandbag', 'frame-6x6'],
        photos: ['cStand']
    },
    {
        slug: 'sandbag',
        name: 'Sandbag, 15 lb',
        brand: 'Rob’s Rentals',
        category: 'grip',
        tape: 'SANDBAG',
        dayRate: 2,
        summary: 'One per stand, minimum. Two if it’s windy.',
        includes: ['15 lb saddle sandbag'],
        specs: [['Weight', '15 lb']],
        stock: 20,
        pairs: ['c-stand'],
        photos: ['sandbag']
    },
    {
        slug: 'apple-boxes',
        name: 'Apple box set',
        brand: 'Rob’s Rentals',
        category: 'grip',
        tape: 'APPLE BOX',
        dayRate: 10,
        summary: 'Full, half, quarter and pancake. Raises people, props and the camera.',
        includes: ['Full, half, quarter and pancake apple boxes'],
        specs: [['Full', '20 × 12 × 8 in']],
        stock: 3,
        pairs: ['c-stand'],
        photos: ['appleBox']
    },
    {
        slug: 'frame-6x6',
        name: '6×6 frame with diffusion',
        brand: 'Matthews',
        category: 'grip',
        tape: '6×6',
        dayRate: 30,
        summary: 'A six-foot frame of half grid cloth. Turns a hard light, or the sun, into a window.',
        includes: ['6×6 ft frame', '1/2 grid cloth', 'Ultrabounce', 'Two ears and a bag'],
        specs: [
            ['Size', '6 × 6 ft'],
            ['Rags', '1/2 grid, Ultrabounce']
        ],
        stock: 2,
        pairs: ['c-stand', 'sandbag', 'aputure-600d'],
        photos: ['frame6x6']
    },

    // --- monitors & more
    {
        slug: 'smallhd-indie-7',
        name: 'SmallHD Indie 7',
        brand: 'SmallHD',
        category: 'monitors',
        tape: 'INDIE 7',
        dayRate: 40,
        summary: 'A bright seven-inch touch monitor with LUTs, scopes and focus assist.',
        includes: ['Indie 7 monitor', 'Two Sony L-series batteries and a charger', 'Sun hood', 'HDMI and SDI cables', 'Articulating arm'],
        specs: [
            ['Screen', '7 in touchscreen, 1000 nits'],
            ['Inputs', 'HDMI, two 3G-SDI (one loops out)'],
            ['Tools', 'LUTs, waveform, focus and exposure assist']
        ],
        stock: 2,
        pairs: ['sony-fx3', 'dji-rs3-pro'],
        photos: ['smallhdIndie7']
    },
    {
        slug: 'teleprompter',
        name: 'Glide Gear TMP100 teleprompter',
        brand: 'Glide Gear',
        category: 'monitors',
        tape: 'PROMPTER',
        dayRate: 45,
        summary: 'For CEOs, hosts and anyone who didn’t memorize it. Runs off an iPad or a phone.',
        includes: ['Beam-splitter glass and hood', 'Tablet and phone mounts', 'Carry bag'],
        specs: [
            ['Reading range', 'Up to 10 ft'],
            ['Fits', 'Tablets up to 10.5 × 8 in, and phones'],
            ['Mount', 'Standard tripod plate']
        ],
        stock: 1,
        pairs: ['tripod-flowtech', 'aputure-300x', 'g4-lav'],
        photos: ['teleprompter']
    },
    {
        slug: 'dji-fpv',
        name: 'DJI FPV drone',
        brand: 'DJI',
        category: 'monitors',
        tape: 'FPV',
        dayRate: 90,
        summary: 'Fast, immersive flying for chase shots and fly-throughs.',
        includes: ['DJI FPV aircraft', 'FPV Goggles V2', 'Remote controller', 'Three flight batteries and a charging hub', 'Spare propellers'],
        specs: [
            ['Video', '4K 60p, 120 Mbps'],
            ['Top speed', '87 mph in manual mode'],
            ['Flight time', 'About 20 minutes per battery']
        ],
        stock: 1,
        pairs: ['gopro-hero11'],
        featured: true,
        note: 'Rented to FAA Part 107 certified pilots only. NYC permits are on the production.',
        photos: ['djiFpv']
    },

    // --- kits: their day rate is the package price, below the sum of the parts
    {
        slug: 'kit-interview',
        name: 'Interview kit',
        brand: 'Rob’s Rentals',
        category: 'kits',
        tape: 'INTERVIEW KIT',
        dayRate: 295,
        summary: 'A two-light sit-down with clean sound. The corporate, doc and podcast-on-camera setup.',
        includes: [],
        specs: [
            ['Camera', 'Sony FX3 with 24-70 GM II'],
            ['Light', 'Two 300x, one Light Dome'],
            ['Sound', '416 on a stand, plus a wireless lav']
        ],
        parts: [
            { slug: 'sony-fx3', qty: 1 },
            { slug: 'sony-24-70-gm2', qty: 1 },
            { slug: 'aputure-300x', qty: 2 },
            { slug: 'light-dome', qty: 1 },
            { slug: 'mkh-416', qty: 1 },
            { slug: 'g4-lav', qty: 1 },
            { slug: 'tripod-flowtech', qty: 1 },
            { slug: 'c-stand', qty: 2 },
            { slug: 'sandbag', qty: 4 }
        ],
        stock: 1,
        pairs: ['teleprompter', 'smallhd-indie-7'],
        featured: true
    },
    {
        slug: 'kit-doc',
        name: 'Run-and-gun doc kit',
        brand: 'Rob’s Rentals',
        category: 'kits',
        tape: 'DOC KIT',
        dayRate: 185,
        summary: 'One shooter, one bag, all day on the street. Gimbal, wireless and a little light.',
        includes: [],
        specs: [
            ['Camera', 'Sony a7S III with 24-70 GM II'],
            ['Support', 'DJI RS 3 Pro'],
            ['Sound and light', 'Wireless lav, four MC lights']
        ],
        parts: [
            { slug: 'sony-a7s3', qty: 1 },
            { slug: 'sony-24-70-gm2', qty: 1 },
            { slug: 'dji-rs3-pro', qty: 1 },
            { slug: 'g4-lav', qty: 1 },
            { slug: 'aputure-mc-kit', qty: 1 }
        ],
        stock: 1,
        pairs: ['gopro-hero11', 'diffusion-set'],
        featured: true
    },
    {
        slug: 'kit-music-video',
        name: 'Music video lighting kit',
        brand: 'Rob’s Rentals',
        category: 'kits',
        tape: 'LIGHT KIT',
        dayRate: 210,
        summary: 'Hard tungsten, a big daylight source, color for the background and the grip to rig it.',
        includes: [],
        specs: [
            ['Hard light', 'ARRI fresnel kit'],
            ['Big source', '600d Pro through a 6×6'],
            ['Color', 'Four MC lights']
        ],
        parts: [
            { slug: 'arri-fresnel-kit', qty: 1 },
            { slug: 'aputure-600d', qty: 1 },
            { slug: 'aputure-mc-kit', qty: 1 },
            { slug: 'frame-6x6', qty: 1 },
            { slug: 'c-stand', qty: 3 },
            { slug: 'sandbag', qty: 6 }
        ],
        stock: 1,
        pairs: ['diffusion-set', 'shoulder-rig'],
        featured: true
    }
];

const BY_SLUG = new Map(GEAR.map((item) => [item.slug, item]));

export function getGear(slug: string): GearItem | undefined {
    return BY_SLUG.get(slug);
}

export function getCategory(id: CategoryId): Category {
    const category = CATEGORIES.find((candidate) => candidate.id === id);
    if (!category) throw new Error(`unknown category: ${id}`);
    return category;
}

export function isCategoryId(value: string | null): value is CategoryId {
    return CATEGORIES.some((category) => category.id === value);
}

/** what a kit would cost a day if every piece were rented on its own */
export function kitPartsValue(item: GearItem): number {
    return (item.parts ?? []).reduce((sum, part) => sum + (getGear(part.slug)?.dayRate ?? 0) * part.qty, 0);
}

export function countIn(category: CategoryId): number {
    return GEAR.filter((item) => item.category === category).length;
}
