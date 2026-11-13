/**
 * BentoCaseStudyGrid.tsx — Asymmetric Bento Case Study Grid
 * React 19 island: client:load
 *
 * Implements Stage 11 Bento Layout matching Desktop & Mobile mockups:
 *  - Header with domain filter pills: All, Clinical & HealthTech, CityOps & AI, E-Commerce
 *  - Card 1 (8 cols): Featured Wide Card — MediPulse with embedded Dashboard UI preview
 *    (KPI metric boxes 98%, 81%, 3.1s, 11-bar vertical chart with last 4 highlighted in #EE2626)
 *  - Card 2 (4 cols): Tall Right Editorial Card — "The patient is not a dashboard."
 *    (3 numbered rows with icons + Explore clinical UX link)
 *  - Card 3 (6 cols): HealthPulse / Cultural Matching with embedded dual interactive cards
 *    (Left highlighted in deep crimson #2A080D with crimson border)
 *  - Card 4 (6 cols): AETHRA & Design Systems with embedded Design System preview
 *    (3 token counter boxes 48, 8, 24, horizontal 5-swatch palette strip)
 *  - Card 5: FoodWeLove (for E-Commerce filter or expanded view)
 */

import { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface CaseStudyItem {
  id: string;
  title: string;
  domain: string;
  role: string;
  timeline: string;
  summary: string;
  deliverables?: string[];
  status?: string;
  services?: string[];
  tagline?: string;
  year?: number;
  figureTag?: string;
  protected?: boolean;
}

export interface Props {
  items: CaseStudyItem[];
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'Clinical & HealthTech', label: 'Clinical & HealthTech' },
  { key: 'CityOps & AI', label: 'CityOps & AI' },
  { key: 'E-Commerce', label: 'E-Commerce' },
];

