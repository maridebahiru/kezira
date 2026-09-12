import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, MapPin, Calendar } from 'lucide-react';
import { HeroVideoConfig } from '../config/event';
import enkuuLogo from '../assets/enkuu.png';
import papaGardenLogo from '../assets/papa.png';

interface HeroContentProps {
  currentVideo: HeroVideoConfig;
  eventName: string;
  eventEdition: string;
  date: string;
  location: string;
  onOpenTickets: () => void;
  onExplore: () => void;
  mousePos: { x: number; y: number };
  isMobile: boolean;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  currentVideo,
  eventName,
  eventEdition,
  date,
  location,
  onOpenTickets,
  onExplore,
  mousePos,
  isMobile,
}) => {
  // Split title into words for cinematic mask & blur reveal
  const titleWords = currentVideo.title.split(' ');

  // Opposite mouse movement transform on desktop for parallax depth
  const textX = isMobile ? 0 : mousePos.x * -10;
  const textY = isMobile ? 0 : mousePos.y * -10;

  return (
    <motion.div
      style={{ x: textX, y: textY }}
      className="relative z-20 flex flex-col items-center md:items-start text-center md:text-left max-w-5xl px-4 sm:px-8 w-full"
    >
      {/* Event Badge / Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: -15, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-amber-500/40 backdrop-blur-md mb-4 sm:mb-6 shadow-md"
      >
        <div className="flex items-center gap-1.5">
          <img src={enkuuLogo} alt="ENQU EVENT Logo" className="h-5 sm:h-6 w-auto object-contain" />
          <img src={papaGardenLogo} alt="PAPA GARDEN Logo" className="h-5 sm:h-6 w-auto object-contain" />
        </div>
        <div className="h-3 w-px bg-amber-400/50" />
        <span className="text-[10px] sm:text-2xs font-mono tracking-[0.18em] sm:tracking-[0.25em] text-amber-300 uppercase font-bold">
          MAIN ORGANIZERS: ENQU EVENT & PAPA GARDEN PRESENT — {eventName} {eventEdition}
        </span>
      </motion.div>

      {/* Main Title Word-by-Word Reveal */}
      <div className="mb-4 sm:mb-6 overflow-hidden w-full">
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-semibold tracking-tight text-white leading-[1.08] sm:leading-[1.05] drop-shadow-2xl">
          {titleWords.map((word, index) => (
            <motion.span
              key={`${currentVideo.id}-${word}-${index}`}
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.85,
                delay: 0.3 + index * 0.12,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              className="inline-block mr-[0.2em] sm:mr-[0.25em] last:mr-0 gold-text-gradient"
            >
              {word}
            </motion.span>
          ))}
        </h1>
      </div>

      {/* Chapter Tagline / Subtitle */}
      <motion.p
        key={currentVideo.subtitle}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="text-xs sm:text-base md:text-lg text-slate-300 font-light tracking-wide max-w-2xl mb-5 sm:mb-8 leading-relaxed px-2 sm:px-0"
      >
        {currentVideo.subtitle}
      </motion.p>

      {/* Uppercase Metadata (Date & Location) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-6 text-[11px] sm:text-sm font-mono tracking-[0.12em] sm:tracking-[0.2em] text-slate-300 mb-6 sm:mb-10 w-full"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-black/40 border border-white/10">
          <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{date}</span>
        </div>
        <span className="text-amber-500/50 hidden sm:inline">•</span>
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-black/40 border border-white/10">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{location}</span>
        </div>
      </motion.div>

      {/* Premium CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto"
      >
        {/* Primary CTA */}
        <button
          onClick={onOpenTickets}
          className="group relative w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-semibold text-xs sm:text-sm tracking-widest uppercase overflow-hidden shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] transition-all duration-300 cursor-pointer"
        >
          <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          <span className="relative z-10 flex items-center justify-center gap-2.5">
            <span>GET YOUR TICKET</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </span>
        </button>

        {/* Secondary CTA */}
        <button
          onClick={onExplore}
          className="group relative w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 backdrop-blur-md cursor-pointer"
        >
          <span className="flex items-center justify-center gap-2">
            <span>EXPLORE EVENT</span>
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default HeroContent;
