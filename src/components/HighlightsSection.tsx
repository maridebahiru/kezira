import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { eventConfig, HighlightItem } from '../config/event';

export const HighlightsSection: React.FC = () => {
  const [activeHighlight, setActiveHighlight] = useState<HighlightItem>(
    eventConfig.highlights[0]
  );

  return (
    <section id="highlights" className="relative py-28 md:py-36 bg-[#FAF8F5] border-t border-slate-200 overflow-hidden text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/50 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-3xs font-mono tracking-[0.25em] text-amber-800 uppercase font-bold">
              THE KEZIRA EXPERIENCE
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-semibold text-slate-900">
            CURATED FESTIVAL HIGHLIGHTS
          </h2>
        </div>

        {/* Interactive Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Interactive Highlight Titles */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {eventConfig.highlights.map((item) => {
              const isSelected = item.id === activeHighlight.id;

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveHighlight(item)}
                  onClick={() => setActiveHighlight(item)}
                  className={`group relative p-6 rounded-2xl transition-all duration-500 cursor-pointer border ${
                    isSelected
                      ? 'glass-panel-gold border-amber-500/60 translate-x-2 shadow-lg'
                      : 'glass-panel border-slate-200 hover:border-amber-400/40 hover:translate-x-1'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <span
                        className={`text-sm font-mono font-bold tracking-widest pt-1 transition-colors ${
                          isSelected ? 'text-amber-700' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      >
                        {item.number}
                      </span>
                      <div>
                        <h3
                          className={`text-xl sm:text-2xl font-serif font-medium transition-colors ${
                            isSelected ? 'text-amber-900 font-bold' : 'text-slate-900 group-hover:text-amber-800'
                          }`}
                        >
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 font-light mt-1 leading-relaxed">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isSelected
                          ? 'text-amber-700 translate-x-1 -translate-y-1'
                          : 'text-slate-400 group-hover:text-amber-600'
                      }`}
                    />
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4 pl-9">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-3xs font-mono tracking-widest uppercase px-2.5 py-1 rounded-md border font-bold ${
                          isSelected
                            ? 'bg-amber-400/25 text-amber-900 border-amber-400/40'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Visual Preview Display */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass-panel p-2.5 shadow-2xl border border-slate-200">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeHighlight.id}
                  initial={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.95, filter: 'blur(6px)' }}
                  transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                  className="relative w-full h-full rounded-2xl overflow-hidden"
                >
                  <img
                    src={activeHighlight.image}
                    alt={activeHighlight.title}
                    className="w-full h-full object-cover filter brightness-105 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                  {/* Overlay Description */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/90 border border-slate-200 backdrop-blur-md shadow-lg">
                    <span className="text-3xs font-mono tracking-widest text-amber-700 uppercase block mb-1 font-bold">
                      {activeHighlight.number} // HIGHLIGHT DETAILS
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-light">
                      {activeHighlight.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;
