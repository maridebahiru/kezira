import logoImg from '../assets/logo.png';
import abshirLogo from '../assets/abshir logo.png';
import enkuImg from '../assets/enku.jpg';
import mamshaLogo from '../assets/mamsha.png';
import asset10666 from '../assets/10666 [Converted].jpg';
import artboard2 from '../assets/Artboard 1 copy 2-100.jpg';
import artboard3 from '../assets/Artboard 1 copy 3-100.jpg';
import artboard4 from '../assets/Artboard 1 copy 4-100.jpg';
import panfalonImg from '../assets/panfalon.png';
import tedyImg from '../assets/tedy.png';
import rophnanImg from '../assets/rophnan.png';
import kasmaselImg from '../assets/kasmasel.png';
import asterImg from '../assets/aster.png';

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

export interface ConcertTrailerConfig {
  videoUrl: string;
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
      src: "https://assets.mixkit.co/videos/preview/mixkit-concert-crowd-cheering-under-laser-lights-42586-large.mp4",
      poster: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=2000&q=85",
      title: "EXPERIENCE THE MOMENT",
      subtitle: "CHAPTER I — THE SYMPHONY OF LIGHT & RESONANCE",
      objectPosition: "center center",
      duration: 10,
      transitionType: "sweep",
    },
    {
      id: "chapter-02",
      src: "https://assets.mixkit.co/videos/preview/mixkit-dj-playing-music-at-a-club-41398-large.mp4",
      poster: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2000&q=85",
      title: "FEEL THE ENERGY",
      subtitle: "CHAPTER II — ELECTRIFYING RHYTHMS OF DIRE DAWA",
      objectPosition: "50% 40%",
      duration: 10,
      transitionType: "scale",
    },
    {
      id: "chapter-03",
      src: "https://assets.mixkit.co/videos/preview/mixkit-light-show-at-a-music-concert-42880-large.mp4",
      poster: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=2000&q=85",
      title: "LIVE THE EXPERIENCE",
      subtitle: "CHAPTER III — ETERNAL MEMORIES AT MIDER BABUR",
      objectPosition: "center top",
      duration: 10,
      transitionType: "fade",
    },
  ],

  trailer: {
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-party-crowd-raising-their-hands-in-a-concert-42878-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2000&q=85",
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
      id: "panfalon",
      name: "PANFALON",
      role: "ETHIO-ELECTRONIC LIVE",
      category: "ethio-electronic",
      image: panfalonImg,
      bio: "Dynamic visionary bridging vibrant electronic textures with iconic East African rhythms.",
      badge: "LIVE PERFORMER",
      stage: "GRAND CINEMATIC ARENA",
      time: "3:00 PM (9:00 LOCAL)",
      genre: "AFRO-ELECTRONIC",
    },
    {
      id: "tedy",
      name: "TEDDY AFRO",
      role: "NATIONAL ICON",
      category: "headliner",
      image: tedyImg,
      bio: "Ethiopia's most celebrated musical visionary delivering an emotional, once-in-a-lifetime sunset spectacle.",
      badge: "LEGENDARY HEADLINER",
      stage: "GRAND CINEMATIC ARENA",
      time: "6:00 PM (12:00 LOCAL)",
      genre: "ETHIOPIAN ANTHEMS",
    },
    {
      id: "rophnan",
      name: "ROPHNAN",
      role: "ETHIO-ELECTRONIC PIONEER",
      category: "ethio-electronic",
      image: rophnanImg,
      bio: "Revolutionizing East African electronic soundscapes by bridging indigenous pentatonic scales with future basslines.",
      badge: "FUTURIST PIONEER",
      stage: "SKYLINE STAGE",
      time: "4:30 PM (10:30 LOCAL)",
      genre: "AFRO-EDM / FUTURE ETHIO",
    },
    {
      id: "kasmasel",
      name: "KASMASSE",
      role: "ANCHIHOYE PIONEER",
      category: "headliner",
      image: kasmaselImg,
      bio: "Pioneering the Anchihoye electronic wave and modern sonic storytelling across East Africa.",
      badge: "MODERN ICON",
      stage: "SUNSET PALMS ARENA",
      time: "7:30 PM (1:30 NIGHT LOCAL)",
      genre: "ANCHIHOYE / CONTEMPORARY",
    },
    {
      id: "aster",
      name: "ASTER AWEKE",
      role: "QUEEN OF ETHIOPIAN SOUL",
      category: "headliner",
      image: asterImg,
      bio: "The legendary, inimitable Queen of Ethiopian music performing timeless soul anthems under the Dire Dawa sky.",
      badge: "SOUL QUEEN",
      stage: "ROYAL PAVILION",
      time: "9:00 PM (3:00 NIGHT LOCAL)",
      genre: "ETHIO-SOUL / JAZZ",
    },
  ],

  about: {
    badge: "THE KEZIRA MANIFESTO",
    title: "WHERE LUXURY SOUND MEETS EAST AFRICAN SOUL",
    description1: "One day. 1,200 curated guests. Unmatched acoustic clarity and visionary light architecture at the historic Mider Babur in Dire Dawa.",
    description2: "A transcendent convergence from 9:00 AM to 9:00 PM (3:00 Morning to 3:00 Night local time).",
    stats: [
      { label: "ATTENDEES", value: "1,200" },
      { label: "ICONIC ARTISTS", value: "12+" },
      { label: "AUDIO STAGES", value: "4" },
      { label: "IMMERSION", value: "12 HRS" },
    ],
    mediaPoster: asset10666,
  },

  highlights: [
    {
      id: "hl-1",
      number: "01",
      title: "SYMPHONIC & SYNTHESIS HYBRID",
      subtitle: "Live 40-piece strings colliding with modular synthesizers.",
      description: "Traditional Ethiopian melodies woven into spatial 3D audio architectures.",
      image: artboard2,
      tags: ["ORCHESTRAL", "MODULAR SYNTH", "SPATIAL 3D"],
    },
    {
      id: "hl-2",
      number: "02",
      title: "ROYAL SKY CABANAS & LOUNGES",
      subtitle: "Elevated private sanctuaries with personal concierge.",
      description: "Panoramic festival views, champagne service, and Michelin-inspired gastronomy.",
      image: artboard3,
      tags: ["VIP ACCESS", "CONCIERGE", "CHAMPAGNE"],
    },
    {
      id: "hl-3",
      number: "03",
      title: "VOLUMETRIC LASER CANOPY",
      subtitle: "Celestial light geometry transforming the night sky.",
      description: "Synchronized drone swarms, 3D laser domes, and atmospheric haze architecture.",
      image: artboard4,
      tags: ["3D LASERS", "DRONE FORMATION", "LIGHT DOMES"],
    },
    {
      id: "hl-4",
      number: "04",
      title: "ARTISAN GASTRONOMY & MIXOLOGY",
      subtitle: "Master tastings honoring age-old spices and specialty beans.",
      description: "Artisan coffee ceremonies, craft botanical cocktails, and rare vintage tastings.",
      image: enkuImg,
      tags: ["ETHIO-COFFEE", "BOTANICAL BAR", "FINE TASTINGS"],
    },
  ],

  vendors: [
    { id: "v1", name: "ABSHIR", category: "OFFICIAL PARTNER", logoText: "ABSHIR", symbol: "⚡", logoImage: abshirLogo },
    { id: "v2", name: "ENKU", category: "MEDIA & CULTURAL PARTNER", logoText: "ENKU", symbol: "✦", logoImage: enkuImg },
    { id: "v3", name: "KEZIRA", category: "BRAND PARTNER", logoText: "KEZIRA", symbol: "👑", logoImage: logoImg },
    { id: "v4", name: "MAMSHA", category: "LUXURY HOSPITALITY", logoText: "MAMSHA", symbol: "🌟", logoImage: mamshaLogo },
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
          time: "1:30 PM (7:30 Local)",
          title: "SPATIAL SYMPHONIC STRINGS",
          artist: "40-PIECE STRING ENSEMBLE",
          stage: "ROYAL PAVILION",
          category: "music",
          description: "Acoustic exploration of indigenous Krar, Masinqo, and classical violins.",
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
      "Executive VIP Cabanas & Valet Parking",
      "Thermal Spatial Audio Stage Systems",
      "360° Volumetric Laser Overhead Canopy",
      "Dedicated High-Speed VIP Express Gates",
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
      title: "THE HYPNOTIC MAIN ARENA AT DUSK",
      category: "PERFORMANCE",
      src: asset10666,
      type: "image",
      aspectRatio: "wide",
    },
    {
      id: "g2",
      title: "AERIAL LIGHT CANOPY & ARCHITECTURE",
      category: "LIGHT SHOW",
      src: artboard2,
      type: "image",
      aspectRatio: "portrait",
    },
    {
      id: "g3",
      title: "ROYAL VIP CHAMPAGNE PAVILION",
      category: "VIP EXPERIENCE",
      src: artboard3,
      type: "image",
      aspectRatio: "square",
    },
    {
      id: "g4",
      title: "ETHIOPIAN ORCHESTRA SOUND REHEARSAL",
      category: "BEHIND THE SCENES",
      src: artboard4,
      type: "image",
      aspectRatio: "landscape",
    },
    {
      id: "g5",
      title: "ENKU CULTURAL STAGE EXPERIENCE",
      category: "ART INSTALLATIONS",
      src: enkuImg,
      type: "image",
      aspectRatio: "portrait",
    },
    {
      id: "g6",
      title: "CELESTIAL MIDNIGHT CROWD ENERGY",
      category: "ATMOSPHERE",
      src: asset10666,
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
