import React from 'react';
import { eventConfig, VendorLogo } from '../config/event';

interface VendorLogoMarqueeProps {
  vendors?: VendorLogo[];
}

export const VendorLogoMarquee: React.FC<VendorLogoMarqueeProps> = ({
  vendors = eventConfig.vendors,
}) => {
  // Duplicate list multiple times for seamless infinite scroll track
  const marqueeList = [...vendors, ...vendors, ...vendors, ...vendors];

  return (
    <section className="relative py-16 bg-[#F4F1EA] border-t border-b border-slate-200 overflow-hidden select-none">
      {/* Side Fade Gradients */}
      <div className="absolute top-0 bottom-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#F4F1EA] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#F4F1EA] to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
        <span className="text-3xs font-mono tracking-[0.3em] text-slate-500 uppercase font-bold">
          OFFICIAL LUXURY PARTNERS & VENDORS
        </span>
      </div>

      {/* Infinite Marquee Track */}
      <div className="flex overflow-hidden group">
        <div className="flex items-center gap-10 sm:gap-16 animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap py-2">
          {marqueeList.map((vendor, index) => (
            <div
              key={`${vendor.id}-${index}`}
              className="flex items-center justify-center px-6 py-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-500/60 hover:shadow-xl transition-all duration-300 group/card shadow-md shrink-0"
            >
              {vendor.logoImage ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-50 p-2 flex items-center justify-center border border-amber-500/20 shrink-0">
                  <img
                    src={vendor.logoImage}
                    alt={vendor.name}
                    className="w-full h-full object-contain filter group-hover/card:scale-110 transition-all duration-300"
                  />
                </div>
              ) : (
                <span className="text-3xl sm:text-4xl opacity-80 group-hover/card:opacity-100 transition-all">
                  {vendor.symbol}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Inline Marquee Keyframe Styles */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default VendorLogoMarquee;
