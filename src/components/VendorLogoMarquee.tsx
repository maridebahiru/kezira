import React from 'react';
import { eventConfig, VendorLogo } from '../config/event';

interface VendorLogoMarqueeProps {
  organizers?: VendorLogo[];
  vendors?: VendorLogo[];
}

export const VendorLogoMarquee: React.FC<VendorLogoMarqueeProps> = ({
  organizers = eventConfig.organizers,
  vendors = eventConfig.vendors,
}) => {
  // Duplicate vendor list for smooth infinite scroll marquee
  const marqueeList = [...vendors, ...vendors, ...vendors, ...vendors];

  return (
    <section className="relative py-20 bg-[#F4F1EA] border-t border-b border-slate-200 overflow-hidden select-none">
      {/* Side Fade Gradients */}
      <div className="absolute top-0 bottom-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#F4F1EA] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#F4F1EA] to-transparent z-10 pointer-events-none" />

      {/* Part 1: Main Organizers & Production Partners */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-14">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 mb-3 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-3xs font-mono tracking-[0.25em] text-amber-900 uppercase font-extrabold">
              PRESENTED BY • OFFICIAL ORGANIZERS & PARTNERS
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900">
            THE ARCHITECTS OF MAMSHA FEST
          </h2>
        </div>

        {/* Featured Organizers & Partners Grid */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {organizers.map((partner) => {
            const isMainOrganizer = partner.category === 'MAIN ORGANIZER';
            return (
              <div
                key={partner.id}
                className={`flex items-center gap-3.5 sm:gap-4 transition-all duration-300 ${
                  isMainOrganizer
                    ? 'px-6 py-4 sm:px-8 sm:py-5 rounded-2xl bg-gradient-to-r from-amber-50/70 via-white to-amber-50/40 border-2 border-amber-500 shadow-[0_8px_30px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/40 hover:border-amber-600 hover:shadow-[0_12px_36px_rgba(245,158,11,0.35)]'
                    : 'px-5 py-3 sm:px-6 sm:py-4 rounded-2xl bg-white/95 border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md opacity-90 hover:opacity-100'
                }`}
              >
                {partner.logoImage && (
                  <div
                    className={`${
                      isMainOrganizer
                        ? 'w-18 h-18 sm:w-22 sm:h-22 rounded-2xl p-2 bg-white border border-amber-500/30 shadow-inner'
                        : 'w-12 h-12 sm:w-14 sm:h-14 rounded-xl p-1.5 bg-slate-50 border border-slate-200'
                    } overflow-hidden flex items-center justify-center shrink-0`}
                  >
                    <img
                      src={partner.logoImage}
                      alt={partner.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-mono font-bold tracking-wider ${
                        isMainOrganizer
                          ? 'text-sm sm:text-base font-extrabold text-slate-950'
                          : 'text-xs sm:text-sm text-slate-700'
                      }`}
                    >
                      {partner.name}
                    </span>
                    <span className="text-amber-600 text-xs sm:text-sm">{partner.symbol}</span>
                  </div>
                  {isMainOrganizer ? (
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono uppercase font-black tracking-wider text-amber-800 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-400/40 mt-1 w-fit">
                      👑 MAIN ORGANIZER
                    </span>
                  ) : (
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase font-semibold tracking-tight text-slate-500 mt-0.5">
                      {partner.category}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 2: Official Festival Vendors (Food, Drinks, Gifts - v1, v2, v3, v4) */}
      <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
        <span className="text-3xs font-mono tracking-[0.3em] text-slate-500 uppercase font-bold">
          OFFICIAL FESTIVAL VENDORS • FOOD, BEVERAGE & RETAIL
        </span>
      </div>

      {/* Infinite Marquee Track of Festival Vendors */}
      <div className="flex overflow-hidden group">
        <div className="flex items-center gap-6 sm:gap-10 animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap py-2">
          {marqueeList.map((vendor, index) => (
            <div
              key={`${vendor.id}-${index}`}
              className="flex items-center gap-3.5 px-6 py-4 rounded-2xl bg-white border border-slate-200 shadow-md hover:border-amber-500 hover:shadow-xl transition-all duration-300 group/card shrink-0"
            >
              {vendor.logoImage ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white p-2 flex items-center justify-center border border-amber-500/20 shrink-0 shadow-xs">
                  <img
                    src={vendor.logoImage}
                    alt={vendor.name}
                    className="w-full h-full object-contain filter group-hover/card:scale-110 transition-all duration-300"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-50 p-2 flex flex-col items-center justify-center border border-slate-200 shrink-0">
                  <span className="text-2xl sm:text-3xl">{vendor.symbol}</span>
                </div>
              )}
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 tracking-wider">
                    {vendor.name}
                  </span>
                  <span className="text-amber-500 text-xs">{vendor.symbol}</span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono uppercase font-bold text-amber-700 tracking-tight mt-0.5">
                  {vendor.category}
                </span>
              </div>
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
          animation: marquee 24s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default VendorLogoMarquee;
