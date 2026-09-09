import React from 'react';
import { eventConfig } from '../config/event';
import { ArtistsShowcase, Artist } from './ui/artists-showcase';

export const ArtistsSection: React.FC = () => {
  // 3 premier acts: DJ KAL (Left), THE ARTISTS (Middle), DJ LUNA (Right)
  const artists: Artist[] = eventConfig.artists.map((a) => ({
    name: a.name,
    imageSrc: a.image,
    imageAlt: `Portrait of ${a.name}`,
  }));

  return (
    <div id="artists" className="relative border-t border-slate-200/80 bg-[#FAF8F5]">
      {/* Minimalist Lineup Header */}
      <div className="pt-14 sm:pt-16 pb-2 text-center">
        <span className="text-3xs font-mono tracking-[0.3em] uppercase text-slate-500 font-bold block mb-1">
          LINEUP
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
          THE ARTISTS
        </h2>
      </div>

      {/* Main Single Circle Showcase with 5 Artists Standing in Front */}
      <ArtistsShowcase
        artists={artists}
        crop="cutout"
        className="py-8 md:py-14"
      />
    </div>
  );
};

export default ArtistsSection;
