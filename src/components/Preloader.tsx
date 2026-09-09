import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import enkuuLogo from '../assets/enkuu.png';
import logoImg from '../assets/logo.png';
import mamshaLogo from '../assets/enkuu.png';
import abshirLogo from '../assets/abshir logo.png';

export const Preloader: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 400);
          return 100;
        }
        // Increment progress smoothly
        const step = Math.floor(Math.random() * 12) + 5;
        return Math.min(prev + step, 100);
      });
    }, 90);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.7, ease: [0.87, 0, 0.13, 1] }}
          className="fixed inset-0 z-100 flex flex-col items-center justify-between py-10 px-6 bg-[#FAF8F5] text-slate-900 select-none overflow-hidden"
        >
          {/* Subtle Ambient Film Grain */}
          <div className="film-grain-canvas opacity-20 pointer-events-none" />

          {/* Ambient Radiant Warm Golden Halos */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-400/20 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] rounded-full border border-amber-300/40 -z-10 pointer-events-none" />

          {/* Top Tagline */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/40 backdrop-blur-md shadow-xs"
          >
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="text-3xs font-mono tracking-[0.3em] text-amber-800 uppercase font-bold">
              ENQU EVENT PRESENTS KEZIRA
            </span>
          </motion.div>

          {/* Center Brand Logo & Pulsing Light Aura */}
          <div className="relative flex flex-col items-center justify-center my-auto text-center z-10">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="relative mb-6 sm:mb-8"
            >
              {/* Outer Warm Golden Glow Ring */}
              <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-amber-400/25 via-yellow-400/35 to-amber-500/25 blur-2xl animate-pulse" />

              <img
                src={enkuuLogo}
                alt="ENQU EVENT Logo"
                className="relative h-28 sm:h-36 md:h-44 w-auto object-contain filter drop-shadow-[0_10px_25px_rgba(217,119,6,0.2)]"
              />
            </motion.div>

            {/* Percentage Counter */}
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-5xl sm:text-7xl font-serif font-bold text-slate-900 tracking-tighter">
                {progress}
              </span>
              <span className="text-xl sm:text-2xl font-mono text-amber-600 font-bold">%</span>
            </div>

            {/* Subtitle Status */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xs sm:text-2xs font-mono tracking-[0.25em] text-slate-500 uppercase font-semibold"
            >
              INITIALIZING CINEMATIC EXPERIENCE • DIRE DAWA 2026
            </motion.p>
          </div>

          {/* Bottom Progress Bar & Partner Logos */}
          <div className="w-full max-w-md sm:max-w-xl flex flex-col items-center gap-5 z-10">
            {/* Progress Track */}
            <div className="w-full h-1.5 bg-slate-200/90 rounded-full overflow-hidden relative border border-slate-300/60 shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-500 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>

            {/* Partner Brand Logos Footer */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 opacity-85 hover:opacity-100 transition-opacity text-3xs font-mono tracking-wider text-slate-600"
            >
              <div className="flex items-center gap-2">
                <img src={mamshaLogo} alt="MAMSHA" className="h-5 sm:h-6 w-auto object-contain" />
                <span className="text-[10px] font-bold text-amber-700">EXCLUSIVE PARTNER</span>
              </div>
              <div className="h-3 w-px bg-slate-300 hidden sm:block" />
              <div className="flex items-center gap-2">
                <img src={logoImg} alt="KEZIRA MEDIA HUB" className="h-5 sm:h-6 w-auto object-contain" />
                <span className="text-[10px] font-bold text-slate-700">MEDIA HUB</span>
              </div>
              <div className="h-3 w-px bg-slate-300 hidden sm:block" />
              <div className="flex items-center gap-2">
                <img src={abshirLogo} alt="ABSHIR PRODUCTION" className="h-5 sm:h-6 w-auto object-contain" />
                <span className="text-[10px] font-bold text-slate-700">PRODUCTION</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
