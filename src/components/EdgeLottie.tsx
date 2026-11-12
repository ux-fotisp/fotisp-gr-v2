/**
 * EdgeLottie.tsx — EDGE Design System Lottie Animation Wrapper
 * React 19 island integrating @lottiefiles/dotlottie-react with 1-Bit Macintosh Dithering.
 *
 * Requirements:
 * - Wrap <DotLottieReact> inside a responsive container.
 * - Detect era from document.documentElement.dataset.era ('1984' | '2026').
 * - Dynamically listen to 'era-changed' and 'astro:after-swap' events.
 * - When era is '1984', apply `filter: url(#dither-1bit); image-rendering: pixelated;`.
 * - Handle container resizing gracefully with auto-resizing canvas and responsive constraints.
 * - Provide a robust 1-bit cosmic wireframe fallback when src/data is omitted or loading.
 */

import React, { useState, useEffect, useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export interface EdgeLottieProps {
  /** URL or asset path to a .lottie or .json animation file */
  src?: string;
  /** Direct JSON animation object if bundled inline */
  data?: any;
  /** Whether the animation auto-plays upon loading (default: true) */
  autoplay?: boolean;
  /** Whether the animation loops continuously (default: true) */
  loop?: boolean;
  /** Playback speed multiplier (default: 1) */
  speed?: number;
  /** Specific animation segment [startFrame, endFrame] */
  segment?: [number, number];
  /** Custom CSS class name for the wrapper */
  className?: string;
  /** Custom inline style overrides */
  style?: React.CSSProperties;
  /** Explicit container width (e.g. '100%', '320px') */
  width?: string | number;
  /** Explicit container height (e.g. '100%', '240px') */
  height?: string | number;
  /** Fallback caption rendered when src is missing or loading */
  fallbackText?: string;
}

export default function EdgeLottie({
  src,
  data,
  autoplay = true,
  loop = true,
  speed = 1,
  segment,
  className = '',
  style,
  width = '100%',
  height = '100%',
  fallbackText,
}: EdgeLottieProps) {
  const [era, setEra] = useState<'1984' | '2026'>('2026');
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Synchronize era state with document element
  useEffect(() => {
    setIsClient(true);

    const syncEra = () => {
      if (typeof document !== 'undefined') {
        const current = (document.documentElement.dataset.era as '1984' | '2026') || '2026';
        setEra(current);
      }
    };

    syncEra();

    const handleEraChanged = (e: Event) => {
      const customEvt = e as CustomEvent<{ era?: '1984' | '2026' }>;
      if (customEvt.detail?.era) {
        setEra(customEvt.detail.era);
      } else {
        syncEra();
      }
    };

    const handleAfterSwap = () => {
      syncEra();
    };

    window.addEventListener('era-changed', handleEraChanged);
    document.addEventListener('astro:after-swap', handleAfterSwap);

    return () => {
      window.removeEventListener('era-changed', handleEraChanged);
      document.removeEventListener('astro:after-swap', handleAfterSwap);
    };
  }, []);

  const isDithered = era === '1984';

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: height,
    filter: isDithered ? 'url(#dither-1bit)' : 'none',
    imageRendering: isDithered ? 'pixelated' : 'auto',
    transition: 'filter 0.15s ease',
    overflow: 'hidden',
    ...style,
  };

  return (
    <div
      ref={containerRef}
      data-era={era}
      className={`edge-lottie-wrapper ${className}`}
      style={wrapperStyle}
      role="figure"
      aria-label="Interactive Vector Animation"
    >
      {src || data ? (
        <DotLottieReact
          src={src}
          data={data}
          autoplay={autoplay}
          loop={loop}
          speed={speed}
          segment={segment}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      ) : (
        /* 1-Bit Geometric Cosmic Wireframe Fallback */
        <div className="edge-lottie-wireframe">
          <svg
            viewBox="0 0 140 140"
            width="90"
            height="90"
            className="edge-lottie-wireframe__svg"
            aria-hidden="true"
          >
            {/* Outer Hexagonal Frame */}
            <polygon
              points="70,10 125,42 125,98 70,130 15,98 15,42"
              fill="none"
              stroke="#EE2626"
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />
            {/* Inner Octahedral Coordinate Projections */}
            <polygon
              points="70,30 105,52 105,88 70,110 35,88 35,52"
              fill="none"
              stroke="#EE2626"
              strokeWidth="1"
            />
            <line x1="70" y1="10" x2="70" y2="30" stroke="#EE2626" strokeWidth="1" />
            <line x1="125" y1="42" x2="105" y2="52" stroke="#EE2626" strokeWidth="1" />
            <line x1="125" y1="98" x2="105" y2="88" stroke="#EE2626" strokeWidth="1" />
            <line x1="70" y1="130" x2="70" y2="110" stroke="#EE2626" strokeWidth="1" />
            <line x1="15" y1="98" x2="35" y2="88" stroke="#EE2626" strokeWidth="1" />
            <line x1="15" y1="42" x2="35" y2="52" stroke="#EE2626" strokeWidth="1" />
            {/* Focal Node */}
            <circle cx="70" cy="70" r="3" fill="#EE2626" />
            <circle cx="70" cy="70" r="8" fill="none" stroke="#EE2626" strokeWidth="0.8" strokeDasharray="2 2" />
          </svg>
          <span className="edge-lottie-wireframe__caption u-mono u-text-xs u-text-accent">
            {fallbackText || '[ EDGE_VECTOR_NODE.LOTTIE ]'}
          </span>
        </div>
      )}

      <style>{`
        .edge-lottie-wrapper {
          user-select: none;
        }

        .edge-lottie-wrapper[data-era="1984"] {
          filter: url(#dither-1bit) !important;
          image-rendering: pixelated !important;
        }

        .edge-lottie-wrapper canvas {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain;
        }

        .edge-lottie-wireframe {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-2, 8px);
          padding: var(--space-4, 16px);
          text-align: center;
        }

        .edge-lottie-wireframe__svg {
          animation: edgeLottiePulse 8s linear infinite;
        }

        @keyframes edgeLottiePulse {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .edge-lottie-wireframe__svg {
            animation: none;
          }
        }

        .edge-lottie-wireframe__caption {
          font-family: var(--font-mono);
          letter-spacing: var(--tracking-wider, 0.05em);
          opacity: 0.85;
        }
      `}</style>
    </div>
  );
}
