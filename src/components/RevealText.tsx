/**
 * RevealText.tsx — Swiss Editorial Staggered Line Reveal
 * React 19 island with Framer Motion.
 *
 * Requirements:
 * - Line-by-line reveal from the bottom up using clip-path and y-translation.
 * - Variants: initial={{ y: "100%", opacity: 0 }}, animate={{ y: 0, opacity: 1 }}.
 * - Respects prefers-reduced-motion for instantaneous rendering.
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface RevealTextProps {
  lines: string[];
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div';
  className?: string;
  id?: string;
  delay?: number;
  stagger?: number;
}

export default function RevealText({
  lines,
  as: Component = 'h1',
  className = '',
  id,
  delay = 0.1,
  stagger = 0.14,
}: RevealTextProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : stagger,
        delayChildren: shouldReduceMotion ? 0 : delay,
      },
    },
  };

  const lineVariants = {
    hidden: shouldReduceMotion
      ? { y: '0%', opacity: 1 }
      : { y: '100%', opacity: 0 },
    visible: {
      y: '0%',
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1], // Swiss high-touch editorial ease
      },
    },
  };

  const MotionComponent = motion[Component] || motion.h1;

  return (
    <MotionComponent
      id={id}
      className={`reveal-text-container ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {lines.map((line, idx) => (
        <span
          key={idx}
          className="reveal-line-mask"
          style={{
            display: 'block',
            overflow: 'hidden',
          }}
        >
          <motion.span
            className="reveal-line-inner"
            style={{
              display: 'block',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            }}
            variants={lineVariants}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionComponent>
  );
}
