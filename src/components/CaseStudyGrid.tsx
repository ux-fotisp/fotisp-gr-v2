/**
 * CaseStudyGrid.tsx — Interactive Case Study Grid & Facet Filter
 * React 19 island with Framer Motion
 *
 * Implements [C] filter_case_studies_by_facet:
 *  - Dual facet filtering by [A:META] domain AND linked [O:REF] service.id
 *  - Smooth layoutId transitions with explicit useReducedMotion() guards
 *  - 1-bit OS empty-state fallback (0 OBJECTS MATCHING FILTER) with [Reset Filter] action
 *  - Live relative coordinate tracking on card hover
 */

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export interface CaseStudyData {
  id: string; // slug
  title: string;
  domain: string;
  role: string;
  timeline: string;
  summary: string;
  deliverables: string[];
  status: string;
  services: string[]; // array of service IDs e.g. ["design-systems", "ux-research"]
  publications?: string[];
  tagline?: string;
  category?: string;
  figureTag?: string;
  year?: number;
  duration?: string;
  protected?: boolean;
  problem?: string;
  outcome?: string;
  impact?: Array<{ metric: string; value: string; context?: string }>;
}

export interface Props {
  items: CaseStudyData[];
  mode?: 'grid' | 'directory';
}

const DOMAIN_FILTERS = [
  { key: 'all', label: 'All Domains' },
  { key: 'Clinical & HealthTech', label: 'Clinical & HealthTech' },
  { key: 'CityOps & AI', label: 'CityOps & AI' },
  { key: 'E-Commerce', label: 'E-Commerce' },
];

const SERVICE_FILTERS = [
  { key: 'all', label: 'All Services' },
  { key: 'ux-research', label: 'UX Research' },
  { key: 'design-systems', label: 'Design Systems' },
  { key: 'ux-strategy', label: 'UX Strategy & Leadership' },
];

const SERVICE_LABELS: Record<string, string> = {
  'ux-research': 'UX Research',
  'design-systems': 'Design Systems',
  'ux-strategy': 'UX Strategy & Leadership',
};

