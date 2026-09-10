import logoImg from '../assets/logo.png';
import abshirLogo from '../assets/abshir logo.png';
import enkuImg from '../assets/enku.jpg';
import mamshaLogo from '../assets/enkuu.png';
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
  eventName: "KEZIRA",
  eventEdition: "2026 CINEMATIC EDITION",
  tagline: "THE EXPERIENCE BEGINS HERE",
  subTagline: "A SYNTHESIS OF HIGH SOUND, LUXURY ART, & UNFORGETTABLE MOMENTS",
  date: "SATURDAY, OCTOBER 3, 2026",
  location: "DIRE DAWA, ETHIOPIA",
  venueName: "MIDER BABUR",
  venueAddress: "Mider Babur, Dire Dawa, Ethiopia",

  heroVideos: [
    {
      id: "chapter-01",
      src: mamshaFestVideo,
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
      src: mamshaFestVideo,
      poster: artboard3,
      title: "LIVE THE EXPERIENCE",
      subtitle: "CHAPTER III — ETERNAL MEMORIES AT MIDER BABUR",
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
    title: "KEZIRA 2025 // OFFICIAL CINEMATIC RECAP",
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
      id: "dj-left-1",
      name: "DJ KAL",
      role: "ETHIO-ELECTRONIC DJ",
      category: "ethio-electronic",
      image: djLeft1Img,
      bio: "Mastering deep Ethio-electronic rhythms, high-energy festival grooves, and hypnotic beats.",
      badge: "RESIDENT DJ",
      stage: "GRAND CINEMATIC ARENA",
      time: "3:00 PM (9:00 LOCAL)",
      genre: "ETHIO-HOUSE",
    },
    {
      id: "dj-left-2",
      name: "DJ NATI",
      role: "AFRO-HOUSE DJ",
      category: "ethio-electronic",
      image: djLeft2Img,
      bio: "Crafting hypnotic afro-electronic rhythms, deep basslines, and uplifting festival energy.",
      badge: "RESIDENT DJ",
      stage: "GRAND CINEMATIC ARENA",
      time: "4:30 PM (10:30 LOCAL)",
      genre: "AFRO-TECH",
    },
    {
      id: "the-artists",
      name: "THE ARTISTS",
      role: "HEADLINERS LINEUP",
      category: "headliner",
      image: artistesImg,
      bio: "Ethiopia's premier musical visionaries performing live together on the main cinematic stage.",
      badge: "MAIN HEADLINERS",
      stage: "GRAND CINEMATIC ARENA",
      time: "6:30 PM (12:30 LOCAL)",
      genre: "ETHIOPIAN ANTHEMS & LIVE ELECTRONIC",
    },
    {
      id: "dj-right-1",
      name: "DJ LUNA",
      role: "GLOBAL DJ",
      category: "global-dj",
      image: djRight1Img,
      bio: "International electronic selector weaving futuristic synths and deep basslines.",
      badge: "GLOBAL GUEST DJ",
      stage: "SKYLINE STAGE",
      time: "8:00 PM (2:00 NIGHT LOCAL)",
      genre: "AFRO-TECH / FUTURE BASS",
    },
    {
      id: "dj-right-2",
      name: "DJ BROOK",
      role: "URBAN & ELECTRONIC DJ",
      category: "global-dj",
      image: djRight2Img,
      bio: "Explosive party vibes blending modern urban rhythms, afro-beats, and electronic bass drops.",
      badge: "SPECIAL GUEST DJ",
      stage: "SKYLINE STAGE",
      time: "9:00 PM (3:00 NIGHT LOCAL)",
      genre: "URBAN AFRO-BASS",
    },
  ],

  about: {
    badge: "THE KEZIRA MANIFESTO",
    title: "WHERE LUXURY SOUND, GAMES, ART & GASTRONOMY CONVERGE",
    description1: "One day. 1,200 curated guests. High sound stages, next-gen gaming lounges (Pool, Table Tennis, Joteni, PS5), artisan foods & smoothie bars, live tattoo studios, and fine art galleries at historic Mider Babur.",
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
      image: enkuImg,
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
      image: artboard4,
      tags: ["LIVE CANVAS", "FINE ART", "EXHIBITIONS"],
    },
    {
      id: "hl-5",
      number: "05",
      title: "SYMPHONIC & SYNTHESIS MAIN ARENA",
      subtitle: "Ethio-jazz masters, orchestral strings & afro-electronic peak.",
      description: "Traditional Ethiopian melodies woven into spatial 3D audio architectures and drone canopy shows.",
      image: asset10666,
      tags: ["HEADLINERS", "SPATIAL 3D", "ETHIO-EDM"],
    },
  ],

  vendors: [
    { id: "v1", name: "ENQU EVENT", category: "MAIN EVENT PRESENTER", logoText: "ENQU EVENT", symbol: "👑", logoImage: enkuuLogo },
    { id: "v2", name: "MAMSHA", category: "EXCLUSIVE PARTNER", logoText: "MAMSHA", symbol: "🌟", logoImage: mamshaLogo },
    { id: "v3", name: "KEZIRA MEDIA HUB", category: "GRAPHICS, PHOTO & VIDEO", logoText: "KEZIRA MEDIA HUB", symbol: "✦", logoImage: logoImg },
    { id: "v4", name: "ABSHIR PRODUCTION", category: "PRODUCTION", logoText: "ABSHIR PRODUCTION", symbol: "⚡", logoImage: abshirLogo },
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
          artist: "KEZIRA SOUND COLLECTIVE",
          stage: "SUNSET PALMS STAGE",
          category: "music",
          description: "Morning doors open. Traditional Dire Dawa coffee ceremony and ambient string bath.",
        },
        {
          time: "11:00 AM (5:00 Local)",
          title: "GAMING ARENA & PS5 / POOL TOURNAMENT",
          artist: "KEZIRA GAMING CLUB",
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
          title: "ETHIO-JAZZ & MODULAR SYNTHESIS",
          artist: "MULATU ASTATKE // LIVE ENSEMBLE",
          stage: "GRAND CINEMATIC ARENA",
          category: "music",
          description: "The father of Ethio-Jazz in an exclusive festival composition.",
        },
        {
          time: "6:00 PM (12:00 Local)",
          title: "SUNSET SYMPHONY & NATIONAL ANTHEMS",
          artist: "TEDDY AFRO X SPECIAL GUESTS",
          stage: "GRAND CINEMATIC ARENA",
          category: "music",
          description: "Golden hour performance uniting legendary anthems with cinema-grade visuals.",
        },
        {
          time: "7:30 PM (1:30 Night)",
          title: "3D HOLOGRAPHIC DRONE GENESIS",
          artist: "ANYMA X KEZIRA LIGHT ARCHITECTS",
          stage: "MAIN ARENA & SKYLINE",
          category: "music",
          description: "500 synchronized drones and 3D visual projection canopy.",
        },
        {
          time: "9:00 PM (3:00 Night)",
          title: "ETERNAL FINALE & CLOSING CURTAIN",
          artist: "SOLOMUN X BLACK COFFEE",
          stage: "SKY GARDEN DOME",
          category: "vip",
          description: "Monumental closing set ending promptly at 9:00 PM / 3:00 Night Local.",
        },
      ],
    },
  ],

  venue: {
    name: "MIDER BABUR",
    subtitle: "DIRE DAWA'S HISTORIC RAILWAY ICON",
    address: "Mider Babur, Dire Dawa, Ethiopia",
    coordinates: "9.5931° N, 41.8661° E",
    description: "An iconic cultural landmark combining century-old railway architecture with cutting-edge open-air stages, luxury sky lounges, and 360° laser displays.",
    features: [
      "Historic Franco-Ethiopian Railway Grounds",
      "Next-Gen Gaming Lounge (Pool, Table Tennis, Joteni & PS5)",
      "Artisan Foods & Organic Tropical Smoothie Bars",
      "Live Tattoo Studio & Temporary Body Art Pavilion",
      "Fine Art & Live Canvas Gallery",
      "Executive VIP Cabanas & Valet Parking",
      "360° Volumetric Laser Overhead Canopy",
    ],
    bgImage: asset10666,
    mapUrl: "https://maps.google.com/?q=Mider+Babur+Dire+Dawa+Ethiopia",
  },

  ticketTypes: [
    {
      id: "regular",
      name: "GENERAL PASS",
      badge: "POPULAR CHOICE",
      priceUSD: 150,
      priceETB: 8500,
      description: "Full day access to 3 main stages, art pavilions, and artisan food gardens (9 AM – 9 PM / 3:00 - 9:00 Local).",
      availability: "SELLING FAST",
      availabilityPercentage: 82,
      colorTheme: "bronze",
      benefits: [
        "Full Day General Arena Access (9 AM – 9 PM)",
        "3 Cinematic Sound Stages",
        "Artisan Food & Craft Bars",
        "Commemorative RFID Wristband",
        "Digital Festival Pass",
      ],
    },
    {
      id: "vip",
      name: "VIP SKY EXPERIENCE",
      badge: "RECOMMENDED",
      priceUSD: 450,
      priceETB: 25500,
      description: "Elevated sky viewing lounges, express fast-track gates, welcome champagne, and concierge access.",
      availability: "LIMITED TICKETS LEFT",
      availabilityPercentage: 91,
      featured: true,
      colorTheme: "gold",
      benefits: [
        "All General Pass Privileges Included",
        "VIP Fast-Track Express Gate",
        "Elevated Sky Viewing Lounge",
        "Complimentary Welcome Champagne",
        "Private VIP Restrooms & Valet",
        "Exclusive VIP Bar & Tasting Lounge",
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
      src: enkuImg,
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
      src: artboard4,
      type: "image",
      aspectRatio: "landscape",
    },
    {
      id: "g5",
      title: "THE HYPNOTIC MAIN ARENA AT DUSK",
      category: "PERFORMANCE",
      src: asset10666,
      type: "image",
      aspectRatio: "wide",
    },
    {
      id: "g6",
      title: "ROYAL VIP CHAMPAGNE LOUNGE",
      category: "VIP EXPERIENCE",
      src: artboard3,
      type: "image",
      aspectRatio: "portrait",
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
