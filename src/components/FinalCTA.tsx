import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Ticket, Radio } from 'lucide-react';
import asset10666 from '../assets/10666 [Converted].jpg';
import { AudioVisualizerBars } from './AudioVisualizerBars';

interface FinalCTAProps {
  onOpenTickets: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenTickets }) => {
  return (
    <section className="relative py-20 md:py-32 bg-[#FAF8F5] overflow-hidden select-none text-slate-900 border-t border-slate-200">
      {/* Background Image Visual with Radiant Light Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src={asset10666}
          alt="KEZIRA Final CTA"
          className="w-full h-full object-cover filter brightness-[0.75] contrast-105 saturate-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/75 to-[#FAF8F5]/50" />
        <div className="film-grain-canvas opacity-20" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 mb-5 backdrop-blur-md shadow-md"
        >
          <Sparkles className="w-4 h-4 text-amber-700 animate-pulse" />
          <span className="text-3xs sm:text-2xs font-mono tracking-[0.25em] text-amber-900 uppercase font-bold">
            OCTOBER 3, 2026 • MIDER BABUR, DIRE DAWA
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold text-slate-900 leading-[1.05] tracking-tight mb-5"
        >
          STEP INTO <span className="gold-text-gradient">KEZIRA 2026</span>
        </motion.h2>

        {/* Minimized Punchy Statement */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-xl text-slate-800 font-light max-w-xl leading-relaxed mb-4"
        >
          A single day that echoes forever. 1,200 souls. 4 stages. Zero compromises.
        </motion.p>

        {/* Live Audio Visualizer Accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-8 p-2 rounded-2xl bg-white/80 border border-slate-200/80 backdrop-blur-md flex items-center gap-3 shadow-sm"
        >
          <AudioVisualizerBars isPlaying barCount={6} size="sm" barColor="bg-amber-600" />
          <span className="text-3xs font-mono tracking-widest text-slate-700 uppercase font-bold pr-2">
            LIMITED TIER PASSES REMAINING
          </span>
        </motion.div>

        {/* Animated Magnet CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative group"
        >
          {/* Animated Glow Ring Behind Button */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-300 opacity-60 blur-lg group-hover:opacity-100 transition-opacity duration-500" />

          <button
            onClick={onOpenTickets}
            className="relative px-10 py-5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-extrabold text-sm sm:text-base tracking-widest uppercase shadow-[0_0_45px_rgba(245,158,11,0.45)] hover:shadow-[0_0_65px_rgba(245,158,11,0.7)] transition-all duration-300 cursor-pointer overflow-hidden flex items-center gap-3"
          >
            <span className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <Ticket className="w-5 h-5 relative z-10" />
            <span className="relative z-10">GET YOUR TICKET NOW</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2 relative z-10" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
