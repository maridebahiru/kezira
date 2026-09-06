import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// One artist entry — image + name
export interface Artist {
  name: string;
  imageSrc: string;
  imageAlt?: string;
}

export interface ArtistsShowcaseProps {
  artists: Artist[]; // pass 5 or more
  className?: string;
  crop?: 'cutout' | 'circular';
}

// Middle-of-page showcase section: one shared luminous spotlight circle behind the group,
// with all artists standing in front of it together. Fully responsive on all screens.
export const ArtistsShowcase = ({
  artists,
  className,
  crop = 'cutout',
}: ArtistsShowcaseProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex;

  const handleArtistClick = (index: number) => {
    setSelectedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden bg-background px-2 py-10 sm:px-6 sm:py-16 md:px-10 md:py-20',
        className
      )}
    >
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center">
        {/* Stage: Shared circle spotlight behind the artists */}
        <div className="relative flex w-full items-end justify-center h-[210px] sm:h-[320px] md:h-[400px] lg:h-[480px]">
          {/* Luminous shared circle spotlight */}
          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 z-0 h-[190px] w-[190px] sm:h-[290px] sm:w-[290px] md:h-[380px] md:w-[380px] lg:h-[460px] lg:w-[460px] rounded-full bg-gradient-to-t from-amber-400 via-yellow-400 to-yellow-300 shadow-[0_0_50px_rgba(251,191,36,0.35)] sm:shadow-[0_0_90px_rgba(251,191,36,0.4)] pointer-events-none"
          >
            {/* Soft ambient aura pulse */}
            <div className="absolute inset-0 rounded-full bg-yellow-400/30 blur-2xl -z-10 animate-pulse pointer-events-none" />
          </motion.div>

          {/* Row of artists standing in front of the spotlight */}
          <div className="relative z-10 flex items-end justify-center w-full max-w-full gap-1 sm:gap-4 md:gap-6 px-1 sm:px-4">
            {artists.map((artist, index) => {
              const isCurrent = activeIndex === index;

              return crop === 'circular' ? (
                <motion.div
                  key={artist.name}
                  initial={{ opacity: 0, y: 35, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.65,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.1 + index * 0.08,
                  }}
                  whileHover={{ y: -6, scale: 1.08 }}
                  whileTap={{ y: -2, scale: 1.04 }}
                  style={{ zIndex: isCurrent ? 30 : index + 1 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleArtistClick(index)}
                  className={cn(
                    'group relative rounded-full overflow-hidden border-2 bg-slate-100 shadow-xl shrink min-w-0 cursor-pointer transition-all duration-300',
                    'h-12 w-12 sm:h-24 sm:w-24 md:h-32 md:w-32 lg:h-40 lg:w-40',
                    isCurrent
                      ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-amber-300/50'
                      : 'border-white'
                  )}
                >
                  <img
                    src={artist.imageSrc}
                    alt={artist.imageAlt || `Portrait of ${artist.name}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src =
                        'https://cdn.21st.dev/assets/mirror/69/69f133c713200aa29789f9f07a83f105cc28793926179eb4a224b0454a743a00.svg';
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={artist.name}
                  initial={{ opacity: 0, y: 40, scale: 0.92 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.1 + index * 0.08,
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.06,
                    transition: { duration: 0.25, ease: 'easeOut' },
                  }}
                  whileTap={{
                    y: -4,
                    scale: 1.03,
                    transition: { duration: 0.15, ease: 'easeOut' },
                  }}
                  style={{ zIndex: isCurrent ? 30 : index + 1 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleArtistClick(index)}
                  className="relative flex flex-col items-center justify-end shrink min-w-0 cursor-pointer select-none group"
                >
                  <img
                    src={artist.imageSrc}
                    alt={artist.imageAlt || `Portrait of ${artist.name}`}
                    className={cn(
                      'h-[160px] sm:h-[260px] md:h-[340px] lg:h-[410px]',
                      'w-auto max-w-[17vw] sm:max-w-[130px] md:max-w-[175px] lg:max-w-[210px]',
                      'object-contain object-bottom transition-all duration-300',
                      'filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.12)]',
                      isCurrent
                        ? 'drop-shadow-[0_8px_22px_rgba(245,158,11,0.5)] brightness-105'
                        : 'group-hover:drop-shadow-[0_6px_16px_rgba(245,158,11,0.35)]'
                    )}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src =
                        'https://cdn.21st.dev/assets/mirror/69/69f133c713200aa29789f9f07a83f105cc28793926179eb4a224b0454a743a00.svg';
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Artist Names Lineup — interactive and wrapped cleanly across all screen sizes */}
        <div className="mt-6 sm:mt-10 flex w-full flex-wrap items-center justify-center gap-1.5 sm:gap-4 md:gap-6 px-2">
          {artists.map((artist, index) => {
            const isCurrent = activeIndex === index;
            return (
              <button
                type="button"
                key={artist.name}
                onClick={() => handleArtistClick(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  'px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-3xs sm:text-xs md:text-sm font-medium tracking-wider uppercase transition-all duration-200 cursor-pointer',
                  isCurrent
                    ? 'bg-amber-500/15 text-amber-900 border border-amber-400/80 font-bold shadow-xs scale-105'
                    : 'text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-200/80 hover:bg-white/70'
                )}
              >
                {artist.name}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ArtistsShowcase;
