import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass, Radio, Volume2 } from 'lucide-react';
import { eventConfig } from '../config/event';
import { TextReveal } from './TextReveal';
import { AudioVisualizerBars } from './AudioVisualizerBars';

import papaGardenLogo from '../assets/papa.png';

export const AboutSection: React.FC = () => {
  const { about } = eventConfig;

  return (
    <section id="about" className="relative py-24 md:py-32 bg-[#FAF8F5] overflow-x-clip text-slate-900">
      {/* Radiant Background Ambient Glows */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Minimized, High-Impact Punchy Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Badge & Papa Garden Header Mark */}
            <div className="flex items-center gap-3 mb-4 flex-wrap sm:flex-nowrap">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <img src={papaGardenLogo} alt="PAPA GARDEN" className="h-4 sm:h-5 w-auto object-contain shrink-0" />
                <div className="h-3 w-px bg-amber-400/60" />
                <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="text-3xs font-mono tracking-[0.25em] text-amber-800 uppercase font-bold whitespace-nowrap">
                  {about.badge}
                </span>
              </div>
            </div>

            <TextReveal
              text={about.title}
              as="h2"
              className="text-3xl sm:text-5xl lg:text-6xl font-serif font-semibold text-slate-900 leading-[1.1] mb-6"
            />

            {/* Minimized Punchy Copy */}
            <p className="text-base sm:text-xl text-slate-700 font-light leading-relaxed mb-4">
              {about.description1}
            </p>

            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-xs font-mono text-slate-700 font-bold mb-8">
              <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>{about.description2}</span>
            </div>

            {/* Kinetic Event Stats Grid with Pulsing Shimmer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full pt-6 border-t border-slate-300">
              {about.stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.08 * idx }}
                  className="p-3.5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-sm flex flex-col hover:border-amber-400 hover:shadow-md transition-all group"
                >
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold gold-text-gradient group-hover:scale-105 transition-transform origin-left">
                    {stat.value}
                  </span>
                  <span className="text-3xs font-mono tracking-widest text-amber-800 mt-1 uppercase font-bold">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column Supporting Visual Media with Dynamic Overlays */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden glass-panel p-2.5 shadow-2xl group border border-slate-200">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src={about.mediaPoster}
                  alt="MAMSHA FEST Experience"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-105 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />

                {/* Live Soundwave Bar Inside Image */}
                <div className="absolute top-4 left-4 p-2 rounded-xl bg-black/60 border border-white/20 backdrop-blur-md flex items-center gap-2">
                  <AudioVisualizerBars isPlaying barCount={4} size="sm" barColor="bg-amber-400" />
                  <span className="text-[10px] font-mono tracking-widest text-white uppercase font-bold">
                    SPATIAL DOME
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 border border-slate-200 backdrop-blur-md shadow-lg">
                  <span className="text-3xs font-mono tracking-widest text-amber-700 uppercase block mb-1 font-bold">
                    ICONIC VENUE
                  </span>
                  <span className="text-sm font-serif text-slate-900 font-bold block">
                    PAPA, DIRE DAWA, ETHIOPIA
                  </span>
                </div>
              </div>

              {/* Decorative Floating Luxury Badge with Kinetic Spin */}
              <div className="absolute -top-4 -right-4 p-3.5 rounded-2xl glass-panel-gold shadow-2xl flex items-center gap-2 border border-amber-400/60">
                <Compass className="w-5 h-5 text-amber-700 animate-spin" style={{ animationDuration: '25s' }} />
                <span className="text-3xs font-mono tracking-wider text-amber-900 font-bold">
                  EAST AFRICA 2026
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
