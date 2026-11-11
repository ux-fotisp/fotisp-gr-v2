/**
 * SystemBar.tsx — Vintage 1984 OS menu bar
 * React 19 island: client:load
 *
 * Features:
 *   - File / Edit / View / Special dropdown menus with keyboard navigation
 *   - 1984 ↔ 2026 era toggle: writes data-era to <html>
 *   - Live clock — Thessaloniki time (Europe/Athens)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { clsx } from 'clsx';

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

// ── Menu definitions ────────────────────────────────────────────────

function buildMenus(navigateTo: (path: string) => void): Menu[] {
  return [
    {
      id: 'file',
      label: 'File',
      items: [
        { label: 'Open Portfolio', shortcut: '⌘O', action: () => navigateTo('/') },
        { label: 'Open Case Study', shortcut: '⌘K', disabled: true },
        { divider: true, label: '---' },
        { label: 'Work', action: () => navigateTo('/work') },
        { label: 'About', action: () => navigateTo('/about') },
        { divider: true, label: '---' },
        { label: 'Get in Touch', shortcut: '⌘M', action: () => {
          document.getElementById('contact-drawer')?.focus();
        }},
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        { label: 'Copy Email', shortcut: '⌘C', action: () => {
          navigator.clipboard?.writeText('fotis@fotisp.gr');
        }},
        { label: 'Copy LinkedIn URL', action: () => {
          navigator.clipboard?.writeText('https://linkedin.com/in/fotisp');
        }},
        { divider: true, label: '---' },
        { label: 'Find on Page', shortcut: '⌘F', action: () => {
          (document.getElementById('main-content') as HTMLElement)?.focus();
        }},
      ],
    },
    {
      id: 'view',
      label: 'View',
      items: [
        { label: 'All Case Studies', action: () => navigateTo('/work') },
        { label: 'Publications', action: () => navigateTo('/#publications') },
        { label: 'Services', action: () => navigateTo('/#services') },
        { divider: true, label: '---' },
        { label: 'Source on GitHub', action: () => {
          window.open('https://github.com/fotisp', '_blank', 'noopener');
        }},
      ],
    },
    {
      id: 'special',
      label: 'Special',
      items: [
        { label: 'Toggle 1984 Mode', shortcut: '⌘E', action: () => {/* handled by EraToggle */ } },
        { divider: true, label: '---' },
        { label: 'Restart Desktop', action: () => window.location.reload() },
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
      title="Thessaloniki local time"
    >
      Thessaloniki [{time}]
    </span>
  );
}

// ── Era Toggle ────────────────────────────────────────────────────────

function EraToggle() {
  const [era, setEra] = useState<'2026' | '1984'>('2026');

  useEffect(() => {
    const stored = localStorage.getItem('fp-era') as '1984' | '2026' | null;
    if (stored) {
      setEra(stored);
      document.documentElement.dataset.era = stored;
    }
  }, []);

  const toggle = useCallback(() => {
    const next = era === '2026' ? '1984' : '2026';
    setEra(next);
    document.documentElement.dataset.era = next;
    localStorage.setItem('fp-era', next);
  }, [era]);

  // Keyboard shortcut ⌘E / Ctrl+E
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle]);

  return (
    <button
      className={clsx('systembar__era-toggle', era === '1984' && 'is-retro')}
      onClick={toggle}
      aria-pressed={era === '1984'}
      aria-label={`Switch to ${era === '2026' ? '1984' : '2026'} era`}
      title={`${era === '2026' ? 'Enable' : 'Disable'} 1984 mode (⌘E)`}
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
  const [focusIdx, setFocusIdx] = useState(0);

  const items = menu.items.filter(it => !it.divider);

  useEffect(() => {
    if (isOpen) {
      setFocusIdx(0);
      // Focus first item after render
      requestAnimationFrame(() => {
        const first = listRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled])');
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
      onClose();
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
      <button
        ref={triggerRef}
        className={clsx('systembar__menu-trigger', isOpen && 'is-open')}
        onClick={() => isOpen ? onClose() : onOpen()}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={`menu-${menu.id}`}
        id={`menu-trigger-${menu.id}`}
      >
        {menu.label}
      </button>

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

  const navigateTo = useCallback((path: string) => {
    window.location.href = path;
  }, []);

  const menus = buildMenus(navigateTo);

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

  // Close on Escape globally
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const getAdjacentMenu = (id: string, direction: 'prev' | 'next') => {
    const idx = menus.findIndex(m => m.id === id);
    if (idx < 0) return null;
    const nextIdx = direction === 'next'
      ? (idx + 1) % menus.length
      : (idx - 1 + menus.length) % menus.length;
    return menus[nextIdx].id;
  };

  return (
    <header className="systembar" role="banner" aria-label="System menu bar">
      {/* Apple-logo equivalent: wordmark */}
      <a href="/" className="systembar__wordmark" aria-label="Fotis Pastrakis — home">
        fp
      </a>

      {/* Menus */}
      <nav className="systembar__menus" aria-label="Main menu">
        {menus.map(menu => (
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

      {/* Right side controls */}
      <div className="systembar__controls" aria-label="System controls">
        <EraToggle />
        <Clock />
      </div>
    </header>
  );
}
