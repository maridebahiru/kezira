import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Film,
  Sparkles,
  Compass,
  RotateCcw,
  Zap,
  Radio,
  X
} from 'lucide-react';
import { eventConfig, ConcertTrailerChapter } from '../config/event';
import { AudioVisualizerBars } from './AudioVisualizerBars';

export const ConcertTrailerSection: React.FC = () => {
  const { trailer } = eventConfig;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(trailer.durationSec || 165);
  const [activeChapter, setActiveChapter] = useState<ConcertTrailerChapter | null>(null);
  const [isTheaterOpen, setIsTheaterOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const currentVideo = trailer.videoOptions?.[selectedVideoIndex] || {
    id: 'default',
    title: trailer.title,
    label: 'AFTERMOVIE',
    src: trailer.videoUrl,
  };

  const handleSelectVideo = (index: number) => {
    setSelectedVideoIndex(index);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
    if (isPlaying) {
      setTimeout(() => {
        videoRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
      }, 100);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    setHasInteracted(true);
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const targetTime = Number(e.target.value);
    videoRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const handleChapterClick = (chapter: ConcertTrailerChapter) => {
    if (!videoRef.current) return;
    setActiveChapter(chapter);
    videoRef.current.currentTime = chapter.timeSec;
    setCurrentTime(chapter.timeSec);
    if (!isPlaying) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section
      id="trailer"
      className="relative py-28 md:py-36 bg-[#08080E] text-white overflow-hidden select-none border-t border-amber-500/20"
    >
      {/* Dynamic Ambient Background Light Blobs */}
      <div className="absolute top-1/4 -left-32 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-[550px] h-[550px] bg-orange-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Decorative Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header: Punchy & Kinetic */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 mb-4 shadow-[0_0_25px_rgba(245,158,11,0.25)]"
            >
              <Film className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="text-3xs font-mono tracking-[0.25em] text-amber-300 uppercase font-bold">
                {trailer.edition}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight"
            >
              CONCERT <span className="gold-text-gradient">AFTERMOVIE</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 text-xs font-mono text-slate-400"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-ping" />
              <span className="text-slate-300">DIRE DAWA ARCHIVE</span>
            </div>
            <span className="hidden sm:inline text-amber-500/40">•</span>
            <span className="text-amber-400/90 font-bold hidden sm:inline">4K 60FPS</span>
          </motion.div>
        </div>

        {/* Local Video Asset Switcher Tabs */}
        {trailer.videoOptions && trailer.videoOptions.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            <span className="text-3xs font-mono tracking-widest text-amber-400/80 uppercase font-bold">
              AFTERMOVIE EDITIONS:
            </span>
            <div className="flex items-center gap-2.5">
              {trailer.videoOptions.map((opt, idx) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectVideo(idx)}
                  className={`px-4 py-2 rounded-xl text-3xs font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer border ${
                    selectedVideoIndex === idx
                      ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:border-amber-400/30'
                  }`}
                >
                  {opt.title}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Cinematic Video Stage Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden glass-panel-gold border border-amber-500/30 p-2 sm:p-3.5 shadow-[0_20px_70px_rgba(0,0,0,0.8)] group mb-12"
        >
          {/* Pulsing Ambient Glow Behind Screen */}
          <div
            className={`absolute inset-0 bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-amber-500/20 rounded-3xl blur-2xl transition-opacity duration-1000 pointer-events-none ${
              isPlaying ? 'opacity-100 scale-105' : 'opacity-40'
            }`}
          />

          {/* Video Player Box */}
          <div
            onClick={handleTogglePlay}
            className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden cursor-pointer bg-black"
          >
            <video
              ref={videoRef}
              src={currentVideo.src}
              poster={trailer.posterUrl}
              muted={isMuted}
              loop
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="w-full h-full object-cover filter contrast-105 brightness-105"
            />

            {/* Subtle Film Grain and Vignette */}
            <div className="vignette-overlay absolute inset-0 pointer-events-none" />

            {/* Top Screen Overlays: Live Badge & Audio Visualizer */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between pointer-events-none z-20">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-3xs font-mono tracking-widest uppercase text-white font-bold">
                  {isPlaying ? 'PLAYING PREVIOUS EDITION' : 'CLICK TO WATCH TRAILER'}
                </span>
              </div>

              <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md">
                <AudioVisualizerBars isPlaying={isPlaying} barCount={5} size="sm" />
                <span className="text-3xs font-mono tracking-widest text-amber-300 font-bold hidden sm:inline">
                  {isMuted ? 'AUDIO MUTED' : 'DOLBY ATMOS'}
                </span>
              </div>
            </div>

            {/* Big Central Play Button Overlay (when paused) */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] z-10"
                >
                  <div className="relative group/play flex items-center justify-center">
                    {/* Animated Pulsing Halo */}
                    <div className="absolute -inset-4 rounded-full bg-amber-500/30 blur-xl animate-ping" />
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.6)] text-black transition-transform duration-300 group-hover/play:scale-110">
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-black translate-x-0.5" />
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-mono tracking-[0.25em] text-amber-200 mt-5 uppercase font-bold drop-shadow-md">
                    PLAY 2025 AFTERMOVIE
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Controls Bar */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-20 flex flex-col gap-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            >
              {/* Progress Scrubber Bar */}
              <div className="relative w-full h-2 rounded-full bg-white/20 overflow-hidden cursor-pointer group/scrub">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-full transition-all duration-100 relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md scale-0 group-hover/scrub:scale-100 transition-transform" />
                </div>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Video Seek Bar"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>

              {/* Controls & Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <button
                    onClick={handleTogglePlay}
                    aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
                    className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />}
                  </button>

                  <button
                    onClick={handleToggleMute}
                    aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                    className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
                  </button>

                  <div className="text-3xs sm:text-xs font-mono text-slate-300">
                    <span className="text-amber-400 font-bold">{formatTime(currentTime)}</span>
                    <span className="mx-1 text-slate-500">/</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden md:inline text-3xs font-mono tracking-widest text-slate-400 uppercase">
                    PAPA // 10K SOULS
                  </span>
                  <button
                    onClick={() => setIsTheaterOpen(true)}
                    title="Fullscreen Theater Mode"
                    aria-label="Open Fullscreen Theater View"
                    className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Interactive Chapters Grid */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono tracking-widest uppercase text-amber-400 font-bold">
              JUMP TO RECAP MOMENTS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trailer.chapters.map((chapter) => {
              const isActive =
                currentTime >= chapter.timeSec &&
                currentTime < chapter.timeSec + 30;

              return (
                <button
                  key={chapter.id}
                  onClick={() => handleChapterClick(chapter)}
                  className={`text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/20 border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                      : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:border-amber-400/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-3xs font-mono text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/20">
                      {chapter.timestamp}
                    </span>
                    <Play className="w-3 h-3 text-slate-400 fill-slate-400" />
                  </div>
                  <h4 className="text-sm font-serif font-bold text-white mb-1">
                    {chapter.title}
                  </h4>
                  <p className="text-2xs text-slate-400 font-light line-clamp-2">
                    {chapter.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>


      </div>

      {/* Fullscreen Theater Modal */}
      <AnimatePresence>
        {isTheaterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-2xl"
          >
            <button
              onClick={() => setIsTheaterOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative max-w-6xl w-full aspect-video rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(245,158,11,0.4)] border border-amber-500/40">
              <video
                src={currentVideo.src}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ConcertTrailerSection;
