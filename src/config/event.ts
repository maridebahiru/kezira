import logoImg from '../assets/logo.png';
import abshirLogo from '../assets/abshir logo.png';
import enkuImg from '../assets/enku.jpg';
import mamshaLogo from '../assets/mamsha.png';
import asset10666 from '../assets/10666 [Converted].jpg';
import artboard2 from '../assets/Artboard 1 copy 2-100.jpg';
import artboard3 from '../assets/Artboard 1 copy 3-100.jpg';
import artboard4 from '../assets/Artboard 1 copy 4-100.jpg';

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

  about: {
    badge: "ABOUT THE EVENT",
    title: "REDEFINING THE LUXURY LIVE FESTIVAL IN EAST AFRICA",
    description1: "KEZIRA is an immersive single-day festival curated for connoisseurs of world-class electronic, afro-fusion, and orchestral sound paired with avant-garde visual art.",
    description2: "Set at the historic Mider Babur in Dire Dawa, this exclusive event runs from 9:00 AM to 9:00 PM (3:00 Morning until 3:00 Evening / 9:00 Local Time).",
    stats: [
      { label: "ATTENDEES", value: "1200+" },
      { label: "NATIONAL ARTISTS", value: "10+" },
      { label: "IMMERSIVE EXPERIENCE", value: "1 DAY" },
      { label: "AUDIO VISUAL STAGES", value: "4" },
    ],
    mediaPoster: asset10666,
  },

  highlights: [
    {
      id: "hl-1",
      number: "01",
      title: "LIVE ORCHESTRAL & ELECTRONIC HYBRIDS",
      subtitle: "World-class DJs harmonized with a 40-piece live Ethiopian string ensemble.",
      description: "A breathtaking acoustic boundary push where traditional instruments blend seamlessly with analog synthesizers and 3D spatial audio.",
      image: artboard2,
      tags: ["SYMPHONIC", "AFRO-HOUSE", "SPATIAL AUDIO"],
    },
    {
      id: "hl-2",
      number: "02",
      title: "ROYAL SKY CABANAS & VIP LOUNGES",
      subtitle: "Elevated private sanctuaries offering Michelin-level culinary pairings.",
      description: "Dedicated concierge service, private champagne bars, and unobstructed panoramic elevated views of the main cinematic stage.",
      image: artboard3,
      tags: ["VIP ACCESS", "FINE GASTRONOMY", "CONCIERGE"],
    },
    {
      id: "hl-3",
      number: "03",
      title: "ARCHITECTURAL LASER & HOLOGRAPHIC CANOPY",
      subtitle: "Custom visual scapes projecting celestial geometry across the sky.",
      description: "Designed by world-leading light architects, creating an ethereal dome of shifting lasers and volumetric smoke dynamics.",
      image: artboard4,
      tags: ["LIGHT ARCHITECTURE", "HOLOGRAPHIC", "3D LASERS"],
    },
    {
      id: "hl-4",
      number: "04",
      title: "FINE ETHIOPIAN GASTRONOMY & MIXOLOGY",
      subtitle: "Curated multi-course tasting menus by master international chefs.",
      description: "Pairing age-old spices and specialty Ethiopian coffees with rare vintages, craft mixology, and signature festival cocktails.",
      image: enkuImg,
      tags: ["CUISINE", "MIXOLOGY", "ARTISAN COFFEE"],
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
          title: "DOORS OPEN & MORNING AMBIENT HARMONICS",
          artist: "KEZIRA SOUND COLLECTIVE",
          stage: "SUNSET PALMS STAGE",
          category: "music",
          description: "Morning doors open at 9:00 AM (3:00 Ethiopian Local Time). Artisan coffee ceremony & sound bath.",
        },
        {
          time: "12:00 PM (6:00 Local)",
          title: "MIDDAY ART EXHIBIT & GASTRONOMY TASTING",
          artist: "ETHIOPIAN ARTISANS & CHEF ALMAZ",
          stage: "ROYAL PAVILION",
          category: "art",
          description: "Curated culinary tasting menu accompanied by acoustic jazz vinyl selections.",
        },
        {
          time: "3:00 PM (9:00 Local)",
          title: "ETHIO-JAZZ & AFRO-HOUSE SYNTHESIS",
          artist: "MULATU ASTATKE X BLACK COFFEE (HYBRID)",
          stage: "GRAND CINEMATIC ARENA",
          category: "music",
          description: "World-premiere collaboration blending legendary ethio-jazz rhythms with afro-house synthesizers.",
        },
        {
          time: "6:00 PM (12:00 Local)",
          title: "SUNSET SYMPHONY & ETHIOPIAN ANTHEMS",
          artist: "TEDDY AFRO X SPECIAL GUESTS",
          stage: "GRAND CINEMATIC ARENA",
          category: "music",
          description: "A monumental performance uniting traditional anthems with cinematic stage production.",
        },
        {
          time: "7:30 PM (1:30 Night Local)",
          title: "HOLOGRAPHIC DRONE CANOPY & GENESIS SHOW",
          artist: "ANYMA X KEZIRA ALL-STAR ENSEMBLE",
          stage: "MAIN STAGE & SKYLINE",
          category: "music",
          description: "Synchronized 500-drone light show and mind-bending 3D visual projection canopy.",
        },
        {
          time: "9:00 PM (3:00 Night Local)",
          title: "ETERNAL CLOSING CURTAIN & GRAND FINALE",
          artist: "SOLOMUN X GLOBAL RESIDENTS",
          stage: "SKY GARDEN DOME",
          category: "vip",
          description: "Final curtain call closing at 9:00 PM (3:00 Night Ethiopian Local Time / 9:00 Local).",
        },
      ],
    },
  ],

  venue: {
    name: "MIDER BABUR",
    subtitle: "DIRE DAWA'S HISTORIC & ICONIC LANDMARK",
    address: "Mider Babur, Dire Dawa, Ethiopia",
    coordinates: "9.5931° N, 41.8661° E",
    description: "Located in the heart of Dire Dawa, Mider Babur is an iconic cultural landmark combining historic railway architecture with modern open-air festival grounds, luxury lounges, and volumetric light displays.",
    features: [
      "Historic Heritage Railway Grounds",
      "Executive VIP Lounge & Valet Parking",
      "Thermal Spatial Audio Architecture",
      "360° Volumetric Laser Overhead Canopy",
      "Dedicated High-Security VIP Entrances",
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
      description: "Full access to festival main arena, visual art installations, and general food courts from 9:00 AM to 9:00 PM (3:00 Morning to 3:00 Night Ethiopian time).",
      availability: "SELLING FAST",
      availabilityPercentage: 82,
      colorTheme: "bronze",
      benefits: [
        "Full Day General Arena Access (9:00 AM – 9:00 PM / 3:00 - 9:00 Local)",
        "Access to 3 Main Sound Stages",
        "Artisan Food & Beverage Courts",
        "Commemorative RFID Festival Wristband",
        "Digital Festival Experience Pass",
      ],
    },
    {
      id: "vip",
      name: "VIP SKY EXPERIENCE",
      badge: "RECOMMENDED",
      priceUSD: 450,
      priceETB: 25500,
      description: "Elevated view platforms, fast-track VIP entry, complimentary champagne welcome, and sky lounge access.",
      availability: "LIMITED TICKETS LEFT",
      availabilityPercentage: 91,
      featured: true,
      colorTheme: "gold",
      benefits: [
        "All General Pass Privileges Included",
        "Dedicated VIP Fast-Track Express Gate",
        "Access to Elevated VIP Sky Viewing Lounge",
        "Complimentary Welcome Drink",
        "Private VIP Restrooms",
        "Exclusive VIP Bar & Gourmet Dining Lounge",
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
