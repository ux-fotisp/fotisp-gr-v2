/**
 * EdgeLottie.tsx — EDGE Design System Lottie Animation & Celestial Radar Wrapper
 * React 19 island integrating @lottiefiles/dotlottie-react with 1-Bit Macintosh Dithering.
 *
 * Requirements:
 * - Wrap <DotLottieReact> inside a responsive container.
 * - Detect era from document.documentElement.dataset.era ('1984' | '2026').
 * - Dynamically listen to 'era-changed' and 'astro:after-swap' events.
 * - When era is '1984', apply `filter: url(#dither-1bit); image-rendering: pixelated;`.
 * - Handle container resizing gracefully with auto-resizing canvas and responsive constraints.
 * - Provide a bespoke celestial orbital radar fallback (matching EDGE design system HUD)
 *   when src/data is omitted or loading.
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
  fallbackText = '[ ORBITAL_RADAR // THESSALONIKI_NODE: 40.64° N, 22.94° E ]',
}: EdgeLottieProps) {
  const [era, setEra] = useState<'1984' | '2026'>('2026');
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Synchronize era state with document element and navigation lifecycle
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
        /* Celestial Orbital Radar Motif (EDGE Design System Reference HUD) */
        <div className="edge-lottie-radar">
          <svg
            viewBox="0 0 200 200"
            width="170"
            height="170"
            className="edge-lottie-radar__svg"
            aria-hidden="true"
          >
            <defs>
              {/* Radar sweep gradient */}
              <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EE2626" stopOpacity="0.35" />
                <stop offset="70%" stopColor="#EE2626" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#080303" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background ambient field */}
            <circle cx="100" cy="100" r="92" fill="#080303" />

            {/* Concentric Range Rings */}
            <circle cx="100" cy="100" r="24" fill="none" stroke="#EE2626" strokeWidth="0.8" strokeOpacity="0.4" />
            <circle cx="100" cy="100" r="50" fill="none" stroke="#EE2626" strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="76" fill="none" stroke="#EE2626" strokeWidth="1" strokeOpacity="0.6" />
            <circle cx="100" cy="100" r="92" fill="none" stroke="#EE2626" strokeWidth="1.2" strokeOpacity="0.8" />

            {/* Polar Axes & Coordinates */}
            <line x1="8" y1="100" x2="192" y2="100" stroke="#EE2626" strokeWidth="0.7" strokeOpacity="0.4" />
            <line x1="100" y1="8" x2="100" y2="192" stroke="#EE2626" strokeWidth="0.7" strokeOpacity="0.4" />
            <line x1="36" y1="36" x2="164" y2="164" stroke="#EE2626" strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="2 4" />
            <line x1="36" y1="164" x2="164" y2="36" stroke="#EE2626" strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="2 4" />

            {/* Axis Tick Marks */}
            <line x1="100" y1="12" x2="104" y2="12" stroke="#EE2626" strokeWidth="1" />
            <line x1="100" y1="188" x2="104" y2="188" stroke="#EE2626" strokeWidth="1" />
            <line x1="12" y1="100" x2="12" y2="104" stroke="#EE2626" strokeWidth="1" />
            <line x1="188" y1="100" x2="188" y2="104" stroke="#EE2626" strokeWidth="1" />

            {/* Rotating Radar Sweep Line */}
            <g className="edge-lottie-radar__sweep">
              <line x1="100" y1="100" x2="192" y2="100" stroke="#EE2626" strokeWidth="1.5" strokeOpacity="0.9" />
              <path d="M 100 100 L 192 100 A 92 92 0 0 0 165 35 Z" fill="url(#radarSweep)" opacity="0.6" />
            </g>

            {/* Orbiting Telemetry Nodes */}
            <g className="edge-lottie-radar__orbits">
              {/* Outer orbit node */}
              <circle cx="158" cy="74" r="3.5" fill="#EE2626" />
              <circle cx="158" cy="74" r="7" fill="none" stroke="#EE2626" strokeWidth="0.75" strokeDasharray="2 2" />
              {/* Mid orbit node */}
              <circle cx="65" cy="135" r="3" fill="#EE2626" />
              {/* Inner orbit node */}
              <circle cx="118" cy="86" r="2.5" fill="#EE2626" />
            </g>

            {/* Central Core Pulse */}
            <circle cx="100" cy="100" r="5" fill="#EE2626" />
            <circle cx="100" cy="100" r="10" fill="none" stroke="#EE2626" strokeWidth="0.8" className="edge-lottie-radar__pulse" />
          </svg>

          <span className="edge-lottie-radar__caption u-mono u-text-xs u-text-accent">
            {fallbackText}
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

        .edge-lottie-radar {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-3, 12px);
          padding: var(--space-4, 16px);
          text-align: center;
        }

        .edge-lottie-radar__sweep {
          transform-origin: 100px 100px;
          animation: radarSweep 6s linear infinite;
        }

        .edge-lottie-radar__pulse {
          transform-origin: 100px 100px;
          animation: radarPulse 2.5s ease-out infinite;
        }

        @keyframes radarSweep {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes radarPulse {
          0% {
            r: 5px;
            opacity: 1;
          }
          100% {
            r: 18px;
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .edge-lottie-radar__sweep,
          .edge-lottie-radar__pulse {
            animation: none;
          }
        }

        .edge-lottie-radar__caption {
          font-family: var(--font-mono);
          letter-spacing: 0.08em;
          font-size: 11px;
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
