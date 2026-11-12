/**
 * ResearchWritingList.tsx — Research & Writing Section
 * React 19 island: client:load
 *
 * Implements Stage 11 Section 3 matching Desktop & Mobile mockups:
 *  - Header: "Research, without the black box." + subtitle + pill button [ All writing ↗ ]
 *  - Interactive category filter pills: All, OOUX, Cultural HCI, AI & Architecture
 *  - Full-width horizontal rows separated by 1px solid var(--color-border):
 *    - Left: Date/Venue pill (e.g. MAY 2026 · MDPI, JAN 2026 · MDPI)
 *    - Center: Crimson eyebrow + bold white title + 1-line summary
 *    - Right: → arrow linking directly to verified MDPI/DOI URL
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export interface PublicationItem {
  id: string;
  title: string;
  venue: string;
  date: string | Date;
  doi?: string;
  url?: string;
  year?: number;
  month?: string;
  abstract?: string;
  keywords?: string[];
  domain?: string[];
}

export interface Props {
  items: PublicationItem[];
}

interface EditorialPub {
  id: string;
  dateVenue: string;
  eyebrow: string;
  title: string;
  summary: string;
  url: string;
  categories: string[];
}

const CATEGORY_FILTERS = ['All', 'OOUX', 'Cultural HCI', 'AI & Architecture'];

const EDITORIAL_MAP: Record<string, Omit<EditorialPub, 'id'>> = {
  'mdpi-info-2026-cultural-ux-taxonomy': {
    dateVenue: 'MAY 2026 · MDPI',
    eyebrow: 'INFORMATION ARCHITECTURE',
    title: 'Model the objects. Then build the pages.',
    summary: 'Applying Object-Oriented UX to complex domains before drawing screens or wireframes.',
    url: 'https://www.mdpi.com/2078-2489/17/5/472',
    categories: ['All', 'OOUX', 'Cultural HCI'],
  },
  'mdpi-info-2026-modular-ia': {
    dateVenue: 'JAN 2026 · MDPI',
    eyebrow: 'EDGE AI',
    title: 'The most useful AI may never leave the device.',
    summary: 'Privacy, edge processing, and calm interaction models for high-stakes environments.',
    url: 'https://doi.org/10.3390/info17010092',
    categories: ['All', 'AI & Architecture'],
  },
  'mdpi-digital-2022-acux-typology': {
    dateVenue: 'JUN 2022 · MDPI',
    eyebrow: 'CULTURAL HCI',
    title: 'A schema is a hypothesis about the world.',
    summary: 'Why taxonomy choices shape human understanding in museum and archival interfaces.',
    url: 'https://www.mdpi.com/2673-6470/2/3/17',
    categories: ['All', 'Cultural HCI', 'OOUX'],
  },
  'acux-recommender-2022': {
    dateVenue: 'NOV 2022 · IEEE',
    eyebrow: 'RECOMMENDER SYSTEMS',
    title: 'Adaptive architectures for diverse human archetypes.',
    summary: 'Multi-profile classification and real-time narrative routing in physical spaces.',
    url: 'https://doi.org/10.1109/IISA56318.2022.9904351',
    categories: ['All', 'AI & Architecture', 'Cultural HCI'],
  },
};

export default function ResearchWritingList({ items }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const shouldReduceMotion = useReducedMotion();

  // Combine collection entries with editorial mapping
  const publicationsList: EditorialPub[] = useMemo(() => {
    return items.map((pub) => {
      const slug = pub.id.replace(/\.mdx?$/, '');
      const mapped = EDITORIAL_MAP[slug];
      if (mapped) {
        return {
          id: slug,
          ...mapped,
          url: pub.doi ? `https://doi.org/${pub.doi}` : (pub.url || mapped.url),
        };
      }

      // Fallback derivation
      const year = pub.year || (pub.date ? new Date(pub.date).getFullYear() : 2026);
      const venueShort = pub.venue.includes('MDPI') ? 'MDPI' : pub.venue.includes('IEEE') ? 'IEEE' : pub.venue;
      return {
        id: slug,
        dateVenue: `${pub.month ? pub.month.toUpperCase().slice(0, 3) + ' ' : ''}${year} · ${venueShort}`,
        eyebrow: pub.domain?.[0]?.toUpperCase() || 'HCI RESEARCH',
        title: pub.title,
        summary: pub.abstract ? pub.abstract.slice(0, 110) + '...' : 'Peer-reviewed research and interaction architecture.',
        url: pub.doi ? `https://doi.org/${pub.doi}` : (pub.url || '#'),
        categories: ['All', 'Cultural HCI'],
      };
    });
  }, [items]);

  const filteredPubs = useMemo(() => {
    if (selectedCategory === 'All') return publicationsList;
    return publicationsList.filter((p) => p.categories.includes(selectedCategory));
  }, [publicationsList, selectedCategory]);

  return (
    <div className="research-wrapper">
      {/* Header Row */}
      <div className="research-header">
        <div className="research-header__text">
          <span className="research-header__eyebrow">ACADEMIC RESEARCH & PAPERS</span>
          <h2 className="research-header__title">Research, without the black box.</h2>
          <p className="research-header__sub">
            Peer-reviewed publications on human-computer interaction, cultural heritage computing, and AI architectures.
          </p>
        </div>

        <a href="/about#publications" className="btn-all-writing">
          All writing <span className="arrow-icon">↗</span>
        </a>
      </div>

      {/* Category Filter Pills */}
      <div className="research-filters" role="tablist" aria-label="Filter research by category">
        {CATEGORY_FILTERS.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedCategory(cat)}
              className={`research-pill ${isActive ? 'is-active' : ''}`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Full-Width Publication Rows */}
      <div className="research-rows">
        <AnimatePresence mode="popLayout">
          {filteredPubs.map((pub) => (
            <motion.a
              key={pub.id}
              href={pub.url}
              target="_blank"
              rel="noopener noreferrer"
              layout={!shouldReduceMotion}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="pub-row"
              aria-label={`${pub.title} (${pub.dateVenue}) — opens in new window`}
            >
              {/* Left Column: Date / Venue Pill */}
              <div className="pub-row__venue-col">
                <span className="venue-pill">{pub.dateVenue}</span>
              </div>

              {/* Center Column: Eyebrow + Title + 1-Line Summary */}
              <div className="pub-row__center-col">
                <span className="pub-eyebrow">{pub.eyebrow}</span>
                <h3 className="pub-title">{pub.title}</h3>
                <p className="pub-summary">{pub.summary}</p>
              </div>

              {/* Right Column: Arrow Link */}
              <div className="pub-row__arrow-col" aria-hidden="true">
                <span className="pub-arrow">→</span>
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>

      <style>{`
        .research-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--space-6, 24px);
          width: 100%;
        }

        /* ── Header ─────────────────────────────────────── */
        .research-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-4, 16px);
        }

        .research-header__text {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-width: 680px;
        }

        .research-header__eyebrow {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-accent);
        }

        .research-header__title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 1.8rem + 1.2vw, 2.8rem);
          font-weight: var(--weight-black, 900);
          letter-spacing: -0.03em;
          color: var(--color-text-main);
          line-height: 1.05;
        }

        .research-header__sub {
          font-family: var(--font-body);
          font-size: 14.5px;
          line-height: 1.6;
          color: var(--color-text-muted);
        }

        .btn-all-writing {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: rgba(18, 12, 14, 0.8);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-pill);
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--color-text-main);
          text-decoration: none;
          transition: all 0.2s ease;
          white-space: nowrap;
          align-self: flex-start;
        }

        .btn-all-writing:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        .arrow-icon {
          transition: transform 0.15s ease;
        }

        .btn-all-writing:hover .arrow-icon {
          transform: translate(2px, -2px);
        }

        /* ── Category Filters ────────────────────────────── */
        .research-filters {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .research-pill {
          padding: 5px 12px;
          background: rgba(18, 12, 14, 0.8);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-pill);
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .research-pill:hover {
          color: var(--color-text-main);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .research-pill.is-active {
          background: var(--color-accent);
          color: #ffffff;
          border-color: var(--color-accent);
          font-weight: 600;
          box-shadow: 0 0 10px rgba(238, 38, 38, 0.4);
        }

        /* ── Full-Width Rows ─────────────────────────────── */
        .research-rows {
          display: flex;
          flex-direction: column;
          width: 100%;
          border-top: 1px solid var(--color-border);
        }

        .pub-row {
          display: grid;
          grid-template-columns: 160px 1fr 40px;
          gap: 24px;
          align-items: center;
          padding: 24px 0;
          border-bottom: 1px solid var(--color-border);
          text-decoration: none;
          color: inherit;
          transition: background-color 0.2s ease, padding 0.2s ease;
        }

        .pub-row:hover {
          background-color: rgba(255, 255, 255, 0.015);
        }

        .venue-pill {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          background: rgba(22, 14, 17, 0.8);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-pill);
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-text-muted);
          white-space: nowrap;
          letter-spacing: 0.04em;
        }

        .pub-row__center-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .pub-eyebrow {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-accent);
        }

        .pub-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--color-text-main);
          line-height: 1.25;
          transition: color 0.15s ease;
        }

        .pub-row:hover .pub-title {
          color: #ffffff;
        }

        .pub-summary {
          font-family: var(--font-body);
          font-size: 13.5px;
          line-height: 1.55;
          color: var(--color-text-muted);
        }

        .pub-row__arrow-col {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .pub-arrow {
          font-family: var(--font-mono);
          font-size: 18px;
          color: var(--color-text-faint);
          transition: all 0.15s ease;
        }

        .pub-row:hover .pub-arrow {
          color: var(--color-accent);
          transform: translateX(4px);
        }

        /* ── Mobile Layout (< 768px) ─────────────────────── */
        @media (max-width: 768px) {
          .pub-row {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 20px 0;
          }

          .pub-row__arrow-col {
            display: none;
          }
        }

        /* ── 1984 Era Retro Overrides ─────────────────────── */
        [data-era="1984"] .btn-all-writing,
        [data-era="1984"] .research-pill,
        [data-era="1984"] .venue-pill {
          border-radius: 0px !important;
          border-color: #EE2626 !important;
          font-family: var(--font-mono) !important;
        }
      `}</style>
    </div>
  );
}
