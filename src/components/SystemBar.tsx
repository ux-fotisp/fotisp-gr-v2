/**
 * SystemBar.tsx — Vintage 1984 OS menu bar
 * React 19 island: client:load
 *
 * Features:
 *   - File / Edit / View / Special dropdown menus with full keyboard navigation
 *   - Shift+Alt+E (⇧⌥E) 1984 ↔ 2026 era toggle (ignoring input/textarea/select)
 *   - Run System Diagnostic (⇧⌥D) triggering WebdriftInstaller modal
 *   - Live clock — Thessaloniki time (Europe/Athens)
 *   - Uses 'fotisp-era' in localStorage
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticTarget from './MagneticTarget';

// ── Types ───────────────────────────────────────────────────────────

interface MenuItem {
  label: string;
  shortcut?: string;
  divider?: boolean;
  disabled?: boolean;
  href?: string;
  action?: () => void;
}

interface Menu {
  id: string;
  label: string;
  items: MenuItem[];
}

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

// ── Menu definitions ────────────────────────────────────────────────

function buildMenus(
  navigateTo: (path: string) => void,
  triggerEraToggle: () => void,
  triggerDiagnostic: () => void
): Menu[] {
  return [
    {
      id: 'file',
      label: 'File',
      items: [
        { label: 'Open Portfolio (Home)', shortcut: '⌘O', action: () => navigateTo('/') },
        { label: 'Case Studies Directory', shortcut: '⌘W', action: () => navigateTo('/work') },
        { divider: true, label: '---' },
        { label: 'About & Career Timeline', action: () => navigateTo('/about') },
        {
          label: 'Contact Terminal',
          shortcut: '⌘M',
          action: () => {
            const drawer = document.getElementById('contact-drawer');
            if (drawer) {
              drawer.scrollIntoView({ behavior: 'smooth' });
              drawer.focus();
            } else {
              navigateTo('/about#contact-drawer');
            }
          },
        },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        {
          label: 'Copy Direct Email',
          shortcut: '⌘C',
          action: () => {
            navigator.clipboard?.writeText('fotispastrakis@gmail.com');
          },
        },
        {
          label: 'Copy LinkedIn Profile',
          action: () => {
            navigator.clipboard?.writeText('https://www.linkedin.com/in/fotispastrakis');
          },
        },
        { divider: true, label: '---' },
        {
          label: 'Focus Main Content',
          shortcut: '⌘F',
          action: () => {
            (document.getElementById('main-content') as HTMLElement)?.focus();
          },
        },
      ],
    },
    {
      id: 'view',
      label: 'View',
      items: [
        { label: 'Clinical Systems (MediPulse)', action: () => navigateTo('/work/medipulse') },
        { label: 'CityOps & Open EU Data (AETHRA)', action: () => navigateTo('/work/aethra') },
        { label: 'Calm Health Tech (HealthPulse)', action: () => navigateTo('/work/healthpulse') },
        { label: 'Faceted E-Tailer (FoodWeLove)', action: () => navigateTo('/work/food-we-love') },
        { divider: true, label: '---' },
        {
          label: 'Reset Window Positions',
          action: () => {
            window.dispatchEvent(new CustomEvent('reset-windows'));
          },
        },
        { divider: true, label: '---' },
        {
          label: 'Publications & DOI Links',
          action: () => {
            const pubEl = document.getElementById('publications');
            if (pubEl) pubEl.scrollIntoView({ behavior: 'smooth' });
            else navigateTo('/#publications');
          },
        },
        {
          label: 'GitHub Codebase',
          action: () => {
            window.open('https://github.com/ux-fotisp/fotisp-gr-v2', '_blank', 'noopener');
          },
        },
      ],
    },
    {
      id: 'special',
      label: 'Special',
      items: [
        {
          label: 'Run System Diagnostic',
          shortcut: '⇧⌥D',
          action: triggerDiagnostic,
        },
        {
          label: 'Toggle 1984 Macintosh Mode',
          shortcut: '⇧⌥E',
          action: triggerEraToggle,
        },
        { divider: true, label: '---' },
        { label: 'Re-initialise Desktop', action: () => window.location.reload() },
        { label: 'Empty Trash', action: () => navigateTo('/404') },
      ],
    },
  ];
}

// ── Clock ────────────────────────────────────────────────────────────

function Clock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('el-GR', {
      timeZone: 'Europe/Athens',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="systembar__clock"
      aria-label={`Local time in Thessaloniki: ${time}`}
      title="Thessaloniki local time (Europe/Athens)"
    >
      <span className="systembar__clock-city">Thessaloniki </span>
      <span className="systembar__clock-time">[{time}]</span>
    </span>
  );
}

// ── Era Toggle ────────────────────────────────────────────────────────

function EraToggle({ onToggle }: { onToggle: () => void }) {
  const [era, setEra] = useState<'2026' | '1984'>('2026');

  const syncFromDom = useCallback(() => {
    const current = (document.documentElement.dataset.era as '1984' | '2026') || '2026';
    setEra(current);
  }, []);

  useEffect(() => {
    const stored = (localStorage.getItem('fotisp-era') as '1984' | '2026' | null) || '2026';
    setEra(stored);
    document.documentElement.dataset.era = stored;

    document.addEventListener('astro:after-swap', syncFromDom);
    return () => {
      document.removeEventListener('astro:after-swap', syncFromDom);
    };
  }, [syncFromDom]);

  return (
    <button
      className={clsx('systembar__era-toggle', era === '1984' && 'is-retro')}
      onClick={onToggle}
      aria-pressed={era === '1984'}
      aria-label={`Switch to ${era === '2026' ? '1984' : '2026'} era (Shift+Alt+E)`}
      title={`${era === '2026' ? 'Enable' : 'Disable'} 1984 Macintosh Dithering (⇧⌥E)`}
    >
      {era === '2026' ? '1984' : '2026'}
    </button>
  );
}

// ── Dropdown ─────────────────────────────────────────────────────────

interface DropdownProps {
  menu: Menu;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

function Dropdown({ menu, isOpen, onOpen, onClose, onNavigate }: DropdownProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        const first = listRef.current?.querySelector<HTMLElement>(
          '[role="menuitem"]:not([aria-disabled])'
        );
        first?.focus();
      });
    }
  }, [isOpen]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      onOpen();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onNavigate('prev');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      onNavigate('next');
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleItemKeyDown = (e: React.KeyboardEvent, item: MenuItem, idx: number) => {
    const enabledItems = menu.items
      .map((it, i) => ({ it, i }))
      .filter(({ it }) => !it.divider && !it.disabled);
    const pos = enabledItems.findIndex(({ i }) => i === idx);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = enabledItems[(pos + 1) % enabledItems.length];
      listRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]')[next.i]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = enabledItems[(pos - 1 + enabledItems.length) % enabledItems.length];
      listRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]')[prev.i]?.focus();
    } else if (e.key === 'Escape') {
      onClose();
      triggerRef.current?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onClose();
      onNavigate('prev');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      onNavigate('next');
    } else if (e.key === 'Tab') {
      onClose();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (item.action) item.action();
      if (item.href) window.location.href = item.href;
      onClose();
      triggerRef.current?.focus();
    }
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.disabled) return;
    if (item.action) item.action();
    if (item.href) window.location.href = item.href;
    onClose();
  };

  return (
    <div className="systembar__menu" data-open={isOpen || undefined}>
      <MagneticTarget radius={20} strength={0.2} maxOffset={4}>
        <button
          ref={triggerRef}
          className={clsx('systembar__menu-trigger', isOpen && 'is-open')}
          onClick={() => (isOpen ? onClose() : onOpen())}
          onKeyDown={handleTriggerKeyDown}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls={`menu-${menu.id}`}
          id={`menu-trigger-${menu.id}`}
        >
          {menu.label}
        </button>
      </MagneticTarget>

      {isOpen && (
        <ul
          ref={listRef}
          id={`menu-${menu.id}`}
          role="menu"
          aria-labelledby={`menu-trigger-${menu.id}`}
          className="systembar__dropdown"
        >
          {menu.items.map((item, idx) =>
            item.divider ? (
              <li key={idx} role="separator" className="systembar__divider" />
            ) : (
              <li key={idx} role="none">
                <button
                  role="menuitem"
                  className="systembar__item"
                  aria-disabled={item.disabled || undefined}
                  tabIndex={-1}
                  onClick={() => handleItemClick(item)}
                  onKeyDown={(e) => handleItemKeyDown(e, item, idx)}
                >
                  <span className="systembar__item-label">{item.label}</span>
                  {item.shortcut && (
                    <kbd className="systembar__item-kbd">{item.shortcut}</kbd>
                  )}
                </button>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}

// ── Main SystemBar ───────────────────────────────────────────────────

export default function SystemBar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isGlitching, setIsGlitching] = useState(false);

  const navigateTo = useCallback((path: string) => {
    window.location.href = path;
  }, []);

  const toggleEra = useCallback(() => {
    const current = (document.documentElement.dataset.era as '1984' | '2026') || '2026';
    const next = current === '2026' ? '1984' : '2026';

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      document.documentElement.dataset.era = next;
      localStorage.setItem('fotisp-era', next);
      window.dispatchEvent(new CustomEvent('era-changed', { detail: { era: next } }));
      return;
    }

    // 1. Mount hardware glitch overlay immediately
    setIsGlitching(true);

    // 2. Perform DOM dataset swap at midpoint (150ms)
    setTimeout(() => {
      document.documentElement.dataset.era = next;
      localStorage.setItem('fotisp-era', next);
      window.dispatchEvent(new CustomEvent('era-changed', { detail: { era: next } }));
    }, 150);

    // 3. Dismount glitch overlay at 300ms
    setTimeout(() => {
      setIsGlitching(false);
    }, 300);
  }, []);

  const triggerDiagnostic = useCallback(() => {
    window.dispatchEvent(new CustomEvent('open-webdrift-installer'));
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Ignore if active element is an input, textarea, select, or editable
      if (isInteractiveElement(document.activeElement)) return;

      // 2. Shift+Alt+E: Toggle 1984 / 2026 era mode
      if (e.shiftKey && e.altKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        toggleEra();
        return;
      }

      // 3. Shift+Alt+D: Run System Diagnostic (guarded against browser bookmark collision)
      if (e.shiftKey && e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        triggerDiagnostic();
        return;
      }

      // 4. Escape: Close open menus
      if (e.key === 'Escape') {
        setOpenMenu(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleEra, triggerDiagnostic]);

  const menus = buildMenus(navigateTo, toggleEra, triggerDiagnostic);

  // Close on outside click
  useEffect(() => {
    if (!openMenu) return;
    const handler = (e: MouseEvent) => {
      const bar = document.querySelector('.systembar');
      if (bar && !bar.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenu]);

  const getAdjacentMenu = (id: string, direction: 'prev' | 'next') => {
    const idx = menus.findIndex((m) => m.id === id);
    if (idx < 0) return null;
    const nextIdx =
      direction === 'next'
        ? (idx + 1) % menus.length
        : (idx - 1 + menus.length) % menus.length;
    return menus[nextIdx].id;
  };

  return (
    <>
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

      <header className="systembar" role="banner" aria-label="System menu bar">
        {/* Wordmark logo */}
        <a href="/" className="systembar__wordmark" aria-label="Fotis Pastrakis — home">
          fp
        </a>

        {/* Desktop Menus */}
        <nav className="systembar__menus" aria-label="Main menu">
          {menus.map((menu) => (
            <Dropdown
              key={menu.id}
              menu={menu}
              isOpen={openMenu === menu.id}
              onOpen={() => setOpenMenu(menu.id)}
              onClose={() => setOpenMenu(null)}
              onNavigate={(dir) => {
                const adj = getAdjacentMenu(menu.id, dir);
                if (adj) setOpenMenu(adj);
              }}
            />
          ))}
        </nav>

        {/* Mobile Combined Menu Dropdown */}
        <nav className="systembar__mobile-menu" aria-label="Mobile navigation menu">
          <Dropdown
            menu={{
              id: 'mobile-main',
              label: 'Menu',
              items: menus.flatMap((m) => [
                { label: `── ${m.label.toUpperCase()} ──`, disabled: true },
                ...m.items,
              ]),
            }}
            isOpen={openMenu === 'mobile-main'}
            onOpen={() => setOpenMenu('mobile-main')}
            onClose={() => setOpenMenu(null)}
            onNavigate={() => {}}
          />
        </nav>

        {/* Right side controls */}
        <div className="systembar__controls" aria-label="System controls">
          <EraToggle onToggle={toggleEra} />
          <Clock />
        </div>
      </header>
    </>
  );
}
