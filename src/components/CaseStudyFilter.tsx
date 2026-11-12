/**
 * CaseStudyFilter.tsx — Interactive Case Study Filter with Framer Motion Choreography
 * React 19 island
 *
 * Supports instant filtering across:
 *   - 'All'
 *   - 'Clinical & HealthTech' (health-tech)
 *   - 'CityOps & AI' (civic-tech, ai-ux)
 *   - 'E-Commerce' (e-commerce, food-tech)
 *
 * Features layoutId transitions that gracefully degrade under prefers-reduced-motion.
 */

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export interface CaseStudyData {
  id: string; // slug
  title: string;
  tagline: string;
  category: string;
  year: number;
  duration?: string;
  protected?: boolean;
  figureTag?: string;
  problem?: string;
  outcome?: string;
  impact?: Array<{ metric: string; value: string; context?: string }>;
}

interface Props {
  items: CaseStudyData[];
  mode?: 'grid' | 'directory';
}

type FilterKey = 'all' | 'clinical' | 'cityops' | 'ecommerce';

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: 'all', label: 'All Domains' },
  { key: 'clinical', label: 'Clinical & HealthTech' },
  { key: 'cityops', label: 'CityOps & AI' },
  { key: 'ecommerce', label: 'E-Commerce' },
];

function matchesFilter(category: string, filter: FilterKey): boolean {
  switch (filter) {
    case 'clinical':
      return category === 'health-tech';
    case 'cityops':
      return category === 'civic-tech' || category === 'ai-ux';
    case 'ecommerce':
      return category === 'e-commerce' || category === 'food-tech';
    case 'all':
    default:
      return true;
  }
}

const CATEGORY_NAMES: Record<string, string> = {
  'health-tech': 'Clinical HealthTech',
  'civic-tech': 'CityOps & Civic',
  'e-commerce': 'E-Commerce & Retail',
  'ai-ux': 'AI & Information Architecture',
  'product-design': 'Product Design',
};

