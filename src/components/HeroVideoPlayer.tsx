import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroVideoConfig } from '../config/event';

interface HeroVideoPlayerProps {
  currentVideo: HeroVideoConfig;
  mousePos: { x: number; y: number };
  isMobile: boolean;
}

export const HeroVideoPlayer: React.FC<HeroVideoPlayerProps> = ({
  currentVideo,
  mousePos,
  isMobile,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setVideoError(false);
    setIsLoaded(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Fallback for autoplay policies
      });
    }
  }, [currentVideo.id]);

  // Motion variants based on video transition type
  const getVariants = () => {
    switch (currentVideo.transitionType) {
      case 'sweep':
        return {
          initial: { opacity: 0, scale: 1.1, clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' },
          animate: { opacity: 1, scale: 1.05, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
          exit: { opacity: 0, scale: 1, clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' },
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 1.25, filter: 'blur(10px)' },
          animate: { opacity: 1, scale: 1.05, filter: 'blur(0px)' },
          exit: { opacity: 0, scale: 0.95, filter: 'blur(8px)' },
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0, scale: 1.08 },
          animate: { opacity: 1, scale: 1.04 },
          exit: { opacity: 0, scale: 1.0 },
        };
    }
  };

  const variants = getVariants();

  // Subtle mouse movement transform on desktop
  const parallaxX = isMobile ? 0 : mousePos.x * 12;
  const parallaxY = isMobile ? 0 : mousePos.y * 12;

  return (
    <div className="absolute inset-0 overflow-hidden bg-black select-none pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVideo.id}
          initial={variants.initial}
          animate={{
            ...variants.animate,
            x: parallaxX,
            y: parallaxY,
          }}
          exit={variants.exit}
          transition={{
            duration: 1.4,
            ease: [0.25, 1, 0.5, 1],
          }}
          className="relative w-full h-full"
        >
          {/* Continuous slow zoom animation */}
          <motion.div
            animate={{
              scale: [1.02, 1.07, 1.02],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-full h-full"
          >
            {!videoError ? (
              <video
                ref={videoRef}
                src={currentVideo.src}
                poster={currentVideo.poster}
                autoPlay
                muted
                loop
                playsInline
                onLoadedData={() => setIsLoaded(true)}
                onError={() => setVideoError(true)}
                className="w-full h-full object-cover transition-opacity duration-700"
                style={{
                  objectPosition: currentVideo.objectPosition || 'center center',
                  opacity: isLoaded ? 0.85 : 0.4,
                }}
              />
            ) : null}

            {/* Poster / Fallback Image if video errors or loading */}
            {(videoError || !isLoaded) && (
              <img
                src={currentVideo.poster}
                alt={currentVideo.title}
                className="absolute inset-0 w-full h-full object-cover opacity-75 brightness-75"
                style={{
                  objectPosition: currentVideo.objectPosition || 'center center',
                }}
              />
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Cinematic Layering & Overlays */}
      {/* 1. Vignette Overlay */}
      <div className="absolute inset-0 vignette-overlay z-10" />

      {/* 2. Top Navigation Shadow Gradient */}
      <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10" />

      {/* 3. Bottom Text Readability Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#070709] via-[#070709]/80 to-transparent z-10" />

      {/* 4. Film Grain Overlay */}
      <div className="film-grain-canvas z-10" />

      {/* 5. Luxury Soft Lens Light Flare */}
      <motion.div
        animate={{
          opacity: [0.15, 0.35, 0.15],
          scale: [1, 1.15, 1],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-10"
      />
    </div>
  );
};
