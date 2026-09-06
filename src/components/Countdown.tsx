import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownProps {
  targetDate?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Countdown: React.FC<CountdownProps> = ({
  targetDate = '2026-10-03T09:00:00Z',
}) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 28, hours: 8, minutes: 42, seconds: 15 };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  return (
    <div className="relative z-20 mt-4 sm:mt-8 md:mt-10 mb-6 sm:mb-8 max-w-5xl mx-auto px-3 sm:px-4">
      <div className="glass-panel-gold rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-2xl">
        <div className="flex items-center gap-2.5 sm:gap-3 text-center md:text-left">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
          <div>
            <span className="text-3xs font-mono tracking-[0.2em] sm:tracking-[0.25em] text-black uppercase block font-extrabold">
              COUNTDOWN TO OPENING
            </span>
            <span className="text-xs sm:text-base font-serif text-black font-extrabold tracking-wide">
              OCTOBER 3, 2026 — MIDER BABUR, DIRE DAWA
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 w-full md:w-auto">
          {units.map((unit) => {
            const formattedVal = String(unit.value).padStart(2, '0');
            return (
              <div
                key={unit.label}
                className="flex flex-col items-center justify-center py-2.5 px-1.5 sm:p-4 rounded-xl bg-white/95 border border-amber-400/50 shadow-md min-w-0 sm:min-w-[85px]"
              >
                <motion.span
                  key={formattedVal}
                  initial={{ opacity: 0.4, scale: 0.9, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl sm:text-3xl md:text-4xl font-mono font-black text-black tracking-tight sm:tracking-wider leading-none"
                >
                  {formattedVal}
                </motion.span>
                <span className="text-[9px] sm:text-xs font-mono tracking-wider sm:tracking-widest text-slate-800 mt-1 sm:mt-1.5 uppercase font-bold whitespace-nowrap select-none">
                  {unit.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
