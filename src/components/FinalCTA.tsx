import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Ticket } from 'lucide-react';
import asset10666 from '../assets/10666 [Converted].jpg';

interface FinalCTAProps {
  onOpenTickets: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenTickets }) => {
  return (
    <section className="relative py-16 md:py-24 bg-[#FAF8F5] overflow-hidden select-none text-slate-900 border-t border-slate-200">
      {/* Background Image Visual with Radiant Light Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src={asset10666}
          alt="KEZIRA Final CTA"
          className="w-full h-full object-cover filter brightness-[0.75] contrast-105 saturate-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/70 to-[#FAF8F5]/50" />
        <div className="film-grain-canvas opacity-20" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 mb-6 backdrop-blur-md shadow-md"
        >
          <Sparkles className="w-4 h-4 text-amber-700 animate-pulse" />
          <span className="text-3xs sm:text-2xs font-mono tracking-[0.25em] text-amber-900 uppercase font-bold">
            OCTOBER 3, 2026 • MIDER BABUR, DIRE DAWA
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold text-slate-900 leading-[1.05] tracking-tight mb-8"
        >
          BE PART OF THE <span className="gold-text-gradient">EXPERIENCE</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-xl text-slate-700 font-light max-w-2xl leading-relaxed mb-12"
        >
          Join 1,200+ discerning guests at Mider Babur, Dire Dawa for an unforgettable single day of sound, light, and luxury.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <button
            onClick={onOpenTickets}
            className="group relative px-10 py-5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-extrabold text-sm sm:text-base tracking-widest uppercase shadow-[0_0_45px_rgba(245,158,11,0.45)] hover:shadow-[0_0_65px_rgba(245,158,11,0.7)] transition-all duration-500 cursor-pointer overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Ticket className="w-5 h-5" />
              <span>GET YOUR TICKET NOW</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
