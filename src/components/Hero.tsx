import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HeroVideoPlayer } from './HeroVideoPlayer';
import { HeroContent } from './HeroContent';
import { HeroVideoNavigation } from './HeroVideoNavigation';
import { eventConfig } from '../config/event';

import papaGardenLogo from '../assets/papa.png';

interface HeroProps {
  onOpenTickets: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTickets }) => {
  const heroRef = useRef<HTMLElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const currentVideo = eventConfig.heroVideos[currentVideoIndex];
  const videoDurationSec = currentVideo.duration || 10;

  // Scroll driven camera zoom pull-back parallax
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Pull-back scale & depth fade
  const cameraScale = useTransform(scrollYProgress, [0, 1], [1.08, 0.92]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const darkOverlayOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.75]);

  // Track window resize to toggle desktop parallax mouse effects
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track mouse movement for subtle desktop parallax (throttled with rAF)
  useEffect(() => {
    if (isMobile) return;

    let rafId: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 2;
        const y = (e.clientY / innerHeight - 0.5) * 2;
        setMousePos({ x, y });
        rafId = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  // Video progress timer & auto switch
  useEffect(() => {
    setProgress(0);
    const intervalMs = 100;
    const increment = (intervalMs / (videoDurationSec * 1000)) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentVideoIndex((idx) => (idx + 1) % eventConfig.heroVideos.length);
          return 0;
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [currentVideoIndex, videoDurationSec]);

  const handleSelectVideo = (index: number) => {
    setCurrentVideoIndex(index);
    setProgress(0);
  };

  const handleExploreClick = () => {
    const aboutElem = document.querySelector('#about');
    if (aboutElem) {
      aboutElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      style={{ position: 'relative' }}
      className="relative w-full min-h-[100dvh] md:h-screen md:min-h-[700px] md:max-h-[1200px] flex flex-col justify-between pt-24 pb-8 md:pt-0 md:pb-10"
    >
      {/* 1. Camera Zoom Video Stage */}
      <motion.div style={{ scale: isMobile ? 1 : cameraScale }} className="absolute inset-0 w-full h-full transform-gpu">
        <HeroVideoPlayer
          currentVideo={currentVideo}
          mousePos={mousePos}
          isMobile={isMobile}
        />
        {/* Dynamic dark overlay on scroll */}
        <motion.div
          style={{ opacity: darkOverlayOpacity }}
          className="absolute inset-0 bg-black pointer-events-none z-15"
        />
      </motion.div>

      {/* 2. Main Center Content Typography with Depth Parallax */}
      <motion.div
        style={{ y: isMobile ? 0 : contentY, opacity: contentOpacity }}
        className="relative z-20 flex-1 flex items-center justify-center pt-8 md:pt-28 pb-8 md:pb-16 transform-gpu"
      >
        <HeroContent
          currentVideo={currentVideo}
          eventName={eventConfig.eventName}
          eventEdition={eventConfig.eventEdition}
          date={eventConfig.date}
          location={eventConfig.location}
          onOpenTickets={onOpenTickets}
          onExplore={handleExploreClick}
          mousePos={mousePos}
          isMobile={isMobile}
        />
      </motion.div>

      {/* 3. Hero Bottom Bar (Navigation) */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-8 pb-6 md:pb-8 flex items-center justify-center md:justify-start"
      >
        {/* Chapter Video Progress Navigation */}
        <HeroVideoNavigation
          videos={eventConfig.heroVideos}
          currentIndex={currentVideoIndex}
          progress={progress}
          onSelectVideo={handleSelectVideo}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
