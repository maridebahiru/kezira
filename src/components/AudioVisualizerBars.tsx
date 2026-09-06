import React from 'react';
import { motion } from 'framer-motion';

interface AudioVisualizerBarsProps {
  isPlaying?: boolean;
  barCount?: number;
  className?: string;
  barColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AudioVisualizerBars: React.FC<AudioVisualizerBarsProps> = ({
  isPlaying = true,
  barCount = 5,
  className = '',
  barColor = 'bg-amber-400',
  size = 'md',
}) => {
  const heights = {
    sm: ['h-1.5', 'h-4', 'h-2.5', 'h-5', 'h-3'],
    md: ['h-2', 'h-6', 'h-4', 'h-8', 'h-3.5'],
    lg: ['h-3', 'h-9', 'h-5', 'h-11', 'h-6'],
  };

  const currentHeights = heights[size];

  return (
    <div className={`flex items-end gap-[3px] h-6 sm:h-7 ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => {
        const defaultHeight = currentHeights[i % currentHeights.length];
        const randomDuration = 0.4 + (i % 4) * 0.15;

        return (
          <motion.span
            key={i}
            animate={
              isPlaying
                ? {
                    height: ['20%', '100%', '40%', '85%', '25%'],
                  }
                : {
                    height: '25%',
                  }
            }
            transition={{
              duration: randomDuration,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: i * 0.08,
            }}
            className={`w-[2.5px] sm:w-[3px] rounded-full ${barColor} origin-bottom block`}
            style={{
              minHeight: '4px',
            }}
          />
        );
      })}
    </div>
  );
};

export default AudioVisualizerBars;
