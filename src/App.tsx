import React, { useState, useEffect } from 'react';
import { SmoothScroll } from './components/SmoothScroll';
import { GlowCursor } from './components/GlowCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Countdown } from './components/Countdown';
import { AboutSection } from './components/AboutSection';
import { HighlightsSection } from './components/HighlightsSection';
import { VendorLogoMarquee } from './components/VendorLogoMarquee';
import { ScheduleSection } from './components/ScheduleSection';
import { VenueSection } from './components/VenueSection';
import { TicketSection } from './components/TicketSection';
import { HorizontalScrollGallery } from './components/HorizontalScrollGallery';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { TicketModal } from './components/TicketModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Preloader } from './components/Preloader';
import { TicketTier } from './config/event';

export function App() {
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null);

  // Secret Admin Portal Shortcuts: URL hash '#admin' or Ctrl + Shift + A
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash.toLowerCase() === '#admin') {
        setAdminModalOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setAdminModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleOpenTickets = () => {
    setSelectedTier(null);
    setTicketModalOpen(true);
  };

  const handleSelectTier = (tier: TicketTier) => {
    setSelectedTier(tier);
    setTicketModalOpen(true);
  };

  return (
    <SmoothScroll>
      <Preloader />
      <GlowCursor
        color="#991B1B"
        secondaryColor="#D97706"
        trailLength={30}
        trailWidth={10}
        trailTaper={0.8}
        followSpeed={0.2}
        glowIntensity={2.6}
        glowSpread={1.5}
        hotspot={0.15}
        brightness={1.05}
        opacity={1.0}
        pulseSpeed={1.2}
        noiseStrength={0.02}
        idleFade
        idleTimeout={800}
        fadeDuration={800}
        blendMode="normal"
      />
      <div className="relative min-h-screen bg-[#FAF8F5] text-slate-900 selection:bg-amber-500/30 selection:text-amber-900">
        {/* Sticky Glassmorphic Navbar */}
        <Navbar onOpenTickets={handleOpenTickets} onOpenAdmin={() => setAdminModalOpen(true)} />

        {/* 100vh Multi-Video Hero Opening Sequence with Camera Zoom Parallax */}
        <main>
          <Hero onOpenTickets={handleOpenTickets} />

          {/* Floating Countdown Bar */}
          <Countdown />

          {/* About Festival Section */}
          <AboutSection />

          {/* Interactive Highlights */}
          <HighlightsSection />

          {/* Infinite Vendor / Sponsor Marquee */}
          <VendorLogoMarquee />

          {/* Schedule & Programme Timeline */}
          <ScheduleSection />

          {/* Venue & Location */}
          <VenueSection />

          {/* Ticketing & Passes with 3D Tilt Cards */}
          <TicketSection onSelectTier={handleSelectTier} />

          {/* Sticky Pinned Horizontal Scroll Visual Gallery */}
          <HorizontalScrollGallery />

          {/* Final Call To Action */}
          <FinalCTA onOpenTickets={handleOpenTickets} />
        </main>

        {/* Luxury Footer */}
        <Footer onOpenAdmin={() => setAdminModalOpen(true)} />

        {/* Ticket Reservation & Stub Preview Modal */}
        <TicketModal
          isOpen={ticketModalOpen}
          onClose={() => setTicketModalOpen(false)}
          initialTier={selectedTier}
        />

        {/* Admin Portal Dashboard Modal */}
        <AdminDashboard
          isOpen={adminModalOpen}
          onClose={() => setAdminModalOpen(false)}
        />
      </div>
    </SmoothScroll>
  );
}

export default App;
