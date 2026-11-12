/**
 * SplitButton.tsx — EDGE Design System Split Action Button
 * React 19 island with Framer Motion dropdown reveal.
 *
 * Requirements:
 * - Primary action button (`[ BOOK A CALL ]` by default) that scrolls to #contact-drawer and focuses contact-name.
 * - Secondary attached dropdown arrow (`[ v ]`) separated by a `--border-1bit` (`1px solid #EE2626`).
 * - Framer Motion dropdown animation (`animate={{ height: isOpen ? 'auto' : 0 }}`).
 * - Solid `#080303` background, `--color-accent` (`#EE2626`) text, and stark 1px crimson borders.
 * - Solid `#EE2626` hover state that inverts text color to `#080303` (Obsidian).
 * - Dropdown items include `Copy Email (fotispastrakis@gmail.com)` with live `[ COPIED ]` feedback state.
 * - Keyboard navigation (Escape to close, Tab / arrow focus).
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SplitButtonItem {
  label: string;
  href?: string;
  action?: () => void;
  shortcut?: string;
  icon?: string;
  copyText?: string;
  target?: string;
  rel?: string;
}

export interface SplitButtonProps {
  primaryLabel?: string;
  primaryHref?: string;
  onPrimaryClick?: () => void;
  items?: SplitButtonItem[];
  className?: string;
  align?: 'left' | 'right';
  id?: string;
}

const DEFAULT_ITEMS: SplitButtonItem[] = [
  {
    label: 'Copy Email (fotispastrakis@gmail.com)',
    copyText: 'fotispastrakis@gmail.com',
    icon: '📋',
    shortcut: 'CPY',
  },
  {
    label: 'Explore Case Studies (/work)',
    href: '/work',
    icon: '↗',
    shortcut: 'WRK',
  },
  {
    label: 'LinkedIn Profile',
    href: 'https://www.linkedin.com/in/fotispastrakis',
    target: '_blank',
    rel: 'noopener noreferrer',
    icon: '↗',
    shortcut: 'LNK',
  },
];

export default function SplitButton({
  primaryLabel = '[ BOOK A CALL ]',
  primaryHref = '#contact-drawer',
  onPrimaryClick,
  items = DEFAULT_ITEMS,
  className = '',
  align = 'left',
  id,
}: SplitButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handlePrimaryClick = (e: React.MouseEvent) => {
    if (onPrimaryClick) {
      onPrimaryClick();
    } else if (primaryHref) {
      if (primaryHref.startsWith('#')) {
        const el = document.querySelector(primaryHref);
        el?.scrollIntoView({ behavior: 'smooth' });
        // Smoothly focus contact-name input
        if (primaryHref === '#contact-drawer') {
          setTimeout(() => {
            const nameInput = document.getElementById('contact-name') as HTMLInputElement | null;
            nameInput?.focus();
          }, 350);
        }
      } else {
        window.location.href = primaryHref;
      }
    }
  };

  const handleItemClick = (item: SplitButtonItem) => {
    if (item.copyText || item.label.toLowerCase().includes('copy email')) {
      const emailToCopy = item.copyText || 'fotispastrakis@gmail.com';
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(emailToCopy);
      }
      setCopiedItem(item.label);
      setTimeout(() => {
        setCopiedItem(null);
        setIsOpen(false);
      }, 1200);
      return;
    }

    setIsOpen(false);
    if (item.action) {
      item.action();
    } else if (item.href) {
      if (item.target === '_blank' || item.href.startsWith('http')) {
        window.open(item.href, '_blank', 'noopener,noreferrer');
      } else if (item.href.startsWith('mailto:')) {
        window.location.href = item.href;
      } else if (item.href.startsWith('#')) {
        const el = document.querySelector(item.href);
        el?.scrollIntoView({ behavior: 'smooth' });
        if (item.href === '#contact-drawer') {
          setTimeout(() => {
            const nameInput = document.getElementById('contact-name') as HTMLInputElement | null;
            nameInput?.focus();
          }, 350);
        }
      } else {
        window.location.href = item.href;
      }
    }
  };

  return (
    <div
      ref={containerRef}
      id={id}
      className={`edge-split-btn-group ${className}`}
      style={{
        display: 'inline-flex',
        position: 'relative',
        verticalAlign: 'middle',
      }}
    >
      {/* Primary Action Button */}
      {primaryHref && !onPrimaryClick ? (
        <a
          href={primaryHref}
          onClick={handlePrimaryClick}
          className="edge-split-btn edge-split-btn--primary u-mono u-text-xs"
        >
          {primaryLabel}
        </a>
      ) : (
        <button
          type="button"
          onClick={handlePrimaryClick}
          className="edge-split-btn edge-split-btn--primary u-mono u-text-xs"
        >
          {primaryLabel}
        </button>
      )}

      {/* Secondary Toggle ([ v ]) separated by 1px solid #EE2626 */}
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Additional actions"
        className={`edge-split-btn edge-split-btn--toggle u-mono u-text-xs ${
          isOpen ? 'edge-split-btn--open' : ''
        }`}
      >
        <span aria-hidden="true" style={{ fontSize: '11px', letterSpacing: '-0.5px' }}>
          {isOpen ? '[ ^ ]' : '[ v ]'}
        </span>
      </button>

      {/* Animated Dropdown Menu with Framer Motion height reveal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`edge-split-dropdown u-window ${
              align === 'right' ? 'edge-split-dropdown--right' : ''
            }`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
            role="menu"
          >
            {/* 1-Bit OS Mini Titlebar */}
            <div className="edge-split-dropdown__titlebar u-window-titlebar">
              <span className="u-mono u-text-xs u-text-faint">
                actions_menu.exe
              </span>
              <span className="u-mono u-text-xs u-text-accent">
                [ESC]
              </span>
            </div>

            <ul className="edge-split-dropdown__list">
              {items.map((item, idx) => {
                const isItemCopied = copiedItem === item.label;
                return (
                  <li key={idx} role="none">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleItemClick(item)}
                      className={`edge-split-dropdown__item u-mono u-text-xs ${
                        isItemCopied ? 'edge-split-dropdown__item--copied' : ''
                      }`}
                    >
                      <span className="edge-split-dropdown__item-label">
                        {item.icon && <span style={{ marginRight: '6px' }}>{item.icon}</span>}
                        {isItemCopied ? '[ COPIED TO CLIPBOARD ]' : item.label}
                      </span>
                      {item.shortcut && !isItemCopied && (
                        <kbd className="edge-split-dropdown__kbd u-mono u-text-xs">
                          {item.shortcut}
                        </kbd>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .edge-split-btn-group {
          font-family: var(--font-mono);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }

        .edge-split-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 38px;
          padding: 0 var(--space-4);
          background-color: #080303;
          color: var(--color-accent);
          border: 1px solid var(--color-accent);
          text-decoration: none;
          font-weight: var(--weight-bold);
          letter-spacing: var(--tracking-wide);
          cursor: pointer;
          transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
          user-select: none;
        }

        .edge-split-btn--primary {
          border-right: none;
        }

        .edge-split-btn--toggle {
          padding: 0 var(--space-3);
          border-left: 1px solid var(--color-accent);
        }

        /* Solid #EE2626 hover state that inverts text color to #080303 */
        .edge-split-btn:hover,
        .edge-split-btn:focus-visible,
        .edge-split-btn--open {
          background-color: #EE2626 !important;
          color: #080303 !important;
          outline: none;
        }

        .edge-split-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          min-width: 280px;
          background-color: #080303;
          border: 1px solid var(--color-accent);
          z-index: 1000;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.85);
        }

        .edge-split-dropdown--right {
          left: auto;
          right: 0;
        }

        .edge-split-dropdown__titlebar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px var(--space-3);
          background-color: #0d0405;
          border-bottom: 1px solid var(--color-accent);
          height: 24px;
        }

        .edge-split-dropdown__list {
          list-style: none;
          margin: 0;
          padding: 4px 0;
        }

        .edge-split-dropdown__item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: var(--space-2) var(--space-3);
          background: #080303;
          border: none;
          color: #F4F4F5;
          cursor: pointer;
          text-align: left;
          transition: background-color 0.12s ease, color 0.12s ease;
        }

        .edge-split-dropdown__item:hover,
        .edge-split-dropdown__item:focus-visible,
        .edge-split-dropdown__item--copied {
          background-color: #EE2626 !important;
          color: #080303 !important;
          outline: none;
        }

        .edge-split-dropdown__kbd {
          padding: 1px 4px;
          border: 1px solid currentColor;
          font-size: 10px;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}
