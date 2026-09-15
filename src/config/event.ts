import logoImg from '../assets/logo.png';
import abshirLogo from '../assets/abshir logo.png';
import enkuImg from '../assets/enku.jpg';
import asset10666 from '../assets/10666 [Converted].jpg';
import artboard2 from '../assets/Artboard 1 copy 2-100.jpg';
import artboard3 from '../assets/Artboard 1 copy 3-100.jpg';
import artboard4 from '../assets/Artboard 1 copy 4-100.jpg';
import artistesImg from '../assets/artistes.png';
import djLeft1Img from '../assets/dj-left-1.png';
import djLeft2Img from '../assets/dj-left-2.png';
import djRight1Img from '../assets/dj-right-1.png';
import djRight2Img from '../assets/dj-right-2.png';
import asterImg from '../assets/aster.png';
import mamshaFestVideo from '../assets/MAMSHA FEST.mp4';
import mamshaFest3Video from '../assets/MAMSHA FEST 3.mp4';
import enkuuLogo from '../assets/enkuu.png';
import mamshaFestLogo from '../assets/mamsha.png';
import papaGardenLogo from '../assets/papa.png';
import v1Img from '../assets/v1.png';
import v2Img from '../assets/v2.png';
import v3Img from '../assets/v3.png';
import v4Img from '../assets/v4.png';
import artImg from '../assets/art.jfif';
import gebetaImg from '../assets/gebeta.jpg';
import noImg from '../assets/no.jpg';



export interface HeroVideoConfig {
  id: string;
  src: string;
  poster: string;
  title: string;
  subtitle: string;
  objectPosition: string;
  duration: number; // in seconds
  transitionType: 'fade' | 'sweep' | 'scale';
}

export interface HighlightItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tags: string[];
}

export interface ScheduleItem {
  time: string;
  title: string;
  artist: string;
  stage: string;
  category: 'music' | 'art' | 'vip' | 'keynote';
  description: string;
}

export interface DaySchedule {
  dayId: string;
  dayTitle: string;
  date: string;
  items: ScheduleItem[];
}

export interface TicketTier {
  id: string;
  name: string;
  badge: string;
  priceUSD: number;
  priceETB: number;
  description: string;
  availability: string;
  availabilityPercentage: number;
  featured?: boolean;
  benefits: string[];
  colorTheme: 'bronze' | 'gold' | 'diamond';
}

export interface GalleryMedia {
  id: string;
  title: string;
  category: string;
  src: string;
  type: 'image' | 'video';
  aspectRatio: 'square' | 'portrait' | 'landscape' | 'wide';
}

export interface VendorLogo {
  id: string;
  name: string;
  category: string;
  logoText: string;
  symbol: string;
  logoImage?: string;
}

export interface Artist {
  id: string;
  name: string;
  role: string;
  category: 'headliner' | 'ethio-electronic' | 'orchestral' | 'global-dj' | 'underground';
  secondaryCategory?: 'headliner' | 'ethio-electronic' | 'orchestral' | 'global-dj' | 'underground';
  stage: string;
  time: string;
  genre: string;
  image: string;
  bio: string;
  badge?: string;
  popularTrack?: string;
  socials?: {
    spotify?: string;
    instagram?: string;
    soundcloud?: string;
  };
}

export interface ConcertTrailerChapter {
  id: string;
  title: string;
  timestamp: string;
  timeSec: number;
  description: string;
}

export interface ConcertTrailerVideoOption {
  id: string;
  title: string;
  label: string;
  src: string;
}

export interface ConcertTrailerConfig {
  videoUrl: string;
  videoOptions: ConcertTrailerVideoOption[];
  posterUrl: string;
  title: string;
  edition: string;
  subtitle: string;
  durationFormatted: string;
  durationSec: number;
  stats: {
    value: string;
    label: string;
    detail: string;
  }[];
  chapters: ConcertTrailerChapter[];
}

