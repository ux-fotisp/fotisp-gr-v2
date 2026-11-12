/**
 * DraggableFrame.tsx — 1-Bit OS Window Draggable Container
 * React 19 island with Framer Motion physics & z-index management.
 *
 * Requirements:
 * - Uses Framer Motion drag physics with dragMomentum={false} and dragElastic={0.08}.
 * - Only initiates drag from the window titlebar (.desktop-window__titlebar, .u-window-titlebar).
 * - Click/drag brings clicked window to the front (incrementing global z-index).
 * - Constrained to viewport boundaries.
 * - Automatically disabled on mobile viewports (< 768px) and when prefers-reduced-motion is true.
 * - Resets transform (x, y) on mobile resize and listens for 'reset-windows' custom event.
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useDragControls,
  useReducedMotion,
  useMotionValue,
  animate,
} from 'framer-motion';

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
  const [isDesktop, setIsDesktop] = useState(false);
  const [zIndex, setZIndex] = useState(defaultZIndex);

  // Explicit motion values for position tracking and resetting
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const [constraints, setConstraints] = useState<{
    top: number;
    left: number;
    right: number;
    bottom: number;
  } | false>(false);

  // Monitor desktop viewport (>= 768px) and reset if shrinking to mobile or reduced motion
  useEffect(() => {
    const checkDesktop = () => {
      const desktop = typeof window !== 'undefined' && window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (!desktop || shouldReduceMotion) {
        x.set(0);
        y.set(0);
      }
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, [shouldReduceMotion, x, y]);

  // Listen for 'reset-windows' custom event to smoothly animate back to { x: 0, y: 0 }
  useEffect(() => {
    const handleReset = () => {
      animate(x, 0, { type: 'spring', damping: 25, stiffness: 200 });
      animate(y, 0, { type: 'spring', damping: 25, stiffness: 200 });
    };

    window.addEventListener('reset-windows', handleReset);
    return () => window.removeEventListener('reset-windows', handleReset);
  }, [x, y]);

  const canDrag = isDesktop && !shouldReduceMotion;

  // Bring this window to the top
  const bringToFront = () => {
    sharedZIndex += 1;
    setZIndex(sharedZIndex);
  };

  // Recalculate drag constraints relative to current viewport position
  const updateConstraints = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const curX = x.get();
    const curY = y.get();
    const originLeft = rect.left - curX;
    const originTop = rect.top - curY;
    const originRight = rect.right - curX;
    const originBottom = rect.bottom - curY;

    // Allow dragging within viewport, keeping below top systembar (approx 38px)
    setConstraints({
      top: -originTop + 38,
      left: -originLeft + 12,
      right: window.innerWidth - originRight - 12,
      bottom: window.innerHeight - originBottom - 12,
    });
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !canDrag) return;

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
  }, [dragControls, canDrag, x, y]);

  return (
    <motion.div
      ref={containerRef}
      className={`draggable-frame ${className}`}
      drag={canDrag}
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0.08}
      dragConstraints={constraints || undefined}
      onMouseDown={bringToFront}
      onTouchStart={bringToFront}
      style={{
        x,
        y,
        zIndex,
        position: 'relative',
        touchAction: canDrag ? 'none' : 'auto',
      }}
    >
      {children}
    </motion.div>
  );
}
