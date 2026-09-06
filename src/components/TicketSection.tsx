import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { eventConfig, TicketTier } from '../config/event';
import { TicketTiltCard } from './TicketTiltCard';
import { TextReveal } from './TextReveal';

interface TicketSectionProps {
  onSelectTier: (tier: TicketTier) => void;
}

export const TicketSection: React.FC<TicketSectionProps> = ({ onSelectTier }) => {
  return (
    <section id="tickets" className="relative py-28 md:py-36 bg-[#FAF8F5] border-t border-slate-200 overflow-x-clip text-slate-900">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/50 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-3xs font-mono tracking-[0.25em] text-amber-800 uppercase font-bold">
              RESERVE YOUR PASS
            </span>
          </div>
          <TextReveal
            text="SELECT YOUR EXPERIENCE"
            as="h2"
            className="text-3xl sm:text-5xl lg:text-6xl font-serif font-semibold text-slate-900"
          />
          <p className="text-sm sm:text-base text-slate-600 max-w-xl font-light mt-4 leading-relaxed">
            Tiered passes designed for optimal immersion, elevated hospitality, and unforgettable memories.
          </p>
        </div>

        {/* 3D Tilt Ticket Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          {eventConfig.ticketTypes.map((tier, idx) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              className="flex"
            >
              <TicketTiltCard tier={tier} onSelect={onSelectTier} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TicketSection;
