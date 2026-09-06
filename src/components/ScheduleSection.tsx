import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles, Music, Crown, Palette, Mic2, Radio } from 'lucide-react';
import { eventConfig } from '../config/event';
import { AudioVisualizerBars } from './AudioVisualizerBars';

export const ScheduleSection: React.FC = () => {
  const [activeDayId, setActiveDayId] = useState<string>(
    eventConfig.schedule[0].dayId
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeDay =
    eventConfig.schedule.find((d) => d.dayId === activeDayId) ||
    eventConfig.schedule[0];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'music':
        return <Music className="w-4 h-4 text-amber-600" />;
      case 'vip':
        return <Crown className="w-4 h-4 text-amber-700" />;
      case 'art':
        return <Palette className="w-4 h-4 text-purple-600" />;
      default:
        return <Mic2 className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <section id="schedule" className="relative py-24 md:py-32 bg-[#FAF8F5] border-t border-slate-200 overflow-hidden text-slate-900">
      {/* Background Ambient Glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header: Minimized text */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-3xs font-mono tracking-[0.25em] text-amber-800 uppercase font-bold">
              FESTIVAL TIMELINE
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-semibold text-slate-900">
            CINEMATIC PROGRAMME
          </h2>
          <p className="text-xs sm:text-sm font-mono tracking-widest text-slate-500 uppercase mt-3">
            ONE MONUMENTAL DAY // 9:00 AM – 9:00 PM (3:00 - 9:00 LOCAL)
          </p>
        </div>

        {/* Timeline Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay.dayId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="relative pl-6 sm:pl-10 border-l-2 border-amber-500/40 space-y-8 sm:space-y-10"
          >
            {activeDay.items.map((item, idx) => {
              const isHovered = hoveredIndex === idx;

              return (
                <motion.div
                  key={`${activeDay.dayId}-${item.time}-${idx}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative group"
                >
                  {/* Timeline Node with Ping Pulse Animation */}
                  <div className="absolute -left-[33px] sm:-left-[49px] top-4 w-4 h-4 rounded-full bg-white border-2 border-amber-500 group-hover:scale-125 group-hover:bg-amber-500 transition-all duration-300 flex items-center justify-center shadow-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:bg-white" />
                  </div>

                  <div className="glass-panel p-5 sm:p-7 rounded-2xl border border-slate-200 hover:border-amber-400/60 transition-all duration-300 group-hover:translate-x-1.5 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-400/30 text-amber-800 font-mono text-xs font-bold">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          <span>{item.time}</span>
                        </div>
                        <span className="text-3xs font-mono tracking-widest text-slate-700 font-bold uppercase px-2.5 py-1 rounded bg-slate-100 border border-slate-200">
                          {item.stage}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {isHovered && (
                          <AudioVisualizerBars isPlaying barCount={4} size="sm" barColor="bg-amber-600" />
                        )}
                        <div className="flex items-center gap-1.5">
                          {getCategoryIcon(item.category)}
                          <span className="text-3xs font-mono tracking-widest text-slate-600 uppercase font-bold">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-2xl font-serif font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                      {item.title}
                    </h3>

                    <div className="text-xs sm:text-sm font-mono text-amber-700 font-bold mt-1 mb-2 tracking-wide">
                      {item.artist}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ScheduleSection;
