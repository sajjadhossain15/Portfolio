import { Discipline, Project, Principle, StudioStat, Testimonial } from '../types';

export const DISCIPLINES: Discipline[] = [
  {
    id: 'graphic-design',
    index: '01',
    category: 'DESIGN',
    name: 'Graphic Design',
    tagline: 'High-contrast editorial layouts and bespoke tactile print artifact design.',
    description: 'Engineering poster typography, art direction, publication layouts, and physical brand touchpoints with mathematical rigor and haute couture aesthetic.',
    previewImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1600&q=80',
    bgVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-3d-sphere-animation-41487-large.mp4',
    portalWorldQuote: 'Where structural grid systems become living, breathing visual art.',
    deliverables: ['Publication Layouts', 'Editorial Typography', 'Poster Design', 'Art Direction', 'Tactile Print Artifacts']
  },
  {
    id: 'brand-identity',
    index: '02',
    category: 'BRANDING',
    name: 'Brand Identity',
    tagline: 'Timeless visual systems built from narrative and spatial architecture.',
    description: 'We engineer complete branding systems — from custom logotypes and brand guidelines to digital brand worlds and sensory identity systems.',
    previewImage: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1600&q=80',
    bgVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-fast-line-lights-in-darkness-41548-large.mp4',
    portalWorldQuote: 'A brand is a living environment that evokes emotion before a single word is read.',
    deliverables: ['Custom Logotypes', 'Brand Architecture', 'Visual Design Guidelines', 'Sensory Brand Worlds', 'Brand Strategy']
  },
  {
    id: 'automotive-design',
    index: '03',
    category: 'AUTOMOTIVE',
    name: 'Automotive Design',
    tagline: 'Aerodynamic form meets ultra-luxury digital cockpits.',
    description: 'Conceptual vehicle styling, HMI digital dashboard design, hyper-realistic 3D exterior rendering, and launch film direction for next-gen electric mobility.',
    previewImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80',
    bgVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    portalWorldQuote: 'Sculpting velocity into obsidian glass and light.',
    deliverables: ['Conceptual Vehicle Styling', 'Digital Cockpit HMI', '3D Exterior Rendering', 'Launch Film Direction', 'Aerodynamic Form']
  },
  {
    id: 'motion-graphics',
    index: '04',
    category: 'MOTION',
    name: 'Motion Graphics',
    tagline: 'Rhythmic kinetic design and broadcast motion systems for screen & stage.',
    description: 'Keynote sequences, kinetic title cards, broadcast idents, and responsive digital interface animations engineered with fluid physics.',
    previewImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
    bgVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-laser-lights-in-a-dark-room-41551-large.mp4',
    portalWorldQuote: 'Transforming static graphic geometry into mesmerizing temporal choreography.',
    deliverables: ['Keynote Sequences', 'Kinetic Title Cards', 'Broadcast Idents', 'Interface Motion Systems', 'Fluid Physics FX']
  },
  {
    id: 'animation',
    index: '05',
    category: 'ANIMATION',
    name: 'Animation',
    tagline: 'Character, worldbuilding, and frame-by-frame cinematic narrative.',
    description: 'Narrative short films, commercial spots, stylized 2D hand-drawn frames, and complex 3D character rigging designed to elicit genuine human emotion.',
    previewImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1600&q=80',
    bgVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    portalWorldQuote: 'Giving soul, weight, and personality to the impossible.',
    deliverables: ['Narrative Short Films', 'Commercial Animation', 'Stylized 2D Frames', '3D Character Rigging', 'Cinematic Worldbuilding']
  },
  {
    id: '3d-visualization',
    index: '06',
    category: '3D & CGI',
    name: '3D Visualization',
    tagline: 'Photorealistic CGI and procedural lighting that redefine digital realism.',
    description: 'Photorealistic CGI, procedural materials, and lighting studies for high-end luxury goods, horology, architecture, and industrial design.',
    previewImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    bgVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tunnel-of-futuristic-neon-lights-41550-large.mp4',
    portalWorldQuote: 'Bending rays of light to craft uncompromised photorealism.',
    deliverables: ['Photorealistic CGI', 'Procedural Shaders', 'Horology Renders', 'Architectural Lighting', 'Industrial Design Renders']
  },
  {
    id: 'visual-effects',
    index: '07',
    category: 'VFX',
    name: 'Visual Effects (VFX)',
    tagline: 'Invisible CGI, particle dynamics, and otherworldly film compositing.',
    description: 'Seamless green screen compositing, particle simulations, atmospheric lighting, and digital matte painting for film, music, and commercial projects.',
    previewImage: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1600&q=80',
    bgVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    portalWorldQuote: 'Where real-world cinema seamlessly merges with pure imagination.',
    deliverables: ['Green Screen Compositing', 'Particle Dynamics', 'Atmospheric Lighting', 'Digital Matte Painting', 'Film & Commercial VFX']
  },
  {
    id: 'product-visualization',
    index: '08',
    category: 'PRODUCT',
    name: 'Product Visualization',
    tagline: 'Tactile luxury product reveals and micro-mechanical macro CGI.',
    description: 'Highlighting craftsmanship, watchmaking mechanics, luxury packaging, and consumer technology through hyper-detailed macro closeups and studio lighting.',
    previewImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=80',
    bgVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    portalWorldQuote: 'Capturing the micro-texture of luxury at microscopic precision.',
    deliverables: ['Macro Closeup Renders', 'Watchmaking Mechanics', 'Luxury Packaging CGI', 'Exploded View Animations', 'Tactile Texture Renders']
  },
  {
    id: 'ui-ux-design',
    index: '09',
    category: 'DIGITAL UI',
    name: 'UI / UX Design',
    tagline: 'Immersive digital platforms with tactile spatial elegance.',
    description: 'High-craft web platforms, mobile applications, spatial interfaces, and design tokens built for luxury brands and modern software pioneers.',
    previewImage: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1600&q=80',
    bgVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tunnel-of-futuristic-neon-lights-41550-large.mp4',
    portalWorldQuote: 'Digital interfaces crafted like luxury architectural spaces.',
    deliverables: ['High-Craft Web Platforms', 'Spatial Interfaces', 'Mobile App UX', 'Design Systems & Tokens', 'Tactile UI Prototypes']
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'vantara-concept',
    title: 'Vantara — Concept Vehicle Identity',
    tag: 'Automotive Design',
    category: 'Automotive',
    year: '2026',
    client: 'Vantara Electric Mobility',
    heroImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    gallery: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80'
    ],
    brief: 'Vantara approached us to define the visual branding, exterior aero-sculpting, and digital cockpit HMI for their inaugural electric grand tourer.',
    concept: 'We crafted a silhouette inspired by deep sea aerodynamics and obsidian glass. The logo features a kinetic light bar that pulsates according to driver heartbeat and battery regeneration state.',
    stats: [
      { label: 'Drag Coefficient', value: '0.19 Cd' },
      { label: 'Digital Displays', value: '4K OLED' },
      { label: 'Global Impressions', value: '4.2M' }
    ],
    results: [
      'Featured in TopGear, Designboom, and Wallpaper* Automotive Awards 2026',
      'Secured $45M in pre-series funding following Geneva Mobility Reveal',
      '100% custom-built digital cockpit design system'
    ]
  },
  {
    id: 'noir-atelier',
    title: 'Noir Atelier — Luxury Fashion House',
    tag: 'Brand Identity',
    category: 'Branding',
    year: '2025',
    client: 'Noir Atelier Paris',
    heroImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    gallery: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80'
    ],
    brief: 'A complete brand transformation for a century-old Parisian haute couture house expanding into digital drops and physical flagship experiences.',
    concept: 'We created a bespoke serif typeface "Noir Display" with high-contrast hairlines, paired with custom foil-stamped cotton paper packaging and an ultra-minimalist web flagship.',
    stats: [
      { label: 'Custom Typefaces', value: '2 Weights' },
      { label: 'E-Commerce Conversion', value: '+68%' },
      { label: 'Flagship Locations', value: 'Paris & Tokyo' }
    ],
    results: [
      'Redesigned full packaging suite across 240 luxury SKUs',
      'Awarded "Best Brand Identity" at Paris Fashion Week Design Summit',
      'Custom web experience featured as Site of the Day on Awwwards'
    ]
  },
  {
    id: 'aether-film',
    title: 'Aether — Launch Film',
    tag: 'Motion & VFX',
    category: 'Motion',
    year: '2025',
    client: 'Aether Audio',
    heroImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    gallery: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80'
    ],
    brief: 'A 90-second launch film for a spatial acoustic speaker system that translates soundwaves into liquid metal visual simulations.',
    concept: 'Using Houdini fluid simulations and Redshift GPU rendering, we sculpted sound into iridescent metallic droplets that react synchronously to orchestral bass frequencies.',
    stats: [
      { label: 'Render Frames', value: '14,400' },
      { label: 'Sim Resolution', value: '80M Particles' },
      { label: 'Video Views', value: '12M+' }
    ],
    results: [
      'Won Gold Motion Award 2025 for Product Launch Motion',
      'Boosted pre-order signups by 310% in the first week',
      'Licensed by Apple Music for spatial audio promotional displays'
    ]
  },
  {
    id: 'hyperion-watch',
    title: 'Hyperion — Kinetic Horology 3D',
    tag: '3D Visualization',
    category: '3D & VFX',
    year: '2025',
    client: 'Geneva Horology Co.',
    heroImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80'
    ],
    brief: 'An exploded 3D mechanical watch breakdown film revealing 312 hand-assembled titanium components.',
    concept: 'We engineered custom macro cameras and sapphire glass refraction shaders to allow viewers to peer deep inside the tourbillon movement.',
    stats: [
      { label: 'Watch Components', value: '312 Parts' },
      { label: 'Texture Resolution', value: '8K Micro-scratch' },
      { label: 'Client Sale Price', value: '$180,000/pc' }
    ],
    results: [
      'Limited edition of 50 timepieces sold out within 48 hours of video release',
      'Featured in Hodinkee and GQ Watch Annual',
      'Interactive 3D configurator implemented on Geneva website'
    ]
  },
  {
    id: 'lumina-spatial',
    title: 'Lumina — Spatial Experience UI',
    tag: 'UI/UX & Spatial',
    category: 'UI/UX',
    year: '2025',
    client: 'Lumina Vision Labs',
    heroImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
    ],
    brief: 'Designing the gesture-based spatial interface and atmospheric glass UI for Lumina’s mixed reality headsets.',
    concept: 'We avoided heavy skeuomorphism in favor of light refraction, eye-tracked focal depths, and micro-haptic sound feedback.',
    stats: [
      { label: 'Latency Target', value: '< 8ms' },
      { label: 'User Rating', value: '4.9/5' },
      { label: 'Patents Filed', value: '3 UI Patents' }
    ],
    results: [
      'Adopted as the official OS design language for Lumina OS 2.0',
      'Winner of FWA Of the Month and Red Dot Best of Best 2025'
    ]
  },
  {
    id: 'apex-formula',
    title: 'Apex Formula — Motorsport Rebrand',
    tag: 'Brand & Motion',
    category: 'Branding',
    year: '2024',
    client: 'Apex Racing Team UK',
    heroImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
    ],
    brief: 'Full livery design, paddock architectural identity, and broadcast graphics for an independent Formula E team.',
    concept: 'A high-contrast neon carbon livery that shifts hue depending on track speed and telemetry heat maps.',
    stats: [
      { label: 'Broadcast Viewers', value: '85M' },
      { label: 'Livery Material', value: 'Reflective Vinyl' }
    ],
    results: [
      'Voted "Best Motorsport Livery" by Formula E Fan Choice 2024',
      'Uniform merchandise sales surpassed $2.8M in season 1'
    ]
  }
];

