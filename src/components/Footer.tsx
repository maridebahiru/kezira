import React, { useState } from 'react';
import { Instagram, Youtube, Twitter, Music, Send, Check } from 'lucide-react';
import { eventConfig } from '../config/event';
import logoImg from '../assets/logo.png';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-slate-200">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col items-start">
            <a
              href="#"
              className="group inline-flex items-center mb-6 transition-transform duration-300 hover:scale-105"
            >
              <img
                src={logoImg}
                alt="KEZIRA Logo"
                className="h-16 sm:h-22 md:h-28 w-auto object-contain"
              />
            </a>
            <p className="text-xs sm:text-sm text-slate-600 font-light max-w-sm leading-relaxed mb-6">
              A synthesis of high sound design, luxury art installations, and elite hospitality set at Mider Babur, Dire Dawa, Ethiopia.
            </p>
            <div className="text-2xs font-mono text-amber-800 font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-400/30">
              OCTOBER 3, 2026 • MIDER BABUR, DIRE DAWA
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-xs font-mono tracking-widest text-slate-900 font-bold uppercase mb-2">
              NAVIGATION
            </span>
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

          {/* Exclusive Newsletter */}
          <div className="md:col-span-4 flex flex-col">
            <span className="text-xs font-mono tracking-widest text-slate-900 font-bold uppercase mb-2">
              EXCLUSIVE ANNOUNCEMENTS
            </span>
            <p className="text-xs text-slate-600 font-light mb-4">
              Subscribe for secret lineup releases and VIP cabana access alerts.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your VIP email..."
                className="w-full py-3 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:border-amber-500 transition-colors shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-1.5 py-2 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-mono transition-colors shadow-md"
              >
                {subscribed ? <Check className="w-4 h-4 text-black" /> : 'JOIN'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Socials & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-3xs font-mono tracking-widest text-slate-500">
          <div>
            © 2026 KEZIRA MEDIA. ALL RIGHTS RESERVED.
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
