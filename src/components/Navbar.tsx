import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Ticket } from 'lucide-react';
import enkuuLogo from '../assets/enkuu.png';
import logoImg from '../assets/logo.png';

interface NavbarProps {
  onOpenTickets: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTickets, onOpenAdmin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'TRAILER', href: '#trailer' },
    { name: 'ABOUT', href: '#about' },
    { name: 'ARTISTS', href: '#artists' },
    { name: 'EXPERIENCE', href: '#highlights' },
    { name: 'SCHEDULE', href: '#schedule' },
    { name: 'VENUE', href: '#venue' },
    { name: 'TICKETS', href: '#tickets' },
    { name: 'GALLERY', href: '#gallery' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-2xl border-b border-slate-200 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
            : 'bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-transparent py-4 md:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Main Logo: ENQU EVENT */}
          <a
            href="#"
            onDoubleClick={onOpenAdmin}
            title="ENQU EVENT - Main Event Presenter (Double-click for Admin)"
            className="group flex items-center gap-3 cursor-pointer transition-transform duration-300 hover:scale-105"
          >
            <img
              src={enkuuLogo}
              alt="ENQU EVENT Main Logo"
              className="h-10 sm:h-14 md:h-16 max-h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden sm:flex flex-col">
              <span className={`text-2xs font-mono tracking-widest uppercase font-bold ${scrolled ? 'text-amber-700' : 'text-amber-400'}`}>
                ENQU EVENT
              </span>
              <span className={`text-[9px] font-mono tracking-wider ${scrolled ? 'text-slate-500' : 'text-slate-300'}`}>
                PRESENTS KEZIRA
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-xs tracking-[0.2em] font-semibold transition-colors duration-300 relative group py-1 ${
                  scrolled ? 'text-slate-800 hover:text-amber-600' : 'text-slate-100 hover:text-amber-300'
                }`}
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-amber-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onOpenTickets}
              className="relative px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-bold text-xs tracking-widest uppercase hover:brightness-110 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>GET TICKET</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2.5 rounded-xl border backdrop-blur-md transition-colors focus:outline-none cursor-pointer ${
              scrolled
                ? 'bg-white/90 border-slate-300 text-slate-900'
                : 'bg-black/60 border-white/20 text-amber-300'
            }`}
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#FAF8F5]/98 backdrop-blur-2xl md:hidden pt-28 px-6 pb-12 flex flex-col justify-between"
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <img src={enkuuLogo} alt="ENQU EVENT Logo" className="h-12 w-auto object-contain" />
                  <div className="flex flex-col">
                    <span className="text-xs font-mono font-bold text-amber-800 tracking-wider">ENQU EVENT</span>
                    <span className="text-3xs font-mono text-slate-500">PRESENTS KEZIRA</span>
                  </div>
                </div>
                <span className="text-2xs font-mono text-amber-700 font-bold">DIRE DAWA</span>
              </div>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-xl font-serif tracking-widest text-slate-900 hover:text-amber-600 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-4 pt-6 border-t border-slate-200">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTickets();
                }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 shadow-md"
              >
                <Ticket className="w-4 h-4" />
                <span>GET YOUR TICKET</span>
              </button>
              <div className="text-center text-3xs font-mono tracking-widest text-slate-500 uppercase">
                OCTOBER 3, 2026 • MIDER BABUR, DIRE DAWA
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
