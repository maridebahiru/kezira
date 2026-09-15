import React from 'react';
import { Instagram, Youtube, Twitter, Music, Send } from 'lucide-react';
import { eventConfig } from '../config/event';
import enkuuLogo from '../assets/mamsha.png';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'Instagram':
        return <Instagram className="w-4 h-4" />;
      case 'Youtube':
        return <Youtube className="w-4 h-4" />;
      case 'Twitter':
        return <Twitter className="w-4 h-4" />;
      case 'Music':
        return <Music className="w-4 h-4" />;
      default:
        return <Send className="w-4 h-4" />;
    }
  };

  return (
    <footer className="relative bg-[#FAF8F5] border-t border-slate-200 pt-20 pb-12 overflow-hidden text-slate-700">
      {/* Background Subtle Radiant Lighting */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-slate-200 items-start justify-between">
          {/* Brand Info & Main Logo */}
          <div className="md:col-span-7 flex flex-col items-start">
            <a
              href="#"
              className="group inline-flex items-center gap-3 mb-6 transition-transform duration-300 hover:scale-105"
            >
              <img
                src={enkuuLogo}
                alt="MAMSHA FEST Logo"
                className="h-14 sm:h-18 md:h-22 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="text-sm font-mono font-bold text-amber-800 tracking-widest uppercase">
                  MAMSHA FEST
                </span>
                <span className="text-2xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
                  MAIN EVENT ORGANIZER
                </span>
              </div>
            </a>
            <p className="text-xs sm:text-sm text-slate-600 font-light max-w-sm leading-relaxed mb-6">
              A synthesis of high sound design, luxury art installations, and elite hospitality set at PAPA, Dire Dawa, Ethiopia.
            </p>
            <div className="text-2xs font-mono text-amber-800 font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-400/30">
              OCTOBER 3, 2026 • PAPA, DIRE DAWA
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-5 flex flex-col gap-3 md:items-end">
            <span className="text-xs font-mono tracking-widest text-slate-900 font-bold uppercase mb-2">
              NAVIGATION
            </span>
            <div className="flex flex-wrap md:flex-col gap-3 md:items-end">
              {['ABOUT', 'EXPERIENCE', 'SCHEDULE', 'VENUE', 'TICKETS', 'GALLERY'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-xs font-mono tracking-wider text-slate-600 hover:text-amber-700 transition-colors font-medium"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Socials & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-3xs font-mono tracking-widest text-slate-500">
          <div>
            © 2026 MAMSHA FEST & PAPA GARDEN. ALL RIGHTS RESERVED.
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {eventConfig.socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white border border-slate-200 hover:bg-amber-500/20 text-slate-600 hover:text-amber-800 transition-colors shadow-sm"
                aria-label={social.name}
              >
                {getSocialIcon(social.icon)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
