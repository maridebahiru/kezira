import React from 'react';
import { motion } from 'framer-motion';
import { HeroVideoConfig } from '../config/event';

interface HeroVideoNavigationProps {
  videos: HeroVideoConfig[];
  currentIndex: number;
  progress: number; // 0 to 100
  onSelectVideo: (index: number) => void;
}

export const HeroVideoNavigation: React.FC<HeroVideoNavigationProps> = ({
  videos,
  currentIndex,
  progress,
  onSelectVideo,
}) => {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-8 z-20 w-full md:w-auto">
      {videos.map((video, idx) => {
        const isActive = idx === currentIndex;
        const formattedIndex = String(idx + 1).padStart(2, '0');

        return (
          <button
            key={video.id}
            onClick={() => onSelectVideo(idx)}
            className="group flex flex-col gap-1.5 sm:gap-2 text-left cursor-pointer focus:outline-none transition-all duration-300"
            aria-label={`Select video chapter ${formattedIndex}: ${video.title}`}
          >
            <div className="flex items-center gap-1.5 sm:gap-3">
              <span
                className={`text-[11px] sm:text-xs md:text-sm tracking-widest font-mono transition-colors duration-300 ${
                  isActive
                    ? 'text-amber-400 font-semibold'
                    : 'text-white/40 group-hover:text-white/80'
                }`}
              >
                {formattedIndex}
              </span>
              <span
                className={`text-[10px] sm:text-2xs md:text-xs tracking-wider uppercase hidden md:inline transition-colors duration-300 ${
                  isActive ? 'text-slate-200' : 'text-slate-500 group-hover:text-slate-300'
                }`}
              >
                {video.title}
              </span>
            </div>

            {/* Chapter Progress Track */}
            <div className="relative w-10 sm:w-20 md:w-32 h-[2px] bg-white/15 overflow-hidden rounded-full transition-all duration-300 group-hover:bg-white/30">
              {isActive ? (
                <motion.div
                  className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-amber-400 to-amber-200 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              ) : idx < currentIndex ? (
                <div className="absolute inset-0 bg-white/40" />
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default HeroVideoNavigation;
