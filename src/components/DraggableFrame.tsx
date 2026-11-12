/**
 * DraggableFrame.tsx — 1-Bit OS Window Draggable Container
 * React 19 island with Framer Motion physics & z-index management.
 *
 * Requirements:
 * - Uses Framer Motion drag physics with dragMomentum={false} and dragElastic={0.08}.
 * - Only initiates drag from the window titlebar (.desktop-window__titlebar, .u-window-titlebar).
 * - Click/drag brings clicked window to the front (incrementing global z-index).
 * - Constrained to viewport boundaries.
 * - Respects prefers-reduced-motion.
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, useDragControls, useReducedMotion } from 'framer-motion';

// Global shared z-index counter for desktop windows
let sharedZIndex = 20;

interface DraggableFrameProps {
  children: React.ReactNode;
  className?: string;
  defaultZIndex?: number;
}

export default function DraggableFrame({
  children,
  className = '',
  defaultZIndex = 10,
}: DraggableFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const shouldReduceMotion = useReducedMotion();
  const [zIndex, setZIndex] = useState(defaultZIndex);
  const [constraints, setConstraints] = useState<{
    top: number;
    left: number;
    right: number;
    bottom: number;
  } | false>(false);

  // Bring this window to the top
  const bringToFront = () => {
    sharedZIndex += 1;
    setZIndex(sharedZIndex);
  };

  // Recalculate drag constraints relative to current viewport position
  const updateConstraints = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Allow dragging within viewport, keeping below top systembar (approx 36px)
    setConstraints({
      top: -rect.top + 38,
      left: -rect.left + 12,
      right: window.innerWidth - rect.right - 12,
      bottom: window.innerHeight - rect.bottom - 12,
    });
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el || shouldReduceMotion) return;

    // Locate the titlebar handle inside slotted Astro markup
    const titlebar = el.querySelector<HTMLElement>(
      '.desktop-window__titlebar, .u-window-titlebar, .cs-card__titlebar'
    );
    if (!titlebar) return;

    titlebar.style.cursor = 'grab';
    titlebar.style.userSelect = 'none';
    (titlebar.style as any).webkitUserSelect = 'none';

    const handlePointerDown = (e: PointerEvent) => {
      // Do not initiate drag if clicking interactive buttons or links inside the titlebar
      const target = e.target as HTMLElement;
      if (
        target.closest(
          'button, a, input, select, textarea, .desktop-window__btn, .cs-card__btn'
        )
      ) {
        return;
      }

      bringToFront();
      updateConstraints();
      titlebar.style.cursor = 'grabbing';
      dragControls.start(e);
    };

    const handlePointerUp = () => {
      titlebar.style.cursor = 'grab';
    };

    titlebar.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      titlebar.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragControls, shouldReduceMotion]);

  return (
    <motion.div
      ref={containerRef}
      className={`draggable-frame ${className}`}
      drag={!shouldReduceMotion}
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0.08}
      dragConstraints={constraints || undefined}
      onMouseDown={bringToFront}
      onTouchStart={bringToFront}
      style={{
        zIndex,
        position: 'relative',
        touchAction: 'none',
      }}
    >
      {children}
    </motion.div>
  );
}
