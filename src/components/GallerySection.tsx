import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { eventConfig, GalleryMedia } from '../config/event';

import enkuuLogo from '../assets/enkuu.png';
import papaGardenLogo from '../assets/papa.png';

export const GallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = ['ALL', 'PERFORMANCE', 'LIGHT SHOW', 'VIP EXPERIENCE', 'BEHIND THE SCENES', 'ATMOSPHERE'];

  const filteredItems =
    activeCategory === 'ALL'
      ? eventConfig.gallery
      : eventConfig.gallery.filter(
          (item) => item.category.toUpperCase() === activeCategory
        );

  const activeLightboxItem =
    activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  const handleNextLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredItems.length);
    }
  };

  const handlePrevLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex(
        (activeLightboxIndex - 1 + filteredItems.length) % filteredItems.length
      );
    }
  };

  return (
    <section id="gallery" className="relative py-28 md:py-36 bg-[#070709] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            {/* Dynamic Scrolling ENQUU & PAPA GARDEN Marquee Ticker */}
            <div className="overflow-hidden whitespace-nowrap py-1.5 px-4 rounded-full bg-amber-500/15 border border-amber-400/40 shadow-sm max-w-[320px] sm:max-w-[400px]">
              <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                className="inline-flex gap-3 items-center text-3xs font-mono tracking-[0.2em] text-amber-300 uppercase font-extrabold"
              >
                <img src={enkuuLogo} alt="ENQUU" className="h-4 w-auto object-contain shrink-0" />
                <span>ENQUU</span>
                <span>•</span>
                <img src={papaGardenLogo} alt="PAPA GARDEN" className="h-4 w-auto object-contain shrink-0" />
                <span>PAPA GARDEN</span>
                <span>•</span>
                <img src={enkuuLogo} alt="ENQUU" className="h-4 w-auto object-contain shrink-0" />
                <span>ENQUU</span>
                <span>•</span>
                <img src={papaGardenLogo} alt="PAPA GARDEN" className="h-4 w-auto object-contain shrink-0" />
                <span>PAPA GARDEN</span>
                <span>•</span>
              </motion.div>
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-semibold text-white">
            MOMENTS CAPTURED IN LIGHT
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl font-light mt-4">
            Explore the visual aesthetic, stage design, and vibrant energy of MAMSHA FEST.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-3xs sm:text-2xs font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-amber-400 text-black font-bold border-amber-400 shadow-md shadow-amber-400/20'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Editorial Asymmetric Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item, idx) => {
              // Asymmetric aspect ratio classes
              const getAspectClass = () => {
                switch (item.aspectRatio) {
                  case 'portrait':
                    return 'aspect-[3/4] sm:row-span-2';
                  case 'wide':
                    return 'aspect-[16/9] sm:col-span-2';
                  case 'landscape':
                    return 'aspect-[4/3]';
                  case 'square':
                  default:
                    return 'aspect-square';
                }
              };

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  onClick={() => setActiveLightboxIndex(idx)}
                  className={`group relative rounded-3xl overflow-hidden glass-panel p-2 cursor-pointer shadow-xl ${getAspectClass()}`}
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6" />

                    {/* Hover Meta Overlay */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex justify-end">
                        <div className="p-2.5 rounded-full bg-black/60 border border-white/20 text-amber-400 backdrop-blur-md">
                          {item.type === 'video' ? (
                            <Play className="w-4 h-4 fill-amber-400" />
                          ) : (
                            <Maximize2 className="w-4 h-4" />
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-3xs font-mono tracking-widest text-amber-400 uppercase block mb-1">
                          {item.category}
                        </span>
                        <h3 className="text-lg font-serif font-medium text-white">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-2xl">
            {/* Close Button */}
            <button
              onClick={() => setActiveLightboxIndex(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Nav Previous */}
            <button
              onClick={handlePrevLightbox}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Nav Next */}
            <button
              onClick={handleNextLightbox}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
            >
              <img
                src={activeLightboxItem.src}
                alt={activeLightboxItem.title}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              />
              <div className="mt-4 text-center">
                <span className="text-3xs font-mono tracking-widest text-amber-400 uppercase block mb-1">
                  {activeLightboxItem.category}
                </span>
                <h3 className="text-xl font-serif text-white font-medium">
                  {activeLightboxItem.title}
                </h3>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
