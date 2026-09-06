import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/logo.png';
import mamshaLogo from '../assets/mamsha.png';
import abshirLogo from '../assets/abshir logo.png';
import enkuImg from '../assets/enku.jpg';

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
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.87, 0, 0.13, 1] }}
          className="fixed inset-0 z-100 flex flex-col items-center justify-between py-12 px-6 bg-[#0B0D19] text-slate-100 select-none overflow-hidden"
        >
          {/* Ambient Lighting & Radiant Background Halo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-[180px] pointer-events-none" />

          {/* Top Tagline */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 backdrop-blur-md"
          >
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-3xs font-mono tracking-[0.3em] text-amber-300 uppercase font-bold">
              KEZIRA MEDIA PRESENTS
            </span>
          </motion.div>

          {/* Center Brand Logo & Pulsing Light Ring */}
          <div className="relative flex flex-col items-center justify-center my-auto text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative mb-8"
            >
              {/* Outer Golden Aura Ring */}
              <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/40 to-amber-600/20 blur-xl animate-pulse" />
              
              <img
                src={logoImg}
                alt="KEZIRA Logo"
                className="relative h-24 sm:h-32 md:h-40 w-auto object-contain filter drop-shadow-[0_0_35px_rgba(245,158,11,0.5)]"
              />
            </motion.div>

            {/* Percentage Counter */}
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-5xl sm:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 font-mono tracking-tighter">
                {progress}
              </span>
              <span className="text-xl sm:text-2xl font-mono text-amber-400 font-bold">%</span>
            </div>

            {/* Subtitle Status */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xs sm:text-2xs font-mono tracking-[0.25em] text-slate-400 uppercase font-medium"
            >
              INITIALIZING CINEMATIC EXPERIENCE • DIRE DAWA 2026
            </motion.p>
          </div>

          {/* Bottom Progress Bar & Partner Logos */}
          <div className="w-full max-w-xl flex flex-col items-center gap-6">
            {/* Progress Track */}
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden relative border border-slate-700/50">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.8)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>

            {/* Partner Brand Logos Footer */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-6 opacity-60 hover:opacity-100 transition-opacity"
            >
              <img src={mamshaLogo} alt="Mamsha" className="h-5 sm:h-6 w-auto object-contain" />
              <div className="h-3 w-px bg-slate-700" />
              <img src={abshirLogo} alt="Abshir" className="h-5 sm:h-6 w-auto object-contain" />
              <div className="h-3 w-px bg-slate-700" />
              <img src={enkuImg} alt="Enku" className="h-5 w-5 object-cover rounded-full border border-amber-500/40" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
