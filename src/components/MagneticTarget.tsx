/**
 * MagneticTarget.tsx — Tactile Magnetic CTA Wrapper
 * React 19 island with Framer Motion spring physics.
 *
 * Requirements:
 * - Calculates distance from mouse pointer to component center.
 * - Within a specified radius (default 40px beyond bounds), pulls toward cursor.
 * - Spring-based interpolation for natural tactile weight.
 * - Automatically disabled on touch screens and when prefers-reduced-motion is true.
 */

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

interface MagneticTargetProps {
  children: React.ReactNode;
  className?: string;
  radius?: number;       // Activation radius beyond center/bounds (default 40px)
  strength?: number;     // Multiplier for translation pull (default 0.35)
  maxOffset?: number;    // Clamping maximum translation (default 10px)
  as?: keyof React.JSX.IntrinsicElements;
  disabled?: boolean;
}

export default function MagneticTarget({
  children,
  className = '',
  radius = 40,
  strength = 0.35,
  maxOffset = 10,
  disabled = false,
}: MagneticTargetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Tactile spring config
  const springConfig = { damping: 16, stiffness: 220, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || shouldReduceMotion) return;
    if (e.pointerType === 'touch') return;

    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const distance = Math.hypot(deltaX, deltaY);

    const activeRadius = Math.max(rect.width / 2, rect.height / 2) + radius;

    if (distance <= activeRadius) {
      // Pull toward cursor, clamped to maxOffset
      const rawPullX = deltaX * strength;
      const rawPullY = deltaY * strength;
      const clampedX = Math.max(-maxOffset, Math.min(maxOffset, rawPullX));
      const clampedY = Math.max(-maxOffset, Math.min(maxOffset, rawPullY));
      x.set(clampedX);
      y.set(clampedY);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`magnetic-target ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        x: springX,
        y: springY,
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {children}
    </motion.div>
  );
}
