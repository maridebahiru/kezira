import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { TicketTier } from '../config/event';

interface TicketTiltCardProps {
  tier: TicketTier;
  onSelect: (tier: TicketTier) => void;
}

export const TicketTiltCard: React.FC<TicketTiltCardProps> = ({ tier, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [canTilt, setCanTilt] = useState(false);

  // Color theme styling variants
  const getThemeStyles = () => {
    switch (tier.colorTheme) {
      case 'diamond':
        return {
          border: 'border-cyan-500/40 hover:border-cyan-500/70',
          badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-300 font-bold',
          button: 'bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 text-white hover:brightness-110 shadow-cyan-500/25',
          glow: 'bg-cyan-500/15',
          glareColor: 'rgba(6, 182, 212, 0.25)',
        };
      case 'gold':
        return {
          border: 'border-amber-500/60 hover:border-amber-500 shadow-amber-500/20',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-400 font-bold',
          button: 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black hover:brightness-110 shadow-amber-500/35',
          glow: 'bg-amber-500/20',
          glareColor: 'rgba(245, 158, 11, 0.3)',
        };
      case 'bronze':
      default:
        return {
          border: 'border-amber-700/30 hover:border-amber-600/60',
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
          button: 'bg-gradient-to-r from-amber-600 to-amber-800 text-white hover:brightness-110 shadow-amber-600/20',
          glow: 'bg-amber-600/10',
          glareColor: 'rgba(217, 119, 6, 0.25)',
        };
    }
  };

  const theme = getThemeStyles();

  // Motion values for 3D tilt
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth springs for perspective rotation
  const rotateXSpring = useSpring(useTransform(y, [0, 1], [12, -12]), {
    stiffness: 300,
    damping: 25,
  });
  const rotateYSpring = useSpring(useTransform(x, [0, 1], [-12, 12]), {
    stiffness: 300,
    damping: 25,
  });

  // Dynamic glare coordinates in percentage
  const glareX = useTransform(x, [0, 1], [0, 100]);
  const glareY = useTransform(y, [0, 1], [0, 100]);
  const glareOpacity = useTransform(
    x,
    [0, 0.5, 1],
    [0.15, 0.45, 0.15]
  );

  // Top-level transform for specular glare radial gradient (MUST BE UNCONDITIONAL!)
  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle 350px at ${gx}% ${gy}%, ${theme.glareColor}, transparent 80%)`
  );

  // Check pointer capabilities (guardrail for mobile/touch devices)
  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    setCanTilt(isFinePointer);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setCanTilt(e.matches);
    };

    const mediaQuery = window.matchMedia('(pointer: fine)');
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width;
    const mouseY = (e.clientY - rect.top) / rect.height;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    if (!canTilt) return;
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div className="perspective-1000 w-full h-full flex">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: canTilt ? rotateXSpring : 0,
          rotateY: canTilt ? rotateYSpring : 0,
          transformStyle: 'preserve-3d',
        }}
        className={`relative w-full rounded-3xl glass-panel p-6 sm:p-8 flex flex-col justify-between overflow-hidden transition-all duration-300 border ${theme.border} ${
          tier.featured ? 'scale-[1.02] shadow-2xl glass-panel-gold' : 'shadow-xl'
        }`}
      >
        {/* Specular Glare Reflection Sheen */}
        {canTilt && (
          <motion.div
            style={{
              background: glareBackground,
              opacity: glareOpacity,
            }}
            className="absolute inset-0 pointer-events-none z-20 rounded-3xl transition-opacity duration-300"
          />
        )}

        {/* Ambient Glow Halo */}
        <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl ${theme.glow} pointer-events-none`} />

        {/* Top Header & Badge */}
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-3xs font-mono tracking-widest uppercase border ${theme.badgeBg}`}
            >
              <Sparkles className="w-3 h-3" />
              {tier.badge}
            </span>
            {tier.featured && (
              <span className="px-2.5 py-0.5 rounded-full text-3xs font-mono tracking-widest uppercase bg-amber-500 text-black font-extrabold shadow-sm">
                MOST POPULAR
              </span>
            )}
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-wide mb-1">
            {tier.name}
          </h3>
          <p className="text-xs text-slate-600 font-light mb-6 leading-relaxed">
            {tier.description}
          </p>

          {/* Pricing */}
          <div className="mb-6 pb-6 border-b border-slate-200 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900">
              {tier.priceETB.toLocaleString()}
            </span>
            <span className="text-sm sm:text-base font-mono text-amber-800 font-extrabold uppercase">
              ETB
            </span>
          </div>

          {/* Benefits List */}
          <ul className="space-y-3 mb-8">
            {tier.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-light">
                <div className="p-1 rounded-full bg-amber-500/20 text-amber-800 border border-amber-400/40 shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span className="font-normal">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom CTA Button & Capacity indicator */}
        <div className="relative z-10 mt-auto pt-4">
          <div className="mb-4">
            <div className="flex justify-between items-center text-3xs font-mono text-slate-600 mb-1.5 font-semibold">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                {tier.availability}
              </span>
              <span>{tier.availabilityPercentage}% Reserved</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${tier.availabilityPercentage}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
              />
            </div>
          </div>

          <button
            onClick={() => onSelect(tier)}
            className={`group w-full py-3.5 px-6 rounded-2xl font-mono text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-lg hover:scale-[1.02] ${theme.button}`}
          >
            <span>RESERVE PASS</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TicketTiltCard;
