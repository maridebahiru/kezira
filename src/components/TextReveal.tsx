import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  delay?: number;
  staggerChildren?: number;
  once?: boolean;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = '',
  as: Component = 'h2',
  delay = 0,
  staggerChildren = 0.04,
  once = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once, margin: '-10% 0px' });

  // Split sentence into words
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      y: '110%',
      opacity: 0,
      rotateX: -45,
    },
    visible: {
      y: '0%',
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1], // Luxury cinematic cubic-bezier
      },
    },
  };

  return (
    <Component ref={containerRef as never} className={`relative inline-flex flex-wrap gap-x-[0.25em] gap-y-[0.1em] ${className}`}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="relative inline-flex flex-wrap gap-x-[0.25em] gap-y-[0.1em] perspective-500"
      >
        {words.map((word, index) => (
          <span key={`${word}-${index}`} className="relative inline-block overflow-hidden py-1 -my-1">
            <motion.span
              variants={wordVariants}
              className="inline-block transform-gpu origin-bottom text-inherit"
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Component>
  );
};

export default TextReveal;