export default function BentoCaseStudyGrid({ items }: Props) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const shouldReduceMotion = useReducedMotion();

  // Find specific case studies by slug
  const medipulse = useMemo(() => items.find((i) => i.id === 'medipulse'), [items]);
  const healthpulse = useMemo(() => items.find((i) => i.id === 'healthpulse'), [items]);
  const aethra = useMemo(() => items.find((i) => i.id === 'aethra'), [items]);
  const foodwelove = useMemo(() => items.find((i) => i.id === 'food-we-love'), [items]);

  const showMediPulse = selectedFilter === 'all' || selectedFilter === 'Clinical & HealthTech';
  const showEditorial = selectedFilter === 'all' || selectedFilter === 'Clinical & HealthTech';
  const showHealthPulse = selectedFilter === 'all' || selectedFilter === 'Clinical & HealthTech';
  const showAethra = selectedFilter === 'all' || selectedFilter === 'CityOps & AI';
  const showFoodWeLove = selectedFilter === 'E-Commerce';

  return (
    <div className="bento-wrapper">
      {/* Section Header with Domain Filter Pills */}
      <div className="bento-header">
        <div className="bento-header__text">
          <span className="bento-header__eyebrow">SELECTED WORK // 2021 — 2026</span>
          <h2 className="bento-header__title">Not just screens. Systems that work.</h2>
        </div>

        <div className="bento-filter-pills" role="tablist" aria-label="Filter case studies by domain">
          {FILTERS.map((f) => {
            const isActive = selectedFilter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedFilter(f.key)}
                className={`bento-filter-pill ${isActive ? 'is-active' : ''}`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 12-Column Responsive Bento Grid */}
      <div className="bento-grid">
        {/* ── CARD 1: MediPulse (8 cols) ── */}
        {showMediPulse && (
          <motion.div
            layout={!shouldReduceMotion}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className={`bento-card bento-card--medipulse ${
              selectedFilter === 'Clinical & HealthTech' ? 'bento-col-8' : 'bento-col-8'
            }`}
          >
            {/* Top Embedded Dashboard UI Preview */}
            <div className="bento-preview bento-preview--medipulse">
              <div className="bento-preview__topbar">
                <div className="bento-preview__dot-label">
                  <span className="bento-preview__dot" />
                  <span className="bento-preview__system-title">MEDIPULSE MONITOR</span>
                </div>
                <span className="bento-preview__badge">Prototypes over slides</span>
              </div>

              <div className="bento-preview__headline">
                <span className="bento-preview__headline-title">Metabolic Overview</span>
              </div>

              {/* 3 KPI Metric Boxes */}
              <div className="medipulse-kpis">
                <div className="kpi-box">
                  <span className="kpi-box__val">98%</span>
                  <span className="kpi-box__lbl">IN-RANGE TARGET</span>
                </div>
                <div className="kpi-box">
                  <span className="kpi-box__val">81%</span>
                  <span className="kpi-box__lbl">SIGNAL ADHERENCE</span>
                </div>
                <div className="kpi-box">
                  <span className="kpi-box__val">3.1s</span>
                  <span className="kpi-box__lbl">MEDIAN TRIAGE</span>
                </div>
              </div>

              {/* 11-Bar Vertical Chart (Last 4 highlighted in #EE2626) */}
              <div className="medipulse-chart" aria-label="11-point metabolic telemetry sequence">
                <div className="chart-bar" style={{ height: '42%' }} />
                <div className="chart-bar" style={{ height: '55%' }} />
                <div className="chart-bar" style={{ height: '70%' }} />
                <div className="chart-bar" style={{ height: '48%' }} />
                <div className="chart-bar" style={{ height: '62%' }} />
                <div className="chart-bar" style={{ height: '76%' }} />
                <div className="chart-bar" style={{ height: '60%' }} />
                <div className="chart-bar chart-bar--crimson" style={{ height: '88%' }} />
                <div className="chart-bar chart-bar--crimson" style={{ height: '94%' }} />
                <div className="chart-bar chart-bar--crimson" style={{ height: '98%' }} />
                <div className="chart-bar chart-bar--crimson" style={{ height: '84%' }} />
              </div>

              {/* Subtle Alert Strip */}
              <div className="medipulse-alert">
                <span className="medipulse-alert__dot">●</span>
                <span>Critical threshold exceeded in post-prandial window</span>
              </div>
            </div>

            {/* Bottom Card Content */}
            <div className="bento-card__body">
              <div className="bento-card__meta">
                <span className="bento-tag bento-tag--crimson">CLINICAL & HEALTHTECH</span>
                <span className="bento-tag bento-tag--subtle">01 // PFIZER</span>
              </div>

              <h3 className="bento-card__title">From clinical signals to culinary decisions.</h3>

              <p className="bento-card__desc">
                {medipulse?.summary ||
                  'A specialized application designed for severe insulin resistance and metabolic dysfunction patients, turning complex biomarker telemetry into actionable meal choices.'}
              </p>

              <div className="bento-card__ooux">
                <span className="ooux-pill">OOUX</span>
                <span className="ooux-pill">CLINICAL UX</span>
                <span className="ooux-pill">MOBILE</span>
              </div>

              <a href="/work/medipulse" className="bento-card__cta">
                Inspect case study <span className="cta-arrow">→</span>
              </a>
            </div>
          </motion.div>
        )}

        {/* ── CARD 2: Editorial Card (4 cols) ── */}
        {showEditorial && (
          <motion.div
            layout={!shouldReduceMotion}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="bento-card bento-card--editorial bento-col-4"
          >
            <div className="editorial-content">
              <span className="bento-tag bento-tag--crimson">CLINICAL DESIGN PHILOSOPHY</span>

              <h3 className="editorial-title">The patient is not a dashboard.</h3>

              <p className="editorial-desc">
                In critical healthcare, every second counts. The user interface must reduce cognitive load,
                prioritizing human context and safety alerts over raw data volume. A patient is a person with
                acute needs, not an aggregation of abstract metrics.
              </p>

              <div className="editorial-rows">
                <div className="editorial-row">
                  <div className="editorial-row__header">
                    <span className="row-num">01 · Clinical context</span>
                  </div>
                  <span className="row-desc">Ambient awareness over noisy notifications</span>
                </div>

                <div className="editorial-row">
                  <div className="editorial-row__header">
                    <span className="row-num">02 · Alert hierarchy</span>
                  </div>
                  <span className="row-desc">Stratified severity triage thresholds</span>
                </div>

                <div className="editorial-row">
                  <div className="editorial-row__header">
                    <span className="row-num">03 · Zero-friction action</span>
                  </div>
                  <span className="row-desc">Single-tap verified interventions</span>
                </div>
              </div>

              <a href="/work/healthpulse" className="bento-card__cta" style={{ marginTop: 'auto' }}>
                Explore clinical UX <span className="cta-arrow">→</span>
              </a>
            </div>
          </motion.div>
        )}

        {/* ── CARD 3: HealthPulse / Cultural Matching (6 cols) ── */}
        {showHealthPulse && (
          <motion.div
            layout={!shouldReduceMotion}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className={`bento-card bento-card--healthpulse ${
              selectedFilter === 'Clinical & HealthTech' ? 'bento-col-12' : 'bento-col-6'
            }`}
          >
            {/* Top Embedded UI Preview */}
            <div className="bento-preview bento-preview--healthpulse">
              <div className="bento-preview__topbar">
                <div className="bento-preview__dot-label">
                  <span className="bento-preview__dot" />
                  <span className="bento-preview__system-title">HEALTHPULSE / CULTURAL</span>
                </div>
                <span className="bento-preview__badge">AI MATCHING</span>
              </div>

              <div className="bento-preview__headline">
                <span className="bento-preview__headline-title">Your next connection</span>
              </div>

              {/* Two side-by-side interactive cards */}
              <div className="healthpulse-dual-cards">
                <div className="hp-card hp-card--crimson">
                  <div className="hp-card__icon">( + )</div>
                  <div className="hp-card__title">Biometric Match</div>
                  <div className="hp-card__sub">High affinity profile · 94%</div>
                </div>

                <div className="hp-card hp-card--obsidian">
                  <div className="hp-card__icon">⌘</div>
                  <div className="hp-card__title">Passive Tracking</div>
                  <div className="hp-card__sub">Circadian rhythm · 88 bpm</div>
                </div>
              </div>
            </div>

            {/* Bottom Card Content */}
            <div className="bento-card__body">
              <div className="bento-card__meta">
                <span className="bento-tag bento-tag--crimson">DIGITAL HEALTH</span>
                <span className="bento-tag bento-tag--subtle">02 // HEALTHPULSE</span>
              </div>

              <h3 className="bento-card__title">Culture, beyond the algorithm.</h3>

              <p className="bento-card__desc">
                {healthpulse?.summary ||
                  'Empathetic health technology connecting patients through cultural context, lived experience, and biometric harmony.'}
              </p>

              <div className="bento-card__ooux">
                <span className="ooux-pill">HCI</span>
                <span className="ooux-pill">OOUX</span>
                <span className="ooux-pill">AI UX</span>
              </div>

              <a href="/work/healthpulse" className="bento-card__cta">
                Inspect case study <span className="cta-arrow">→</span>
              </a>
            </div>
          </motion.div>
        )}

        {/* ── CARD 4: AETHRA & Design Systems (6 cols) ── */}
        {showAethra && (
          <motion.div
            layout={!shouldReduceMotion}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className={`bento-card bento-card--aethra ${
              selectedFilter === 'CityOps & AI' ? 'bento-col-12' : 'bento-col-6'
            }`}
          >
            {/* Top Embedded Design System Preview */}
            <div className="bento-preview bento-preview--aethra">
              <div className="bento-preview__topbar">
                <div className="bento-preview__dot-label">
                  <span className="bento-preview__dot" />
                  <span className="bento-preview__system-title">AETHRA DESIGN SYSTEM</span>
                </div>
                <span className="bento-preview__badge">DESIGN OPS</span>
              </div>

              <div className="bento-preview__headline">
                <span className="bento-preview__headline-title">A shared source of truth</span>
              </div>

              {/* 3 Token Counter Boxes */}
              <div className="aethra-counters">
                <div className="counter-box">
                  <span className="counter-box__val">48</span>
                  <span className="counter-box__lbl">COMPONENTS</span>
                </div>
                <div className="counter-box">
                  <span className="counter-box__val">8</span>
                  <span className="counter-box__lbl">PLATFORMS</span>
                </div>
                <div className="counter-box">
                  <span className="counter-box__val">24</span>
                  <span className="counter-box__lbl">TOKENS</span>
                </div>
              </div>

              {/* Horizontal 5-Swatch Color Palette Strip */}
              <div className="aethra-swatches">
                <div className="swatch-strip">
                  <div className="swatch" style={{ background: '#FF3B4E' }} title="#FF3B4E" />
                  <div className="swatch" style={{ background: '#EE2626' }} title="#EE2626" />
                  <div className="swatch" style={{ background: '#F4F4F5' }} title="#F4F4F5" />
                  <div className="swatch" style={{ background: '#9E8E91' }} title="#9E8E91" />
                  <div className="swatch" style={{ background: '#380F15' }} title="#380F15" />
                </div>
                <span className="swatch-pill">TOKENS v2.4</span>
              </div>
            </div>

            {/* Bottom Card Content */}
            <div className="bento-card__body">
              <div className="bento-card__meta">
                <span className="bento-tag bento-tag--crimson">CITYOPS & AI</span>
                <span className="bento-tag bento-tag--subtle">03 // AETHRA</span>
              </div>

              <h3 className="bento-card__title">One language, every product.</h3>

              <p className="bento-card__desc">
                {aethra?.summary ||
                  'A unified design system and multi-tenant component architecture powering civic intelligence across European municipalities.'}
              </p>

              <div className="bento-card__ooux">
                <span className="ooux-pill">DESIGN SYSTEM</span>
                <span className="ooux-pill">TOKENS</span>
                <span className="ooux-pill">WCAG AAA</span>
              </div>

              <a href="/work/aethra" className="bento-card__cta">
                Inspect case study <span className="cta-arrow">→</span>
              </a>
            </div>
          </motion.div>
        )}

        {/* ── CARD 5: FoodWeLove (for E-Commerce filter) ── */}
        {showFoodWeLove && (
          <motion.div
            layout={!shouldReduceMotion}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="bento-card bento-card--foodwelove bento-col-12"
          >
            <div className="bento-preview bento-preview--foodwelove">
              <div className="bento-preview__topbar">
                <div className="bento-preview__dot-label">
                  <span className="bento-preview__dot" />
                  <span className="bento-preview__system-title">FOODWELOVE STOREFRONT</span>
                </div>
                <span className="bento-preview__badge">FACETED IA</span>
              </div>

              <div className="bento-preview__headline">
                <span className="bento-preview__headline-title">1.4K SKUs Provenance Search</span>
              </div>

              <div className="aethra-counters">
                <div className="counter-box">
                  <span className="counter-box__val">1,400+</span>
                  <span className="counter-box__lbl">SKUs</span>
                </div>
                <div className="counter-box">
                  <span className="counter-box__val">3-STEP</span>
                  <span className="counter-box__lbl">CHECKOUT</span>
                </div>
                <div className="counter-box">
                  <span className="counter-box__val">AAA</span>
                  <span className="counter-box__lbl">ACCESSIBILITY</span>
                </div>
              </div>
            </div>

            <div className="bento-card__body">
              <div className="bento-card__meta">
                <span className="bento-tag bento-tag--crimson">E-COMMERCE</span>
                <span className="bento-tag bento-tag--subtle">04 // FOODWELOVE</span>
              </div>

              <h3 className="bento-card__title">Provenance-first artisanal marketplace.</h3>

              <p className="bento-card__desc">
                {foodwelove?.summary ||
                  'Faceted information architecture and multi-attribute taxonomy connecting regional Greek producers with discerning culinary customers.'}
              </p>

              <div className="bento-card__ooux">
                <span className="ooux-pill">E-COMMERCE</span>
                <span className="ooux-pill">FACETED IA</span>
                <span className="ooux-pill">DESIGN SYSTEM</span>
              </div>

              <a href="/work/food-we-love" className="bento-card__cta">
                Inspect case study <span className="cta-arrow">→</span>
              </a>
            </div>
          </motion.div>
        )}
      </div>

      <style>{`
        .bento-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--space-8, 32px);
          width: 100%;
        }

        /* ── Header ─────────────────────────────────────── */
        .bento-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-4, 16px);
          margin-bottom: var(--space-2, 8px);
        }

        .bento-header__text {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .bento-header__eyebrow {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-accent);
        }

        .bento-header__title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 1.8rem + 1.2vw, 2.8rem);
          font-weight: var(--weight-black, 900);
          letter-spacing: -0.03em;
          color: var(--color-text-main);
          line-height: 1.05;
        }

        /* ── Filter Pills ───────────────────────────────── */
        .bento-filter-pills {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .bento-filter-pill {
          padding: 6px 14px;
          background: rgba(18, 12, 14, 0.8);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-pill);
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .bento-filter-pill:hover {
          color: var(--color-text-main);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .bento-filter-pill.is-active {
          background: var(--color-accent);
          color: #ffffff;
          border-color: var(--color-accent);
          font-weight: 600;
          box-shadow: 0 0 12px rgba(238, 38, 38, 0.4);
        }

        /* ── 12-Column Grid ─────────────────────────────── */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 20px;
          width: 100%;
        }

        .bento-col-8 { grid-column: span 8; }
        .bento-col-6 { grid-column: span 6; }
        .bento-col-4 { grid-column: span 4; }
        .bento-col-12 { grid-column: span 12; }

        @media (max-width: 900px) {
          .bento-col-8,
          .bento-col-6,
          .bento-col-4,
          .bento-col-12 {
            grid-column: span 12;
          }
        }

        /* ── Bento Card Container ───────────────────────── */
        .bento-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-card);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .bento-card:hover {
          border-color: rgba(255, 255, 255, 0.16);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        }

        /* ── Previews ───────────────────────────────────── */
        .bento-preview {
          background: #090406;
          border-bottom: 1px solid var(--color-border);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .bento-preview__topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.08em;
        }

        .bento-preview__dot-label {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--color-text-faint);
        }

        .bento-preview__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-accent);
          display: inline-block;
        }

        .bento-preview__badge {
          color: var(--color-text-faint);
          padding: 2px 6px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-pill);
        }

        .bento-preview__headline-title {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text-main);
          letter-spacing: -0.01em;
        }

        /* MediPulse Preview Elements */
        .medipulse-kpis {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .kpi-box {
          background: rgba(22, 14, 17, 0.7);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .kpi-box__val {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 900;
          color: var(--color-text-main);
          line-height: 1;
        }

        .kpi-box__lbl {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.06em;
          color: var(--color-text-faint);
        }

        .medipulse-chart {
          height: 56px;
          display: flex;
          align-items: flex-end;
          gap: 6px;
          padding: 4px 8px;
          background: rgba(14, 8, 11, 0.6);
          border: 1px solid var(--color-border);
          border-radius: 8px;
        }

        .chart-bar {
          flex: 1;
          background: #3F3F46;
          border-radius: 2px 2px 0 0;
          transition: height 0.3s ease;
        }

        .chart-bar--crimson {
          background: var(--color-accent);
          box-shadow: 0 0 8px rgba(238, 38, 38, 0.5);
        }

        .medipulse-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          background: rgba(238, 38, 38, 0.1);
          border: 1px solid rgba(238, 38, 38, 0.3);
          border-radius: 6px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: #FF8585;
        }

        .medipulse-alert__dot {
          color: var(--color-accent);
          font-size: 10px;
        }

        /* HealthPulse Preview Elements */
        .healthpulse-dual-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .hp-card {
          border-radius: 8px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hp-card--crimson {
          background: #2A080D;
          border: 1px solid var(--color-accent);
        }

        .hp-card--obsidian {
          background: #120A0C;
          border: 1px solid var(--color-border);
        }

        .hp-card__icon {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--color-accent);
          margin-bottom: 4px;
        }

        .hp-card__title {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 700;
          color: var(--color-text-main);
        }

        .hp-card__sub {
          font-family: var(--font-mono);
          font-size: 9.5px;
          color: var(--color-text-muted);
        }

        /* AETHRA Preview Elements */
        .aethra-counters {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .counter-box {
          background: rgba(22, 14, 17, 0.7);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .counter-box__val {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 900;
          color: var(--color-text-main);
          line-height: 1;
        }

        .counter-box__lbl {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.06em;
          color: var(--color-text-faint);
        }

        .aethra-swatches {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 10px;
          background: rgba(14, 8, 11, 0.6);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          gap: 12px;
        }

        .swatch-strip {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .swatch {
          width: 24px;
          height: 18px;
          border-radius: 3px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .swatch-pill {
          font-family: var(--font-mono);
          font-size: 9.5px;
          color: var(--color-accent);
          padding: 2px 6px;
          background: rgba(238, 38, 38, 0.1);
          border: 1px solid rgba(238, 38, 38, 0.3);
          border-radius: var(--radius-pill);
        }

        /* ── Card Body & Typography ─────────────────────── */
        .bento-card__body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }

        .bento-card__meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .bento-tag {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .bento-tag--crimson {
          color: var(--color-accent);
        }

        .bento-tag--subtle {
          color: var(--color-text-faint);
        }

        .bento-card__title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--color-text-main);
          line-height: 1.2;
        }

        .bento-card__desc {
          font-family: var(--font-body);
          font-size: 13.5px;
          line-height: 1.6;
          color: var(--color-text-muted);
          margin-bottom: 4px;
        }

        .bento-card__ooux {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: auto;
          padding-top: 4px;
        }

        .ooux-pill {
          font-family: var(--font-mono);
          font-size: 9.5px;
          color: var(--color-text-faint);
          padding: 2px 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-pill);
          letter-spacing: 0.04em;
        }

        .bento-card__cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text-main);
          text-decoration: none;
          padding-top: 8px;
          transition: color 0.15s ease;
        }

        .bento-card__cta:hover {
          color: var(--color-accent);
        }

        .cta-arrow {
          transition: transform 0.15s ease;
        }

        .bento-card__cta:hover .cta-arrow {
          transform: translateX(4px);
        }

        /* ── Card 2: Editorial Specifics ─────────────────── */
        .bento-card--editorial {
          background: #110B0D;
        }

        .editorial-content {
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: 100%;
        }

        .editorial-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--color-text-main);
          line-height: 1.15;
        }

        .editorial-desc {
          font-family: var(--font-body);
          font-size: 13.5px;
          line-height: 1.65;
          color: var(--color-text-muted);
        }

        .editorial-rows {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-top: 8px;
          border-top: 1px solid var(--color-border);
        }

        .editorial-row {
          padding: 12px 0;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .row-num {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          color: var(--color-accent);
          letter-spacing: 0.04em;
        }

        .row-desc {
          font-family: var(--font-body);
          font-size: 12.5px;
          color: var(--color-text-muted);
        }

        /* ── 1984 Era Retro Overrides ─────────────────────── */
        [data-era="1984"] .bento-card,
        [data-era="1984"] .bento-filter-pill,
        [data-era="1984"] .kpi-box,
        [data-era="1984"] .medipulse-chart,
        [data-era="1984"] .medipulse-alert,
        [data-era="1984"] .hp-card,
        [data-era="1984"] .counter-box,
        [data-era="1984"] .aethra-swatches,
        [data-era="1984"] .ooux-pill,
        [data-era="1984"] .bento-preview__badge,
        [data-era="1984"] .swatch-pill {
          border-radius: 0px !important;
          border-color: #EE2626 !important;
          font-family: var(--font-mono) !important;
        }

        [data-era="1984"] .bento-card {
          background: #000000 !important;
        }
      `}</style>
    </div>
  );
}
