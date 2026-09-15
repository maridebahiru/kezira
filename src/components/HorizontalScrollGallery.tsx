import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { eventConfig, GalleryMedia } from '../config/event';
import { TextReveal } from './TextReveal';

import papaGardenLogo from '../assets/papa.png';

export const HorizontalScrollGallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Measure vertical scroll through tall container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Transform vertical progress (0 to 1) into horizontal X offset (-0% to -72%)
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-72%']);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const galleryItems = eventConfig.gallery;
  const activeLightboxItem =
    activeLightboxIndex !== null ? galleryItems[activeLightboxIndex] : null;

  const handleNextLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % galleryItems.length);
    }
  };

  const handlePrevLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex(
        (activeLightboxIndex - 1 + galleryItems.length) % galleryItems.length
      );
    }
  };

  return (
    <section
      id="gallery"
      ref={containerRef}
      style={{ position: 'relative' }}
      className="relative h-[160vh] sm:h-[180vh] bg-[#FAF8F5] border-t border-slate-200 text-slate-900"
    >
      {/* Sticky Window Container */}
      <div className="sticky top-0 h-screen flex flex-col justify-between overflow-x-clip py-6 sm:py-8 md:py-10">
        {/* Header Bar */}
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="text-3xs font-mono tracking-[0.25em] text-amber-800 uppercase font-bold whitespace-nowrap">
                  EDITORIAL VISUAL GALLERY
                </span>
              </div>

              {/* Dynamic Scrolling PAPA GARDEN Marquee Ticker */}
              <div className="overflow-hidden whitespace-nowrap py-1 px-3.5 rounded-full bg-amber-500/15 border border-amber-400/40 shadow-sm max-w-[220px] sm:max-w-[260px]">
                <motion.div
                  animate={{ x: ['0%', '-50%'] }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                  className="inline-flex gap-3 items-center text-3xs font-mono tracking-[0.25em] text-amber-900 uppercase font-extrabold"
                >
                  <img src={papaGardenLogo} alt="PAPA GARDEN" className="h-3.5 w-auto object-contain shrink-0" />
                  <span>PAPA GARDEN</span>
                  <span>•</span>
                  <img src={papaGardenLogo} alt="PAPA GARDEN" className="h-3.5 w-auto object-contain shrink-0" />
                  <span>PAPA GARDEN</span>
                  <span>•</span>
                  <img src={papaGardenLogo} alt="PAPA GARDEN" className="h-3.5 w-auto object-contain shrink-0" />
                  <span>PAPA GARDEN</span>
                  <span>•</span>
                </motion.div>
              </div>
            </div>

            <TextReveal
              text="MOMENTS CAPTURED IN LIGHT"
              as="h2"
              className="text-3xl sm:text-5xl font-serif font-semibold text-slate-900"
            />
          </div>
        </div>

        {/* Pinned Horizontal Scrolling Track */}
        <div className="relative w-full flex-1 flex items-center my-6">
          <motion.div style={{ x }} className="flex gap-6 md:gap-8 px-4 sm:px-16 will-change-transform">
            {galleryItems.map((item: GalleryMedia, idx: number) => (
              <div
                key={item.id}
                onClick={() => setActiveLightboxIndex(idx)}
                className="group relative flex-none w-[300px] sm:w-[420px] md:w-[500px] aspect-[4/3] rounded-3xl overflow-hidden glass-panel p-2.5 cursor-pointer shadow-xl transition-transform duration-500 hover:scale-[1.02] border border-slate-200"
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 filter brightness-105 contrast-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

                  {/* Content Meta */}
                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-3xs font-mono tracking-widest text-amber-800 font-bold uppercase shadow-sm">
                        {item.category}
                      </span>
                      <div className="p-3 rounded-full bg-white/90 border border-slate-200 text-amber-700 backdrop-blur-md transition-transform duration-300 group-hover:scale-110 shadow-sm">
                        {item.type === 'video' ? (
                          <Play className="w-4 h-4 fill-amber-700" />
                        ) : (
                          <Maximize2 className="w-4 h-4" />
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-3xs font-mono tracking-widest text-amber-300 uppercase block mb-1 font-bold">
                        EXHIBIT 0{idx + 1}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-serif font-medium text-white group-hover:text-amber-200 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Horizontal Progress Bar */}
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-8">
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              style={{ width: progressWidth }}
              className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-2xl">
            <button
              onClick={() => setActiveLightboxIndex(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-20 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={handlePrevLightbox}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-20 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNextLightbox}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-20 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
            >
              <img
                src={activeLightboxItem.src}
                alt={activeLightboxItem.title}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/20"
              />
              <div className="mt-4 text-center">
                <span className="text-3xs font-mono tracking-widest text-amber-400 uppercase block mb-1 font-bold">
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

export default HorizontalScrollGallery;
