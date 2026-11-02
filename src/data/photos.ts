// every photo on the site, with its alt text and where it came from.
//
// 'own': Rob's own shots of his gear, posted by his business on his Google Business
// Profile (Aug 2022), cropped to fill.
// 'stock': a product image on white, shown whole. three of them (GoPro, DJI gimbal,
// Aputure 300x) Rob posted himself; the rest are the makers' own product shots, standing
// in until Rob photographs his own gear.
// get Rob's OK before launch, and swap the stock ones for his own shots as he takes them.
//
// files live in public/images; drop a .jpg in there and run `npm run images`.

export type PhotoInfo = {
    src: string;
    alt: string;
    /** 'own': Rob's photo, cropped to fill. 'stock': a product image on white, shown whole */
    kind: 'own' | 'stock';
    /** focal point for object-position when the photo is cropped, e.g. '50% 30%' */
    focus?: string;
};

export const PHOTOS = {
    arriKit: {
        src: '/images/gear/arri-fresnel-kit.webp',
        alt: 'An open aluminum case holding three blue ARRI fresnel lights, coiled cables, stands and a Chimera speed ring',
        kind: 'own',
        focus: '50% 55%'
    },
    arriScrims: {
        src: '/images/gear/arri-scrims.webp',
        alt: 'A hand holding round wire scrims with green and red rims over the ARRI kit case',
        kind: 'own',
        focus: '50% 45%'
    },
    blackmagic6k: {
        src: '/images/gear/blackmagic-6k-kit.webp',
        alt: 'A Blackmagic Pocket Cinema Camera 6K in a SmallRig cage, packed in a hard case with a Canon 16-35mm lens',
        kind: 'own',
        focus: '50% 82%'
    },
    canon1635: {
        src: '/images/gear/blackmagic-6k-kit.webp',
        alt: 'A Canon EF 16-35mm f/2.8L lens packed in a hard case above a Blackmagic Pocket 6K',
        kind: 'own',
        focus: '50% 18%'
    },
    cameraRig: {
        src: '/images/gear/camera-rig.webp',
        alt: 'A Sony camera with a G Master zoom on a shoulder rig with wooden handgrips and a top handle, set up on a tripod',
        kind: 'own',
        focus: '45% 50%'
    },
    followFocus: {
        src: '/images/gear/wireless-follow-focus.webp',
        alt: 'An open zip case holding a wireless follow focus kit: two lens motors, a hand unit with a focus wheel, marking rings and cables',
        kind: 'own',
        focus: '65% 50%'
    },
    djiFpv: {
        src: '/images/gear/dji-fpv.webp',
        alt: 'A DJI FPV drone sitting on a wooden table',
        kind: 'own',
        focus: '45% 60%'
    },
    goproHero: {
        src: '/images/gear/gopro-hero.webp',
        alt: 'A GoPro HERO Black action camera, front view with its front screen on',
        kind: 'stock'
    },
    djiGimbal: {
        src: '/images/gear/dji-rs-gimbal.webp',
        alt: 'A DJI RS gimbal carrying a cinema camera with a prime lens',
        kind: 'stock'
    },
    aputure300x: {
        src: '/images/gear/aputure-300x.webp',
        alt: 'An Aputure Light Storm LS 300x LED light on its yoke with a reflector',
        kind: 'stock'
    },

    // makers' product shots, standing in for Rob's own
    sonyFx3: { src: '/images/gear/sony-fx3.webp', alt: 'A Sony FX3 cinema camera body, front view with no lens', kind: 'stock' },
    sonyA7s3: { src: '/images/gear/sony-a7s3.webp', alt: 'A Sony a7S III camera body, front view with no lens', kind: 'stock' },
    sony2470: { src: '/images/gear/sony-24-70-gm2.webp', alt: 'A Sony FE 24-70mm f/2.8 GM II zoom lens', kind: 'stock' },
    canon70200: { src: '/images/gear/canon-70-200.webp', alt: 'A white Canon EF 70-200mm f/2.8L IS III zoom lens', kind: 'stock' },
    sigma1835: { src: '/images/gear/sigma-18-35.webp', alt: 'A Sigma 18-35mm f/1.8 Art zoom lens with its hood on', kind: 'stock' },
    laowaProbe: { src: '/images/gear/laowa-probe.webp', alt: 'A Laowa 24mm probe lens, a long thin barrel, mounted on a camera body', kind: 'stock' },
    metabones: { src: '/images/gear/metabones-ef-e.webp', alt: 'A Metabones EF to E-mount adapter with its tripod foot', kind: 'stock' },
    proMist: { src: '/images/gear/tiffen-pro-mist.webp', alt: 'A Tiffen Black Pro-Mist screw-in filter', kind: 'stock' },
    aputure600d: { src: '/images/gear/aputure-600d-pro.webp', alt: 'An Aputure LS 600d Pro LED light on its yoke with a reflector', kind: 'stock' },
    aputureMc: { src: '/images/gear/aputure-mc-kit.webp', alt: 'Four Aputure MC pocket LED lights in their open charging case', kind: 'stock' },
    lightDome: { src: '/images/gear/aputure-light-dome-3.webp', alt: 'An Aputure Light Dome III, a deep round softbox, on a light', kind: 'stock' },
    lantern: { src: '/images/gear/aputure-lantern-90.webp', alt: 'An Aputure Lantern 90, a round lantern softbox, on a light', kind: 'stock' },
    mkh416: { src: '/images/gear/sennheiser-mkh-416.webp', alt: 'A Sennheiser MKH 416 shotgun microphone', kind: 'stock' },
    g4Lav: { src: '/images/gear/sennheiser-g4-lav.webp', alt: 'A Sennheiser G4 wireless set: bodypack transmitter, camera receiver and lavalier mic', kind: 'stock' },
    zoomF6: { src: '/images/gear/zoom-f6.webp', alt: 'A Zoom F6 field recorder seen from above, with its screen and input knobs', kind: 'stock' },
    rycoteWindshield: { src: '/images/gear/rycote-windshield.webp', alt: 'A Rycote blimp windshield on a pistol grip', kind: 'stock' },
    xlrCable: { src: '/images/gear/xlr-cable.webp', alt: 'A coiled black XLR microphone cable', kind: 'stock' },
    sachtlerTripod: { src: '/images/gear/sachtler-fsb8.webp', alt: 'A Sachtler fluid head on carbon tripod legs, next to its padded bag', kind: 'stock' },
    cStand: { src: '/images/gear/avenger-c-stand.webp', alt: 'A black C-stand with a grip arm and head', kind: 'stock' },
    sandbag: { src: '/images/gear/matthews-sandbag.webp', alt: 'A black saddle sandbag', kind: 'stock' },
    appleBox: { src: '/images/gear/matthews-apple-box.webp', alt: 'A wooden full apple box standing on end', kind: 'stock' },
    frame6x6: { src: '/images/gear/matthews-6x6-frame.webp', alt: 'A 6×6 frame with white diffusion, raised on a rolling stand', kind: 'stock' },
    smallhdIndie7: { src: '/images/gear/smallhd-indie-7.webp', alt: 'A SmallHD Indie 7 on-camera monitor, front view', kind: 'stock' },
    teleprompter: { src: '/images/gear/glide-gear-tmp100.webp', alt: 'A Glide Gear TMP100 teleprompter mounted on a camera, with its carry bag', kind: 'stock' }
} satisfies Record<string, PhotoInfo>;

export type PhotoKey = keyof typeof PHOTOS;