// Card component with live coordinate telemetry
function CaseStudyCard({
  item,
  mode,
  index,
}: {
  item: CaseStudyData;
  mode: 'grid' | 'directory';
  index: number;
}) {
  const [coords, setCoords] = useState<{ x: string; y: string }>({
    x: (0.15 * (index + 1)).toFixed(2),
    y: (0.28 * (index + 1)).toFixed(2),
  });
  const defaultCoords = useMemo(
    () => ({
      x: (0.15 * (index + 1)).toFixed(2),
      y: (0.28 * (index + 1)).toFixed(2),
    }),
    [index]
  );
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      setCoords({ x: relX.toFixed(2), y: relY.toFixed(2) });
    }
  };

  const handlePointerLeave = () => {
    setCoords(defaultCoords);
  };

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`cs-card u-window u-border-1bit ${mode === 'directory' ? 'cs-card--directory' : ''}`}
    >
      {/* Titlebar */}
      <div className="cs-card__titlebar u-window-titlebar">
        <div className="cs-card__controls" aria-hidden="true">
          <span className="cs-card__btn cs-card__btn--close" />
          <span className="cs-card__btn cs-card__btn--min" />
        </div>
        <span className="cs-card__title-id u-mono u-text-xs u-truncate">
          case_study_{item.id}.spec
        </span>
        <span className="cs-card__badge u-mono u-text-xs">
          {item.year || 'PROD'}
        </span>
      </div>

      {/* Card Body */}
      <div className="cs-card__body">
        <div className="cs-card__meta">
          <span className="cs-tag cs-tag--domain u-mono u-text-xs">
            {item.domain}
          </span>
          <span className="cs-tag u-mono u-text-xs">{item.timeline || item.duration}</span>
          {item.protected && (
            <span className="cs-tag cs-tag--protected u-mono u-text-xs" title="Protected under NDA">
              NDA
            </span>
          )}
        </div>

        <h3 className="cs-card__heading">
          <a href={`/work/${item.id}`} className="cs-card__link">
            {item.title}
          </a>
        </h3>

        <p className="cs-card__summary u-text-sm u-text-muted">
          {item.summary || item.tagline}
        </p>

        {/* Linked Services (OOUX [O:REF] Matrix) */}
        {item.services && item.services.length > 0 && (
          <div className="cs-card__services">
            <span className="u-mono u-text-xs u-text-faint u-uppercase u-tracking-widest">
              [O:REF] SERVICES:
            </span>
            <div className="cs-card__service-tags">
              {item.services.map((svcId) => (
                <span key={svcId} className="cs-tag cs-tag--service u-mono u-text-xs">
                  ⊞ {SERVICE_LABELS[svcId] || svcId}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Impact or Deliverables highlights */}
        {item.impact && item.impact.length > 0 && (
          <div className="cs-card__impact">
            {item.impact.slice(0, 3).map((imp, idx) => (
              <div key={idx} className="cs-card__impact-item">
                <span className="cs-card__impact-val u-mono">{imp.value}</span>
                <span className="cs-card__impact-lbl u-mono u-text-xs u-text-faint">
                  {imp.metric}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* CTA Read Case Study */}
        <div className="cs-card__footer-cta">
          <a href={`/work/${item.id}`} className="btn-read-case u-mono u-text-xs">
            [ READ CASE SPECIFICATION → ]
          </a>
        </div>
      </div>

      {/* Live Coordinate Bar */}
      <div className="cs-card__coords" aria-hidden="true">
        <span className="u-mono u-text-xs u-text-faint">{item.figureTag || `Fig. 0${index + 1}`}</span>
        <span className="u-mono u-text-xs u-text-faint">·</span>
        <span className="u-mono u-text-xs u-text-faint">
          x: {coords.x} y: {coords.y}
        </span>
      </div>
    </article>
  );
}

export default function CaseStudyGrid({ items, mode = 'grid' }: Props) {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const shouldReduceMotion = useReducedMotion();

  // Filter items across both facets
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const domainMatch = selectedDomain === 'all' || item.domain === selectedDomain;
      const serviceMatch =
        selectedService === 'all' || (item.services && item.services.includes(selectedService));
      return domainMatch && serviceMatch;
    });
  }, [items, selectedDomain, selectedService]);

  const handleReset = () => {
    setSelectedDomain('all');
    setSelectedService('all');
  };

  return (
    <div className="cs-grid-wrapper">
      {/* Facet Filter Bars */}
      <div className="cs-filter-bar u-window u-border-1bit">
        {/* Domain Filter Row */}
        <div className="cs-filter-bar__row">
          <span className="cs-filter-bar__label u-mono u-text-xs u-text-faint">
            DOMAIN FACET:
          </span>
          <div className="cs-filter-bar__options" role="tablist" aria-label="Filter case studies by domain">
            {DOMAIN_FILTERS.map((f) => {
              const isActive = selectedDomain === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedDomain(f.key)}
                  className={`cs-filter-pill ${isActive ? 'cs-filter-pill--active' : ''}`}
                >
                  {f.label}
                  {isActive && !shouldReduceMotion && (
                    <motion.span
                      layoutId="active-domain-pill"
                      className="cs-filter-pill__glow"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Service Facet Filter Row */}
        <div className="cs-filter-bar__row cs-filter-bar__row--sub u-border-1bit-top">
          <span className="cs-filter-bar__label u-mono u-text-xs u-text-faint">
            [O:REF] SERVICE:
          </span>
          <div className="cs-filter-bar__options" role="tablist" aria-label="Filter case studies by linked service">
            {SERVICE_FILTERS.map((sf) => {
              const isActive = selectedService === sf.key;
              return (
                <button
                  key={sf.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedService(sf.key)}
                  className={`cs-filter-pill cs-filter-pill--service ${isActive ? 'cs-filter-pill--active' : ''}`}
                >
                  {sf.label}
                  {isActive && !shouldReduceMotion && (
                    <motion.span
                      layoutId="active-service-pill"
                      className="cs-filter-pill__glow"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Telemetry Status */}
        <div className="cs-filter-bar__telemetry u-border-1bit-top">
          <span className="u-mono u-text-xs u-text-faint">
            MATCHING_OBJECTS: <strong className="u-text-accent">{filteredItems.length}</strong> / {items.length}
          </span>
          {(selectedDomain !== 'all' || selectedService !== 'all') && (
            <button
              type="button"
              onClick={handleReset}
              className="btn-reset-mini u-mono u-text-xs u-text-muted"
            >
              [ Clear Filters ]
            </button>
          )}
        </div>
      </div>

      {/* Animated Cards Grid / Directory */}
      <AnimatePresence mode="popLayout">
        {filteredItems.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="cs-empty u-window u-border-1bit"
          >
            <div className="cs-empty__badge u-mono u-text-xs u-text-accent">
              [ ! ] 0 OBJECTS MATCHING FILTER
            </div>
            <p className="cs-empty__msg u-mono u-text-sm u-text-muted">
              No case specifications intersect domain "{selectedDomain}" and service "{selectedService}".
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="btn-primary u-mono u-text-xs"
            >
              [ RESET FILTER TO ALL ]
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="card-grid"
            layout={!shouldReduceMotion}
            className={`cs-grid ${mode === 'directory' ? 'cs-grid--directory' : ''}`}
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout={!shouldReduceMotion}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <CaseStudyCard item={item} mode={mode} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .cs-grid-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
        }

        /* ── Filter Bar ─────────────────────────────── */
        .cs-filter-bar {
          background-color: var(--color-surface);
          border: var(--border-1bit);
          display: flex;
          flex-direction: column;
        }

        .cs-filter-bar__row {
          display: flex;
          align-items: center;
          padding: var(--space-3) var(--space-4);
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        .cs-filter-bar__label {
          min-width: 140px;
          letter-spacing: var(--tracking-wider);
          user-select: none;
        }

        .cs-filter-bar__options {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .cs-filter-pill {
          position: relative;
          background: transparent;
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
          padding: 4px 12px;
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          cursor: pointer;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .cs-filter-pill:hover {
          color: var(--color-text);
          border-color: var(--color-border-bright);
        }

        .cs-filter-pill--active {
          color: var(--color-text);
          border-color: var(--color-accent);
        }

        .cs-filter-pill__glow {
          position: absolute;
          inset: 0;
          background-color: rgba(238, 38, 38, 0.12);
          border: 1px solid var(--color-accent);
          pointer-events: none;
        }

        .cs-filter-bar__telemetry {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-2) var(--space-4);
          background-color: rgba(0, 0, 0, 0.2);
        }

        .btn-reset-mini {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 2px 6px;
        }
        .btn-reset-mini:hover {
          color: var(--color-accent);
        }

        /* ── Grid ───────────────────────────────────── */
        .cs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-8);
        }

        @media (min-width: 768px) {
          .cs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .cs-grid--directory {
          grid-template-columns: 1fr;
        }

        /* ── Card ───────────────────────────────────── */
        .cs-card {
          background-color: var(--color-surface);
          border: var(--border-1bit);
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: border-color 0.15s ease;
        }

        .cs-card:hover {
          border-color: var(--color-border-bright);
        }

        .cs-card__titlebar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 12px;
          background-color: var(--color-surface-sunken);
          border-bottom: var(--border-1bit);
          gap: var(--space-2);
        }

        .cs-card__controls {
          display: flex;
          gap: 4px;
        }

        .cs-card__btn {
          width: 8px;
          height: 8px;
          border: 1px solid var(--color-border);
          display: block;
        }
        .cs-card__btn--close { background: var(--color-accent); }
        .cs-card__btn--min { background: transparent; }

        .cs-card__title-id {
          flex: 1;
          color: var(--color-text-muted);
        }

        .cs-card__badge {
          color: var(--color-accent);
        }

        .cs-card__body {
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          flex: 1;
        }

        .cs-card__meta {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .cs-tag {
          padding: 2px 8px;
          background-color: var(--color-surface-sunken);
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
        }

        .cs-tag--domain {
          color: var(--color-accent);
          border-color: rgba(238, 38, 38, 0.4);
        }

        .cs-tag--service {
          color: var(--color-text);
          background-color: rgba(255, 255, 255, 0.04);
        }

        .cs-tag--protected {
          color: #eab308;
          border-color: rgba(234, 179, 8, 0.4);
        }

        .cs-card__heading {
          font-size: var(--text-xl);
          font-weight: var(--weight-bold);
          line-height: var(--leading-tight);
        }

        .cs-card__link {
          color: var(--color-text);
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .cs-card__link:hover {
          color: var(--color-accent);
        }

        .cs-card__summary {
          line-height: var(--leading-relaxed);
          flex: 1;
        }

        .cs-card__services {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          padding: var(--space-3) 0;
          border-top: 1px dashed var(--color-border);
          border-bottom: 1px dashed var(--color-border);
        }

        .cs-card__service-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .cs-card__impact {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: var(--space-3);
          background-color: var(--color-surface-sunken);
          padding: var(--space-3);
          border: 1px solid var(--color-border);
        }

        .cs-card__impact-item {
          display: flex;
          flex-direction: column;
        }

        .cs-card__impact-val {
          font-size: var(--text-base);
          font-weight: var(--weight-bold);
          color: var(--color-accent);
        }

        .cs-card__footer-cta {
          margin-top: auto;
          padding-top: var(--space-2);
        }

        .btn-read-case {
          color: var(--color-text);
          text-decoration: none;
          letter-spacing: var(--tracking-wider);
          transition: color 0.15s ease;
          display: inline-block;
        }
        .btn-read-case:hover {
          color: var(--color-accent);
        }

        .cs-card__coords {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 12px;
          background-color: var(--color-surface-sunken);
          border-top: var(--border-1bit);
        }

        /* ── Empty State ────────────────────────────── */
        .cs-empty {
          background-color: var(--color-surface);
          border: var(--border-1bit);
          padding: var(--space-12);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--space-4);
        }

        .cs-empty__badge {
          letter-spacing: var(--tracking-widest);
        }

        .cs-empty__msg {
          max-width: 50ch;
        }
      `}</style>
    </div>
  );
}
