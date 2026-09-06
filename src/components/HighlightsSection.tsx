import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowUpRight, Radio } from 'lucide-react';
import { eventConfig, HighlightItem } from '../config/event';
import { AudioVisualizerBars } from './AudioVisualizerBars';

export const HighlightsSection: React.FC = () => {
  const [activeHighlight, setActiveHighlight] = useState<HighlightItem>(
    eventConfig.highlights[0]
  );

  return (
    <section id="highlights" className="relative py-24 md:py-32 bg-[#FAF8F5] border-t border-slate-200 overflow-hidden text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header: Punchy & Bold */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/50 mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span className="text-3xs font-mono tracking-[0.25em] text-amber-800 uppercase font-bold">
                THE KEZIRA EXPERIENCE
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-semibold text-slate-900">
              CURATED HIGHLIGHTS
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono tracking-widest text-slate-500 uppercase">
            HOVER TO EXPLORE EXPERIENCES
          </p>
        </div>

        {/* Interactive Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Interactive Highlight Items */}
          <div className="lg:col-span-7 flex flex-col gap-3.5">
            {eventConfig.highlights.map((item) => {
              const isSelected = item.id === activeHighlight.id;

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveHighlight(item)}
                  onClick={() => setActiveHighlight(item)}
                  className={`group relative p-5 sm:p-6 rounded-2xl transition-all duration-400 cursor-pointer border ${
                    isSelected
                      ? 'glass-panel-gold border-amber-500/70 translate-x-2 sm:translate-x-3 shadow-[0_10px_30px_rgba(245,158,11,0.18)]'
                      : 'glass-panel border-slate-200 hover:border-amber-400/40 hover:translate-x-1'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <span
                        className={`text-sm sm:text-base font-mono font-bold tracking-widest pt-0.5 transition-colors ${
                          isSelected ? 'text-amber-700' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      >
                        {item.number}
                      </span>
                      <div>
                        <h3
                          className={`text-lg sm:text-2xl font-serif font-bold transition-colors ${
                            isSelected ? 'text-amber-950' : 'text-slate-900 group-hover:text-amber-800'
                          }`}
                        >
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 font-light mt-1 leading-relaxed">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isSelected && (
                        <AudioVisualizerBars isPlaying barCount={3} size="sm" barColor="bg-amber-600" />
                      )}
                      <ArrowUpRight
                        className={`w-5 h-5 transition-transform duration-300 ${
                          isSelected
                            ? 'text-amber-700 translate-x-1 -translate-y-1'
                            : 'text-slate-400 group-hover:text-amber-600'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3.5 pl-8 sm:pl-9">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-3xs font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-md border font-bold ${
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
                  initial={{ opacity: 0, scale: 1.06, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
                  transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                  className="relative w-full h-full rounded-2xl overflow-hidden"
                >
                  <img
                    src={activeHighlight.image}
                    alt={activeHighlight.title}
                    className="w-full h-full object-cover filter brightness-105 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                  {/* Punchy Overlay Statement */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 border border-slate-200 backdrop-blur-md shadow-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-3xs font-mono tracking-widest text-amber-700 uppercase font-bold">
                        {activeHighlight.number} // EXPERIENCE HIGHLIGHT
                      </span>
                      <Radio className="w-3 h-3 text-amber-600 animate-pulse" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-snug font-medium">
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
