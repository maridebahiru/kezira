import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles, Music, Crown, Palette, Mic2 } from 'lucide-react';
import { eventConfig } from '../config/event';

export const ScheduleSection: React.FC = () => {
  const [activeDayId, setActiveDayId] = useState<string>(
    eventConfig.schedule[0].dayId
  );

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
    <section id="schedule" className="relative py-28 md:py-36 bg-[#FAF8F5] border-t border-slate-200 overflow-hidden text-slate-900">
      {/* Background Ambient Glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-3xs font-mono tracking-[0.25em] text-amber-800 uppercase font-bold">
              FESTIVAL TIMELINE
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-semibold text-slate-900">
            CINEMATIC PROGRAMME & SCHEDULE
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl font-light mt-4 leading-relaxed">
            A curated single-day musical performance, visual spectacle, and exclusive sky lounge experience from 9:00 AM to 9:00 PM.
          </p>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-16">
          {eventConfig.schedule.map((day) => {
            const isActive = day.dayId === activeDayId;
            return (
              <button
                key={day.dayId}
                onClick={() => setActiveDayId(day.dayId)}
                className={`relative px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer border ${
                  isActive
                    ? 'glass-panel-gold text-amber-950 border-amber-500/60 shadow-lg shadow-amber-500/10 font-bold'
                    : 'glass-panel text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="font-bold">{day.dayTitle}</span>
                  <span className="text-[10px] text-slate-500 font-normal">{day.date}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Timeline Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay.dayId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative pl-6 sm:pl-10 border-l border-amber-400/40 space-y-10 sm:space-y-12"
          >
            {activeDay.items.map((item, idx) => (
              <motion.div
                key={`${activeDay.dayId}-${item.time}-${idx}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative group"
              >
                {/* Timeline Dot Node */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-amber-500 group-hover:scale-125 group-hover:bg-amber-500 transition-all duration-300 flex items-center justify-center shadow-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:bg-white" />
                </div>

                <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 hover:border-amber-400/60 transition-all duration-300 group-hover:translate-x-1 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-400/30 text-amber-800 font-mono text-xs font-bold">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span>{item.time}</span>
                      </div>
                      <span className="text-3xs font-mono tracking-widest text-slate-600 font-semibold uppercase px-2.5 py-1 rounded bg-slate-100 border border-slate-200">
                        {item.stage}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {getCategoryIcon(item.category)}
                      <span className="text-3xs font-mono tracking-widest text-slate-600 uppercase font-semibold">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-semibold text-slate-900 mb-2 group-hover:text-amber-800 transition-colors">
                    {item.title}
                  </h3>

                  <div className="text-xs sm:text-sm font-mono text-amber-700 font-bold mb-3 tracking-wide">
                    {item.artist}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ScheduleSection;
