/**
 * SystemBar.tsx — Floating Pill Navigation Header
 * React 19 island: client:load
 *
 * Implements Stage 11 Design System Alignment:
 *  - Left Brand: Crimson square badge [FP] (radius 6px) + fotisp.gr wordmark linking to /
 *  - Center Floating Pill Nav: Glassmorphic dark container with Start (/#top),
 *    Selected work (/#work), Methodology (/#methodology), About (/about)
 *  - Highlight active route/section with subtle elevated pill surface
 *  - Mobile (< 768px): 2-row layout with full-width scrollable pill nav, 0 horizontal overflow
 *  - Right Status & Controls: Availability status pill (pulsing dot) + compact 2026 / 1984 era toggle (Shift+Alt+E)
 *    and diagnostic trigger (⇧⌥D)
 */

import { useState, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '../config/site';

function isInteractiveElement(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    (el as HTMLElement).isContentEditable
  );
}

export default function SystemBar() {
  const [era, setEra] = useState<'2026' | '1984'>('2026');
  const [activeSection, setActiveSection] = useState<'top' | 'work' | 'methodology' | 'about'>('top');
  const [isGlitching, setIsGlitching] = useState(false);

  // Sync era state from DOM and localStorage
  const syncEra = useCallback(() => {
    if (typeof document === 'undefined') return;
    const current = (document.documentElement.dataset.era as '1984' | '2026') || '2026';
    setEra(current);
  }, []);

  useEffect(() => {
    const stored = (localStorage.getItem('fotisp-era') as '1984' | '2026' | null) || '2026';
    setEra(stored);
    document.documentElement.dataset.era = stored;

    document.addEventListener('astro:after-swap', syncEra);
    document.addEventListener('astro:page-load', syncEra);
    return () => {
      document.removeEventListener('astro:after-swap', syncEra);
      document.removeEventListener('astro:page-load', syncEra);
    };
  }, [syncEra]);

  // Era toggle handler with glitch overlay
  const toggleEra = useCallback(() => {
    const next = era === '2026' ? '1984' : '2026';

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setEra(next);
      document.documentElement.dataset.era = next;
      localStorage.setItem('fotisp-era', next);
      window.dispatchEvent(new CustomEvent('era-changed', { detail: { era: next } }));
      return;
    }

    // 1. Mount hardware glitch overlay immediately
    setIsGlitching(true);

    // 2. Perform DOM dataset swap at midpoint (150ms)
    setTimeout(() => {
      setEra(next);
      document.documentElement.dataset.era = next;
      localStorage.setItem('fotisp-era', next);
      window.dispatchEvent(new CustomEvent('era-changed', { detail: { era: next } }));
    }, 150);

    // 3. Dismount glitch overlay at 300ms
    setTimeout(() => {
      setIsGlitching(false);
    }, 300);
  }, [era]);

  // Diagnostic trigger handler
  const triggerDiagnostic = useCallback(() => {
    window.dispatchEvent(new CustomEvent('open-webdrift-installer'));
  }, []);

  // Global Keyboard Shortcuts: Shift+Alt+E & Shift+Alt+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInteractiveElement(document.activeElement)) return;

      // Shift+Alt+E: Toggle 1984 / 2026 era mode
      if (e.shiftKey && e.altKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        toggleEra();
        return;
      }

      // Shift+Alt+D: Run System Diagnostic
      if (e.shiftKey && e.altKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        triggerDiagnostic();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleEra, triggerDiagnostic]);

  // Track active section on scroll & path
  useEffect(() => {
    const checkActiveSection = () => {
      if (typeof window === 'undefined') return;
      const pathname = window.location.pathname;

      if (pathname.includes('/about')) {
        setActiveSection('about');
        return;
      }

      const scrollY = window.scrollY;
      const methodologyEl = document.getElementById('methodology');
      const workEl = document.getElementById('work');

      if (methodologyEl) {
        const rect = methodologyEl.getBoundingClientRect();
        if (rect.top <= 250 && rect.bottom >= 100) {
          setActiveSection('methodology');
          return;
        }
      }

      if (workEl) {
        const rect = workEl.getBoundingClientRect();
        if (rect.top <= 250 && rect.bottom >= 100) {
          setActiveSection('work');
          return;
        }
      }

      if (scrollY < 350) {
        setActiveSection('top');
      }
    };

    checkActiveSection();
    window.addEventListener('scroll', checkActiveSection, { passive: true });
    window.addEventListener('popstate', checkActiveSection);
    document.addEventListener('astro:page-load', checkActiveSection);

    return () => {
      window.removeEventListener('scroll', checkActiveSection);
      window.removeEventListener('popstate', checkActiveSection);
      document.removeEventListener('astro:page-load', checkActiveSection);
    };
  }, []);

  // Smooth scroll handler for anchor links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (typeof window === 'undefined') return;
    const isHomePage = window.location.pathname === '/' || window.location.pathname === '';

    if (isHomePage && targetId !== '/about') {
      const id = targetId.replace('/#', '').replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${id}`);
        setActiveSection(id as any);
      }
    }
  };

  const navLinks = siteConfig.navLinks;

  return (
    <>
      {/* Glitch Overlay for Hardware Era Switch */}
      <AnimatePresence>
        {isGlitching && (
          <motion.div
            key="era-glitch-overlay"
            className="era-glitch-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.08 }}
            aria-hidden="true"
          >
            <div className="era-glitch-scanlines" />
            <div className="era-glitch-noise" />
            <div className="era-glitch-flash" />
          </motion.div>
        )}
      </AnimatePresence>

      <header className="systembar" role="banner" aria-label="System floating navigation">
        <div className="systembar__inner">
          {/* Mobile Top Row (< 768px) */}
          <div className="systembar__mobile-top">
            <a href="/" className="systembar__brand" aria-label={`${siteConfig.brand.name} — homepage`}>
              <span className="systembar__brand-badge">[FP]</span>
              <span className="systembar__brand-text">{siteConfig.brand.name}</span>
            </a>

            <div className="systembar__controls" aria-label="System status & controls">
              <span className="systembar__status-pill" title={`Status: ${siteConfig.availability.status}`}>
                <span className="systembar__status-dot" aria-hidden="true" />
                <span className="systembar__status-text-full">{siteConfig.availability.status}</span>
                <span className="systembar__status-text-compact">{siteConfig.availability.statusCompact}</span>
              </span>

              <button
                type="button"
                className="systembar__era-btn"
                onClick={toggleEra}
                aria-label={`Toggle era: current ${era} (Shift+Alt+E)`}
                title={`Switch era to ${era === '2026' ? '1984' : '2026'} (Shift+Alt+E)`}
              >
                <span className={clsx('systembar__era-opt', era === '2026' && 'is-active')}>2026</span>
                <span className="systembar__era-sep">/</span>
                <span className={clsx('systembar__era-opt', era === '1984' && 'is-active')}>1984</span>
              </button>

              <button
                type="button"
                className="systembar__diag-btn"
                onClick={triggerDiagnostic}
                aria-label="Run System Diagnostic (⇧⌥D)"
                title="Run System Diagnostic (⇧⌥D)"
              >
                ⇧⌥D
              </button>
            </div>
          </div>

          {/* Desktop Left Brand */}
          <a href="/" className="systembar__brand" aria-label={`${siteConfig.brand.name} — homepage`}>
            <span className="systembar__brand-badge">[FP]</span>
            <span className="systembar__brand-text">{siteConfig.brand.name}</span>
          </a>

          {/* Center Floating Pill Nav (Row 2 on mobile) */}
          <nav className="systembar__nav" aria-label="Primary navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={clsx('systembar__nav-link', isActive && 'is-active')}
                  onClick={(e) => handleNavClick(e, link.href)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop Right Controls */}
          <div className="systembar__controls" aria-label="System status & controls">
            <span className="systembar__status-pill" title={`Status: ${siteConfig.availability.status}`}>
              <span className="systembar__status-dot" aria-hidden="true" />
              <span className="systembar__status-text-full">{siteConfig.availability.status}</span>
            </span>

            <button
              type="button"
              className="systembar__era-btn"
              onClick={toggleEra}
              aria-label={`Toggle era: current ${era} (Shift+Alt+E)`}
              title={`Switch era to ${era === '2026' ? '1984' : '2026'} (Shift+Alt+E)`}
            >
              <span className={clsx('systembar__era-opt', era === '2026' && 'is-active')}>2026</span>
              <span className="systembar__era-sep">/</span>
              <span className={clsx('systembar__era-opt', era === '1984' && 'is-active')}>1984</span>
            </button>

            <button
              type="button"
              className="systembar__diag-btn"
              onClick={triggerDiagnostic}
              aria-label="Run System Diagnostic (⇧⌥D)"
              title="Run System Diagnostic (⇧⌥D)"
            >
              ⇧⌥D
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
