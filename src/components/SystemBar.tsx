/**
 * SystemBar.tsx — Header & Navigation Bar
 * React 19 island: client:load
 *
 * Implements EXACT Figma "Home · Desktop v2" (node-id="7:54"):
 *  - Border: 1px solid #ff1e56 (bottom border on full header)
 *  - Background: rgba(10, 10, 12, 0.75) with backdrop-blur(8px)
 *  - Identity (Left):
 *      - Logo: /images/fotisp-logo.png (44.57px x 48px)
 *      - Text: "Fotios Pastrakis" in JetBrains Mono 20px #f3f4f6
 *  - Segmented Navigation (Center):
 *      - Container: pill (border-radius: 999px), bg: #030304, border: 1px solid #ff1e56, p: 8px, gap: 16px
 *      - Active link: bg: #191b23, px: 16px, py: 8px, rounded: 999px, text: #f3f4f6 18px tracking: 0.54px
 *      - Inactive link: bg: transparent, px: 16px, py: 8px, text: #9ca3af 18px tracking: 0.54px
 *      - Links: Work (/#work), Research (/#research), Architecture (/#methodology), About (/about)
 *  - Call to Action (Right):
 *      - Primary Button: "Book a Call", bg-gradient to right (#fe113d to #56061a), border: 1px solid #fe113d,
 *        rounded: 999px, px: 24px, py: 16px, font: JetBrains Mono Bold 18px #f3f4f6
 *      - Smooth scroll to #contact-drawer and focus input
 *  - Integrated Controls:
 *      - 2026 / 1984 era toggle (Shift+Alt+E) & diagnostic (⇧⌥D) preserved seamlessly
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
  const [activeSection, setActiveSection] = useState<'work' | 'research' | 'architecture' | 'about'>('work');
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

    setIsGlitching(true);

    setTimeout(() => {
      setEra(next);
      document.documentElement.dataset.era = next;
      localStorage.setItem('fotisp-era', next);
      window.dispatchEvent(new CustomEvent('era-changed', { detail: { era: next } }));
    }, 150);

    setTimeout(() => {
      setIsGlitching(false);
    }, 300);
  }, [era]);

  // Diagnostic trigger handler
  const triggerDiagnostic = useCallback(() => {
    window.dispatchEvent(new CustomEvent('open-webdrift-installer'));
  }, []);

  // Global Keyboard Shortcuts: Shift+Alt+E, Shift+Alt+D & Shift+Alt+W
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInteractiveElement(document.activeElement)) return;

      // Shift+Alt+E: Toggle 1984 / 2026 era mode
      if (e.shiftKey && e.altKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        toggleEra();
      }

      // Shift+Alt+D: Trigger diagnostic
      if (e.shiftKey && e.altKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        triggerDiagnostic();
      }

      // Shift+Alt+W: Reset window positions
      if (e.shiftKey && e.altKey && (e.key === 'W' || e.key === 'w')) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('reset-windows'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleEra, triggerDiagnostic]);

  // Section observer to update active nav pill
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkActiveSection = () => {
      const pathname = window.location.pathname;
      if (pathname === '/about' || pathname === '/about/') {
        setActiveSection('about');
        return;
      }

      const methodEl = document.getElementById('methodology');
      const researchEl = document.getElementById('research');
      const workEl = document.getElementById('work');

      if (methodEl) {
        const rect = methodEl.getBoundingClientRect();
        if (rect.top <= 250 && rect.bottom >= 100) {
          setActiveSection('architecture');
          return;
        }
      }

      if (researchEl) {
        const rect = researchEl.getBoundingClientRect();
        if (rect.top <= 250 && rect.bottom >= 100) {
          setActiveSection('research');
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

      setActiveSection('work');
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
        setActiveSection(id === 'methodology' ? 'architecture' : (id as any));
      }
    }
  };

  // CTA button click handler -> scrolls to contact drawer
  const handleBookCall = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === 'undefined') return;
    const isHomePage = window.location.pathname === '/' || window.location.pathname === '';
    const el = document.getElementById('contact-drawer');

    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', '#contact-drawer');
      const input = document.getElementById('contact-name');
      if (input) input.focus();
    } else if (!isHomePage) {
      e.preventDefault();
      window.location.href = '/#contact-drawer';
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

      <header className="systembar" role="banner" aria-label="System floating navigation" data-node-id="7:54">
        <div className="systembar__inner" data-node-id="7:55">
          {/* Identity & Brand (data-node-id="7:56") */}
          <a href="/" className="systembar__brand" aria-label="Fotios Pastrakis — homepage">
            <div className="systembar__brand-logo-wrap" data-node-id="32:5">
              <img
                src="/images/fotisp-logo.png"
                alt="Fotios Pastrakis Logo"
                className="systembar__brand-logo"
                width={44}
                height={48}
                data-node-id="32:6"
              />
            </div>
            <span className="systembar__brand-text" data-node-id="33:8">
              Fotios Pastrakis
            </span>
          </a>

          {/* Segmented Navigation (data-node-id="7:59") */}
          <nav className="systembar__nav" aria-label="Primary navigation" data-node-id="7:59">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={clsx('systembar__nav-link', isActive && 'is-active')}
                  onClick={(e) => handleNavClick(e, link.href)}
                  aria-current={isActive ? 'page' : undefined}
                  data-name="Navigation item"
                >
                  <span className="systembar__nav-text">{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Actions & Utilities (Right) */}
          <div className="systembar__actions">
            {/* Primary Action Button (data-node-id="33:13") */}
            <a
              href="/#contact-drawer"
              className="systembar__cta-btn"
              onClick={handleBookCall}
              data-node-id="33:13"
              data-name="Button / Primary"
            >
              <span className="systembar__cta-text" data-node-id="33:14">
                Book a Call
              </span>
            </a>

            {/* Compact Era & Diagnostic Controls */}
            <div className="systembar__utilities" aria-label="System utilities">
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
        </div>
      </header>
    </>
  );
}