// Sub-component for coordinate tracking in cards
function FilteredCard({
  item,
  mode,
  index,
}: {
  item: CaseStudyData;
  mode: 'grid' | 'directory';
  index: number;
}) {
  const [coords, setCoords] = useState<{ x: string; y: string }>({
    x: (0.12 * (index + 1)).toFixed(2),
    y: (0.24 * (index + 1)).toFixed(2),
  });
  const defaultCoords = useMemo(
    () => ({
      x: (0.12 * (index + 1)).toFixed(2),
      y: (0.24 * (index + 1)).toFixed(2),
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
    <motion.article
      layout={!shouldReduceMotion}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="case-filter-item"
    >
      <div
        ref={cardRef}
        className="u-window desktop-window"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--color-surface)',
          border: 'var(--border-1bit)',
          position: 'relative',
        }}
      >
        {/* Titlebar */}
        <div
          className="desktop-window__titlebar u-window-titlebar"
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 'var(--window-titlebar)',
            paddingInline: 'var(--space-3)',
            backgroundColor: 'var(--color-chrome-bg)',
            borderBottom: 'var(--border-1bit)',
            userSelect: 'none',
            gap: 'var(--space-2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
            <span
              style={{
                display: 'block',
                width: '10px',
                height: '10px',
                border: 'var(--border-1bit)',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '10px',
                height: '10px',
                border: 'var(--border-1bit)',
              }}
            />
          </div>
          <span
            className="u-mono u-text-xs u-truncate"
            style={{ flex: 1, color: 'var(--color-text-muted)' }}
          >
            {item.title}
          </span>
          <span
            className="u-mono u-text-xs"
            style={{
              padding: '2px var(--space-2)',
              border: 'var(--border-1bit-subtle)',
              color: 'var(--color-text-faint)',
            }}
          >
            {item.id}.mdx
          </span>
        </div>

        {/* Body */}
        {mode === 'grid' ? (
          <a
            href={`/work/${item.id}`}
            style={{
              display: 'block',
              textDecoration: 'none',
              color: 'inherit',
              padding: 'var(--space-6)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-3)',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px var(--space-2)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)',
                  border: 'var(--border-1bit)',
                }}
              >
                {CATEGORY_NAMES[item.category] || item.category}
              </span>
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px var(--space-2)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-faint)',
                  border: 'var(--border-1bit-subtle)',
                }}
              >
                {item.year}
              </span>
              {item.protected && (
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px var(--space-2)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-accent)',
                    border: 'var(--border-1bit-accent)',
                  }}
                >
                  NDA
                </span>
              )}
            </div>

            <h3
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 'bold',
                color: 'var(--color-text)',
                marginBottom: 'var(--space-2)',
                lineHeight: 1.25,
              }}
            >
              {item.title}
            </h3>

            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-muted)',
                lineHeight: 1.6,
                marginBottom: 'var(--space-4)',
              }}
            >
              {item.tagline}
            </p>

            {item.impact && item.impact.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--space-6)',
                  paddingTop: 'var(--space-4)',
                  borderTop: 'var(--border-1bit-subtle)',
                }}
              >
                {item.impact.slice(0, 2).map((imp, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--text-base)',
                        fontWeight: 900,
                        color: 'var(--color-accent)',
                      }}
                    >
                      {imp.value}
                    </span>
                    <span
                      className="u-mono"
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-faint)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {imp.metric}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </a>
        ) : (
          <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <span
                style={{
                  padding: '2px var(--space-2)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)',
                  border: 'var(--border-1bit)',
                }}
              >
                {CATEGORY_NAMES[item.category] || item.category}
              </span>
              <span
                style={{
                  padding: '2px var(--space-2)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-faint)',
                  border: 'var(--border-1bit-subtle)',
                }}
              >
                {item.year}
              </span>
              {item.duration && (
                <span
                  style={{
                    padding: '2px var(--space-2)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-faint)',
                    border: 'var(--border-1bit-subtle)',
                  }}
                >
                  {item.duration}
                </span>
              )}
              {item.protected && (
                <span
                  style={{
                    padding: '2px var(--space-2)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-accent)',
                    border: 'var(--border-1bit-accent)',
                  }}
                >
                  NDA
                </span>
              )}
            </div>

            <h2 style={{ margin: 0 }}>
              <a
                href={`/work/${item.id}`}
                style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'bold',
                  color: 'var(--color-text)',
                  textDecoration: 'none',
                }}
              >
                {item.title}
              </a>
            </h2>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              {item.tagline}
            </p>

            {item.problem && item.outcome && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--color-surface-raised)',
                  border: 'var(--border-1bit-subtle)',
                }}
              >
                <div>
                  <span
                    className="u-mono u-text-xs u-text-faint"
                    style={{ display: 'block', textTransform: 'uppercase', marginBottom: '4px' }}
                  >
                    The Problem
                  </span>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                    {item.problem.slice(0, 160)}...
                  </p>
                </div>
                <div>
                  <span
                    className="u-mono u-text-xs u-text-faint"
                    style={{ display: 'block', textTransform: 'uppercase', marginBottom: '4px' }}
                  >
                    The Outcome
                  </span>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                    {item.outcome.slice(0, 160)}...
                  </p>
                </div>
              </div>
            )}

            {item.impact && item.impact.length > 0 && (
              <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', paddingTop: 'var(--space-2)' }}>
                {item.impact.slice(0, 3).map((imp, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--text-xl)',
                        fontWeight: 900,
                        color: 'var(--color-accent)',
                      }}
                    >
                      {imp.value}
                    </span>
                    <span
                      className="u-mono u-text-xs"
                      style={{ color: 'var(--color-text-faint)', textTransform: 'uppercase' }}
                    >
                      {imp.metric}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--space-2)' }}>
              <a
                href={`/work/${item.id}`}
                className="btn-read-case u-mono u-text-xs"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: 'var(--space-2) var(--space-4)',
                  color: 'var(--color-text-muted)',
                  border: 'var(--border-1bit)',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                }}
              >
                Inspect Specification [Enter] →
              </a>
            </div>
          </div>
        )}

        {/* Live Coordinate Bar */}
        <div
          className="desktop-window__coords"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-3)',
            borderTop: 'var(--border-1bit-subtle)',
            backgroundColor: 'var(--color-chrome-bg)',
          }}
        >
          <span className="u-mono u-text-xs u-text-faint">{item.figureTag || `Fig. 0${index + 1}`}</span>
          <span className="u-mono u-text-xs u-text-faint" style={{ opacity: 0.4 }}>
            ·
          </span>
          <span className="u-mono u-text-xs u-text-faint">
            x: {coords.x} y: {coords.y}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default function CaseStudyFilter({ items, mode = 'grid' }: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const shouldReduceMotion = useReducedMotion();

  const filteredItems = useMemo(() => {
    return items.filter((item) => matchesFilter(item.category, activeFilter));
  }, [items, activeFilter]);

  return (
    <div className="case-filter-wrapper">
      {/* Filter Navigation Tabs */}
      <nav
        className="case-filter-nav"
        aria-label="Filter case studies by domain"
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-8)',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <span
          className="u-mono u-text-xs u-text-faint"
          style={{ marginRight: 'var(--space-2)', textTransform: 'uppercase' }}
        >
          Domain Filter:
        </span>
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveFilter(f.key)}
              className="case-filter-tab u-mono u-text-xs"
              style={{
                position: 'relative',
                padding: 'var(--space-2) var(--space-4)',
                backgroundColor: 'transparent',
                color: isActive ? 'var(--color-text)' : 'var(--color-text-faint)',
                border: 'var(--border-1bit)',
                borderColor: isActive ? 'var(--color-accent)' : 'var(--color-border)',
                cursor: 'pointer',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                transition: 'color 0.15s ease',
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="activeFilterPill"
                  transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(238, 38, 38, 0.15)',
                    border: '1px solid var(--color-accent)',
                    zIndex: -1,
                  }}
                />
              )}
              {f.label}
            </button>
          );
        })}
      </nav>

      {/* Filtered Grid / Directory */}
      <motion.div
        layout={!shouldReduceMotion}
        style={{
          display: 'grid',
          gridTemplateColumns:
            mode === 'grid'
              ? 'repeat(auto-fit, minmax(320px, 1fr))'
              : '1fr',
          gap: mode === 'grid' ? 'var(--space-6)' : 'var(--space-10)',
        }}
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => (
            <FilteredCard key={item.id} item={item} mode={mode} index={idx} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