export interface EventConfig {
  eventName: string;
  eventEdition: string;
  tagline: string;
  subTagline: string;
  date: string;
  location: string;
  venueName: string;
  venueAddress: string;
  heroVideos: HeroVideoConfig[];
  trailer: ConcertTrailerConfig;
  artists: Artist[];
  about: {
    badge: string;
    title: string;
    description1: string;
    description2: string;
    stats: { label: string; value: string }[];
    mediaPoster: string;
  };
  highlights: HighlightItem[];
  organizers: VendorLogo[];
  vendors: VendorLogo[];
  schedule: DaySchedule[];
  venue: {
    name: string;
    subtitle: string;
    address: string;
    coordinates: string;
    description: string;
    features: string[];
    bgImage: string;
    mapUrl: string;
  };
  ticketTypes: TicketTier[];
  gallery: GalleryMedia[];
  socialLinks: { name: string; url: string; icon: string }[];
}

export const eventConfig: EventConfig = {
  eventName: "MAMSHA FEST",
  eventEdition: "2026 CINEMATIC EDITION",
  tagline: "THE EXPERIENCE BEGINS HERE",
  subTagline: "A SYNTHESIS OF HIGH SOUND, LUXURY ART, & UNFORGETTABLE MOMENTS",
  date: "SATURDAY, OCTOBER 3, 2026",
  location: "DIRE DAWA, ETHIOPIA",
  venueName: "PAPA",
  venueAddress: "PAPA, Dire Dawa, Ethiopia",

  heroVideos: [
    {
      id: "chapter-01",
      src: mamshaFest3Video,
      poster: asset10666,
      title: "EXPERIENCE THE MOMENT",
      subtitle: "CHAPTER I — MAMSHA FESTIVAL HIGHLIGHTS",
      objectPosition: "center center",
      duration: 10,
      transitionType: "sweep",
    },
    {
      id: "chapter-02",
      src: mamshaFest3Video,
      poster: artboard2,
      title: "FEEL THE ENERGY",
      subtitle: "CHAPTER II — ELECTRIFYING RHYTHMS OF DIRE DAWA",
      objectPosition: "50% 40%",
      duration: 10,
      transitionType: "scale",
    },
    {
      id: "chapter-03",
      src: mamshaFest3Video,
      poster: artboard3,
      title: "LIVE THE EXPERIENCE",
      subtitle: "CHAPTER III — ETERNAL MEMORIES AT PAPA",
      objectPosition: "center top",
      duration: 10,
      transitionType: "fade",
    },
  ],

  trailer: {
    videoUrl: mamshaFestVideo,
    videoOptions: [
      {
        id: "mamsha-1",
        title: "MAMSHA FESTIVAL — MAIN RECAP",
        label: "CUT 01 (MAIN)",
        src: mamshaFestVideo,
      },
      {
        id: "mamsha-3",
        title: "MAMSHA FESTIVAL — HIGH ENERGY",
        label: "CUT 02 (EXTENDED)",
        src: mamshaFest3Video,
      },
    ],
    posterUrl: asset10666,
    title: "MAMSHA FEST 2025 // OFFICIAL CINEMATIC RECAP",
    edition: "PREVIOUS EDITION ARCHIVE",
    subtitle: "Re-live the raw energy, laser skies, and electric crowd of last year's monumental gathering in Dire Dawa.",
    durationFormatted: "02:45",
    durationSec: 165,
    stats: [
      { value: "10,000+", label: "CROWD ENERGY", detail: "Rave under celestial lasers" },
      { value: "4 STAGES", label: "AUDIOVISUAL CANOPIES", detail: "Immersive 360° soundscapes" },
      { value: "100%", label: "SOLD OUT EDITION", detail: "Historic attendance milestone" },
      { value: "12 HRS", label: "PURE NIRVANA", detail: "From sunrise ritual to midnight finale" },
    ],
    chapters: [
      {
        id: "c1",
        title: "01 // Opening Gates & Cultural Ritual",
        timestamp: "00:15",
        timeSec: 15,
        description: "Artisan coffee ceremonies, ambient strings, and early festival arrivals.",
      },
      {
        id: "c2",
        title: "02 // Sunset Symphony on Grand Arena",
        timestamp: "00:48",
        timeSec: 48,
        description: "Ethio-jazz masterclasses blending with analog synthesizers as dusk falls.",
      },
      {
        id: "c3",
        title: "03 // Laser Canopy & Hologram Genesis",
        timestamp: "01:25",
        timeSec: 85,
        description: "500-drone visual formation dancing across the Dire Dawa night sky.",
      },
      {
        id: "c4",
        title: "04 // Midnight Finale & Fireworks",
        timestamp: "02:10",
        timeSec: 130,
        description: "High-octane electronic peak and emotional curtain call.",
      },
    ],
  },

  artists: [
    {
      id: "dj-natu",
      name: "DJ NATU",
      role: "ETHIO-ELECTRONIC DJ",
      category: "ethio-electronic",
      image: djLeft1Img,
      bio: "Mastering deep Ethio-electronic rhythms, high-energy festival grooves, and hypnotic beats.",
      badge: "OFFICIAL DJ",
      stage: "GRAND CINEMATIC ARENA",
      time: "4:30 PM (10:30 LOCAL)",
      genre: "ETHIO-HOUSE",
    },
    {
      id: "dj-hope",
      name: "DJ HOPE",
      role: "AFRO-HOUSE & URBAN DJ",
      category: "ethio-electronic",
      image: djLeft2Img,
      bio: "Crafting hypnotic afro-electronic rhythms, deep basslines, and uplifting festival energy.",
      badge: "OFFICIAL DJ",
      stage: "GRAND CINEMATIC ARENA",
      time: "6:00 PM (12:00 LOCAL)",
      genre: "AFRO-TECH",
    },
    {
      id: "mc-santa",
      name: "MC SANTA",
      role: "OFFICIAL FESTIVAL HOST & MC",
      category: "headliner",
      image: djRight1Img,
      bio: "Master of ceremonies at Mamsha Fest, driving crowd energy and hosting live performances.",
      badge: "OFFICIAL MC",
      stage: "MAIN ARENA & SKYLINE STAGE",
      time: "ALL DAY HOST",
      genre: "HYPER HOST & CROWD ENERGIZER",
    },
    {
      id: "49-drill",
      name: "49 DRILL",
      role: "ETHIOPIAN DRILL ARTIST",
      category: "headliner",
      image: artistesImg,
      bio: "Ethiopia's premier drill sensation delivering high-octane live performance on the main stage.",
      badge: "LIVE PERFORMER",
      stage: "GRAND CINEMATIC ARENA",
      time: "3:00 PM (9:00 LOCAL)",
      genre: "ETHIOPIAN DRILL",
    },
  ],

  about: {
    badge: "THE MAMSHA FEST MANIFESTO",
    title: "WHERE LUXURY SOUND, GAMES, ART & GASTRONOMY CONVERGE",
    description1: "One day. 1,200 curated guests. High sound stages, next-gen gaming lounges (Pool, Table Tennis, Joteni, PS5), artisan foods & smoothie bars, live tattoo studios, and fine art galleries at PAPA.",
    description2: "A transcendent convergence from 9:00 AM to 9:00 PM (3:00 Morning to 3:00 Night local time).",
    stats: [
      { label: "ATTENDEES", value: "1,200" },
      { label: "ICONIC ARTISTS", value: "12+" },
      { label: "GAMING & ART ZONES", value: "6+" },
      { label: "IMMERSION", value: "12 HRS" },
    ],
    mediaPoster: asset10666,
  },

  highlights: [
    {
      id: "hl-1",
      number: "01",
      title: "NEXT-GEN GAMING & RECREATION ARENA",
      subtitle: "Billiards Pool, Table Tennis, Joteni & PlayStation PS5 Hub.",
      description: "Compete with friends in our air-conditioned gaming lounge featuring Pool tables, Ping Pong, Joteni (table football), and Next-Gen PS5 stations.",
      image: artboard2,
      tags: ["POOL / BILLIARDS", "TABLE TENNIS", "JOTENI", "PS5 GAMING"],
    },
    {
      id: "hl-2",
      number: "02",
      title: "ARTISAN FOODS & ORGANIC SMOOTHIES",
      subtitle: "Gourmet street bites, fresh smoothie blends & craft mixology.",
      description: "Indulge in delicious gourmet food stalls, fresh-pressed tropical smoothie bars, and specialty coffee mixology.",
      image: gebetaImg,
      tags: ["ARTISAN FOODS", "ORGANIC SMOOTHIES", "BOTANICAL BAR"],
    },
    {
      id: "hl-3",
      number: "03",
      title: "LIVE TATTOO ARTISTS & TEMP BODY INK",
      subtitle: "Professional tattoo studio & glam temporary metallic tattoos.",
      description: "Get inked by top tattoo artists or adorn yourself with custom temporary tattoos, body paint, and festival glitter.",
      image: artboard3,
      tags: ["TATTOO ARTISTS", "TEMP TATTOOS", "BODY PAINT"],
    },
    {
      id: "hl-4",
      number: "04",
      title: "CONTEMPORARY FINE ART & LIVE CANVAS",
      subtitle: "Live painting performances & fine art exhibitions.",
      description: "Immerse yourself in live canvas creation, visual fine art showcases, and interactive art installations beside the music.",
      image: artImg,
      tags: ["LIVE CANVAS", "FINE ART", "EXHIBITIONS"],
    },
    {
      id: "hl-5",
      number: "05",
      title: "SYMPHONIC & SYNTHESIS MAIN ARENA",
      subtitle: "Ethio-jazz masters, orchestral strings & afro-electronic peak.",
      description: "Traditional Ethiopian melodies woven into spatial 3D audio architectures and drone canopy shows.",
      image: artistesImg,
      tags: ["HEADLINERS", "SPATIAL 3D", "ETHIO-EDM"],
    },
  ],

  organizers: [
    { id: "org-1", name: "ENQUU", category: "MAIN ORGANIZER", logoText: "ENQUU", symbol: "👑", logoImage: enkuuLogo },
    { id: "org-2", name: "PAPA GARDEN", category: "MAIN ORGANIZER", logoText: "PAPA GARDEN", symbol: "🌿", logoImage: papaGardenLogo },
  ],

  vendors: [
    { id: "v1", name: "GEBETA BAKERY", category: "CAKE & FAST FOOD", logoText: "GEBETA BAKERY", symbol: "🥐", logoImage: v1Img },
    { id: "v2", name: "JONY JUICE", category: "FRESH JUICES & SMOOTHIES", logoText: "JONY JUICE", symbol: "🍹", logoImage: v2Img },
    { id: "v3", name: "NOVA LIQER", category: "SPECIALTY LIQUOR & BAR", logoText: "NOVA LIQER", symbol: "🍸", logoImage: v3Img },
    { id: "v4", name: "AB GIFT & ONLINE SHOPPING", category: "GIFTS & FESTIVAL STORE", logoText: "AB GIFT & STORE", symbol: "🎁", logoImage: v4Img },
    { id: "v5", name: "KEZIRA MEDIA HUB", category: "VIDEO, GRAPHICS & PHOTOGRAPHY", logoText: "KEZIRA MEDIA HUB", symbol: "✦", logoImage: logoImg },
    { id: "v6", name: "ABSHIR PRODUCTION", category: "VIDEO, GRAPHICS & PHOTOGRAPHY", logoText: "ABSHIR PRODUCTION", symbol: "⚡", logoImage: abshirLogo },
  ],

  schedule: [
    {
      dayId: "day-1",
      dayTitle: "SATURDAY, OCT 3",
      date: "9:00 AM – 9:00 PM (3:00 – 9:00 LOCAL)",
      items: [
        {
          time: "9:00 AM (3:00 Local)",
          title: "GATES OPEN & ARTISAN COFFEE RITUAL",
          artist: "MAMSHA SOUND COLLECTIVE",
          stage: "SUNSET PALMS STAGE",
          category: "music",
          description: "Morning doors open. Traditional Dire Dawa coffee ceremony and ambient string bath.",
        },
        {
          time: "11:00 AM (5:00 Local)",
          title: "GAMING ARENA & PS5 / POOL TOURNAMENT",
          artist: "MAMSHA GAMING CLUB",
          stage: "RECREATION & GAMING HUB",
          category: "art",
          description: "Pool (Billiards), Table Tennis, Joteni & PlayStation 5 gaming lounges open for festival guests.",
        },
        {
          time: "12:30 PM (6:30 Local)",
          title: "ARTISAN FOODS & SMOOTHIE BAR TASTINGS",
          artist: "CHEF & MIXOLOGY COLLECTIVE",
          stage: "GASTRONOMY GARDEN",
          category: "art",
          description: "Gourmet street foods and fresh tropical organic smoothie bars in full swing.",
        },
        {
          time: "1:30 PM (7:30 Local)",
          title: "SPATIAL SYMPHONIC STRINGS & LIVE TATTOO STUDIO",
          artist: "40-PIECE ENSEMBLE & TATTOO ARTISTS",
          stage: "ROYAL PAVILION & INK LOUNGE",
          category: "art",
          description: "Acoustic strings paired with live tattoo artist sessions & temporary body art creation.",
        },
        {
          time: "3:00 PM (9:00 Local)",
          title: "ETHIOPIAN DRILL PERFORMANCE",
          artist: "49 DRILL X MC SANTA",
          stage: "GRAND CINEMATIC ARENA",
          category: "music",
          description: "Exclusive live performance by 49 Drill hosted by MC Santa, bringing high-energy Ethiopian drill sound to Mamsha Fest.",
        },
        {
          time: "6:00 PM (12:00 Local)",
          title: "SUNSET DJ SESSION & ETHIO-HOUSE RHYTHMS",
          artist: "DJ NATU X MC SANTA",
          stage: "GRAND CINEMATIC ARENA",
          category: "music",
          description: "Hypnotic Ethio-electronic & Afro-house DJ set by DJ Natu hosted by MC Santa.",
        },
        {
          time: "7:30 PM (1:30 Night)",
          title: "NIGHTFALL HIGH-ENERGY DJ SHOWCASE",
          artist: "DJ HOPE X MC SANTA",
          stage: "MAIN ARENA & SKYLINE STAGE",
          category: "music",
          description: "Explosive electronic DJ performance by DJ Hope.",
        },
        {
          time: "9:00 PM (3:00 Night)",
          title: "ETERNAL FINALE & CLOSING CURTAIN",
          artist: "DJ NATU, DJ HOPE & MC SANTA",
          stage: "SKY GARDEN DOME",
          category: "vip",
          description: "Monumental closing set featuring DJ Natu, DJ Hope & MC Santa ending promptly at 9:00 PM / 3:00 Night Local.",
        },
      ],
    },
  ],

  venue: {
    name: "PAPA",
    subtitle: "DIRE DAWA'S PREMIER DESTINATION",
    address: "PAPA, Dire Dawa, Ethiopia",
    coordinates: "9.5931° N, 41.8661° E",
    description: "An iconic venue combining premier open-air stages, luxury sky lounges, lush botanical spaces, and 360° laser displays in Dire Dawa.",
    features: [
      "Premier Open-Air Grounds & Botanical Lounges",
      "Next-Gen Gaming Lounge (Pool, Table Tennis, Joteni & PS5)",
      "Artisan Foods & Organic Tropical Smoothie Bars",
      "Live Tattoo Studio & Temporary Body Art Pavilion",
      "Fine Art & Live Canvas Gallery",
      "Executive VIP Cabanas & Valet Parking",
      "360° Volumetric Laser Overhead Canopy",
    ],
    bgImage: artboard2,
    mapUrl: "https://maps.google.com/?q=PAPA+Dire+Dawa+Ethiopia",
  },

  ticketTypes: [
    {
      id: "regular",
      name: "GENERAL PASS",
      badge: "ADVANCE 400 ETB • GATE 600 ETB",
      priceUSD: 10,
      priceETB: 400,
      description: "Full day access to 3 main stages, art pavilions, gaming lounges, and artisan food gardens (400 ETB Advance / 600 ETB on Event Day).",
      availability: "SELLING FAST",
      availabilityPercentage: 82,
      colorTheme: "bronze",
      benefits: [
        "Full Day General Arena Access (9 AM – 9 PM)",
        "3 Cinematic Sound Stages & Gaming Lounge",
        "Artisan Food & Beverage Garden Access",
        "400 ETB Advance Price (Increases to 600 ETB on Event Day)",
        "Digital Festival Pass",
      ],
    },
    {
      id: "vip",
      name: "VIP EXPERIENCE",
      badge: "RECOMMENDED",
      priceUSD: 25,
      priceETB: 1000,
      description: "Elevated sky viewing lounge, express fast-track gates, plus 2 FREE BEERS included with ticket!",
      availability: "LIMITED TICKETS LEFT",
      availabilityPercentage: 91,
      featured: true,
      colorTheme: "gold",
      benefits: [
        "All General Pass Privileges Included",
        "2 FREE BEERS Included (🍺 🍺)",
        "VIP Fast-Track Express Gate",
        "Elevated Sky Viewing Lounge",
        "Private VIP Restrooms & Exclusive Bar",
      ],
    },
  ],

  gallery: [
    {
      id: "g1",
      title: "NEXT-GEN RECREATION (POOL, PING PONG, JOTENI & PS5)",
      category: "GAMING & GAMES",
      src: artboard2,
      type: "image",
      aspectRatio: "wide",
    },
    {
      id: "g2",
      title: "ARTISAN FOODS & TROPICAL SMOOTHIE BAR",
      category: "FOOD & SMOOTHIES",
      src: gebetaImg,
      type: "image",
      aspectRatio: "portrait",
    },
    {
      id: "g3",
      title: "LIVE TATTOO ARTISTS & TEMPORARY BODY INK",
      category: "TATTOO & STYLE",
      src: artboard3,
      type: "image",
      aspectRatio: "square",
    },
    {
      id: "g4",
      title: "CONTEMPORARY FINE ART & LIVE CANVAS EXHIBIT",
      category: "FINE ART",
      src: artImg,
      type: "image",
      aspectRatio: "landscape",
    },
    {
      id: "g5",
      title: "ENQUU — MAIN FESTIVAL ORGANIZER",
      category: "MAIN ORGANIZER",
      src: enkuuLogo,
      type: "image",
      aspectRatio: "portrait",
    },
    {
      id: "g6",
      title: "PAPA GARDEN — MAIN FESTIVAL ORGANIZER",
      category: "MAIN ORGANIZER",
      src: papaGardenLogo,
      type: "image",
      aspectRatio: "portrait",
    },
    {
      id: "g7",
      title: "NOVA LIQER SPECIALTY BAR & DRINKS",
      category: "SPECIALTY DRINKS & BAR",
      src: noImg,
      type: "image",
      aspectRatio: "wide",
    },
  ],

  socialLinks: [
    { name: "INSTAGRAM", url: "https://instagram.com", icon: "Instagram" },
    { name: "YOUTUBE", url: "https://youtube.com", icon: "Youtube" },
    { name: "TWITTER / X", url: "https://twitter.com", icon: "Twitter" },
    { name: "SPOTIFY", url: "https://spotify.com", icon: "Music" },
    { name: "TELEGRAM", url: "https://telegram.org", icon: "Send" },
  ],
};

export default eventConfig;
