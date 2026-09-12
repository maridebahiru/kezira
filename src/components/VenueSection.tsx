import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Sparkles, CheckCircle2, Calendar, Compass, Radio } from 'lucide-react';
import { eventConfig } from '../config/event';

export const VenueSection: React.FC = () => {
  const { venue } = eventConfig;

  return (
    <section id="venue" className="relative py-28 md:py-40 bg-[#0b0b12] overflow-hidden select-none">
      {/* Background Visual Image & Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={venue.bgImage}
          alt={venue.name}
          className="w-full h-full object-cover filter brightness-[0.6] contrast-115 saturate-110 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b12] via-[#0b0b12]/75 to-[#0b0b12]/50" />
        <div className="film-grain-canvas opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Venue Description & Map Link */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 mb-4 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-3xs font-mono tracking-[0.25em] text-amber-200 uppercase font-bold">
                THE ICONIC LOCATION
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.08] mb-2">
              {venue.name}
            </h2>

            <p className="text-xs sm:text-sm font-mono tracking-widest text-amber-300 font-bold uppercase mb-6 flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{venue.subtitle}</span>
            </p>

            {/* Minimized Punchy Copy */}
            <p className="text-base sm:text-lg text-slate-200 font-light leading-relaxed mb-8 max-w-xl">
              {venue.description}
            </p>

            {/* Address & Coordinates Badges with Hover Glow */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-mono text-slate-200 mb-8">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{venue.address}</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-slate-300 backdrop-blur-md">
                <Compass className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
                <span>{venue.coordinates}</span>
              </div>
            </div>

            {/* Map CTA Button with Kinetic Shimmer */}
            <a
              href={venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-black font-extrabold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_35px_rgba(245,158,11,0.4)]"
            >
              <Navigation className="w-4 h-4 text-black transition-transform duration-300 group-hover:rotate-45" />
              <span>EXPLORE VENUE MAP</span>
            </a>
          </motion.div>

          {/* Right Venue Features Checklist Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl border border-amber-400/50">
              <h3 className="text-xl font-serif font-bold text-amber-200 mb-6 flex items-center justify-between">
                <span>VENUE AMENITIES</span>
                <span className="text-2xs font-mono text-amber-300 uppercase tracking-widest font-bold">
                  LUXURY SPEC
                </span>
              </h3>

              <div className="space-y-3">
                {venue.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3.5 p-3 rounded-xl bg-black/60 border border-white/15 hover:border-amber-400/40 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-100 font-light">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-amber-500/30 flex items-center justify-between text-2xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>OCTOBER 3, 2026</span>
                </div>
                <span className="text-amber-300 font-bold">DIRE DAWA • PAPA</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VenueSection;