export const PRINCIPLES: Principle[] = [
  {
    id: 'p1',
    lead: 'Simplicity,',
    accent: 'with purpose.',
    description: 'We strip away noise until every line, margin, and keyframe carries structural intent.'
  },
  {
    id: 'p2',
    lead: 'Craftsmanship',
    accent: 'over trends.',
    description: 'Short-lived aesthetics fade in months. We design systems engineered to feel pristine for a decade.'
  },
  {
    id: 'p3',
    lead: 'Storytelling',
    accent: 'before decoration.',
    description: 'A beautiful visual without narrative is a distraction. Every frame we craft advances a core idea.'
  },
  {
    id: 'p4',
    lead: 'Motion',
    accent: 'with meaning.',
    description: 'Physics, weight, and cadence give digital interfaces soul. We treat animation as an extension of human intent.'
  },
  {
    id: 'p5',
    lead: 'Emotion,',
    accent: 'driven by design.',
    description: 'Logic gains buy-in, but emotion creates devotion. We build brand worlds that people feel instantly.'
  },
  {
    id: 'p6',
    lead: 'Timeless,',
    accent: 'never trendy.',
    description: 'By rooting our work in mathematical proportions and rich typography, we avoid generic AI templates.'
  }
];

export const STUDIO_STATS: StudioStat[] = [
  { label: 'Projects Completed', value: '140+', subtext: 'Across 18 countries' },
  { label: 'Design Awards', value: '32', subtext: 'Awwwards, FWA, Red Dot, Formula Design' },
  { label: 'Years of Craft', value: '10+', subtext: 'Founded in Dhaka, working globally' },
  { label: 'Client Retention', value: '94%', subtext: 'Long-term brand guardianship' }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote: 'The Imagination Studio brought an artistic gravity to our launch that completely set us apart from Silicon Valley clichés. The result was pure luxury.',
    client: 'Antoine Laurent',
    company: 'Vantara Mobility',
    discipline: 'Automotive Design & Launch Film'
  },
  {
    id: 't2',
    quote: 'Rarely do you find a team that moves seamlessly between 3D mechanical CGI, bespoke typography, and high-conversion UI. They executed our Geneva reveal flawlessly.',
    client: 'Claire De' + 'voir',
    company: 'Geneva Horology',
    discipline: '3D Visualization & Brand'
  },
  {
    id: 't3',
    quote: 'Working with them feels like collaborating with a master craftsman atelier. They respect time, deadline, and above all, absolute aesthetic purity.',
    client: 'Julian Thorne',
    company: 'Noir Atelier Paris',
    discipline: 'Brand Identity'
  }
];
