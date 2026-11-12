/**
 * WebdriftInstaller.tsx — 1-bit OS System Diagnostic & Installer Modal
 * React 19 island with Framer Motion
 *
 * Triggered via window event: 'open-webdrift-installer'
 * (from SystemBar "Special -> Run System Diagnostic" or footer link)
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DIAGNOSTIC_STEPS = [
  'Removing Tailwind utility bloat...',
  'Verifying OOUX ORCA reference() graph...',
  'Linking MDPI peer-reviewed citations...',
  'Installing good taste... already installed.',
];

export default function WebdriftInstaller() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Listen for open event
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setCurrentStep(0);
      setIsDone(false);
    };

    window.addEventListener('open-webdrift-installer', handleOpen);
    return () => window.removeEventListener('open-webdrift-installer', handleOpen);
  }, []);

  // Sequence the diagnostic steps
  useEffect(() => {
    if (!isOpen) return;

    if (currentStep < DIAGNOSTIC_STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setIsDone(true);
    }
  }, [isOpen, currentStep]);

  // Focus management & Escape key
  useEffect(() => {
    if (!isOpen) return;

    // Focus close button on open
    setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        return;
      }

      // Trap focus
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const progressPercent = Math.min(100, Math.round((currentStep / DIAGNOSTIC_STEPS.length) * 100));

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="installer-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="installer-title"
        >
          {/* Backdrop */}
          <motion.div
            className="installer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          {/* 1-Bit OS Window Modal */}
          <motion.div
            ref={modalRef}
            className="installer-window u-window"
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Titlebar */}
            <div class-name="installer-titlebar u-window-titlebar" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 'var(--window-titlebar)',
              paddingInline: 'var(--space-3)',
              backgroundColor: 'var(--color-chrome-bg)',
              borderBottom: 'var(--border-1bit)',
              userSelect: 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    border: 'var(--border-1bit)',
                    backgroundColor: 'var(--color-accent)',
                  }}
                />
                <span id="installer-title" className="u-mono u-text-xs u-text-muted">
                  diagnostic_routine.app
                </span>
              </div>
              <span className="u-mono u-text-xs u-text-faint">FOTISP-OS v2.6</span>
            </div>

            {/* Content Area */}
            <div className="installer-body" style={{ padding: 'var(--space-6)' }}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <p className="u-mono u-text-xs u-text-accent" style={{ marginBottom: '4px' }}>
                  SYSTEM DIAGNOSTIC & ARCHITECTURE VERIFICATION
                </p>
                <p className="u-text-sm u-text-muted">
                  Auditing client environment, runtime tokens, and object-oriented UX schemas...
                </p>
              </div>

              {/* 1-Bit Progress Meter */}
              <div
                style={{
                  padding: 'var(--space-2)',
                  backgroundColor: 'var(--color-bg)',
                  border: 'var(--border-1bit-subtle)',
                  marginBottom: 'var(--space-5)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-1)',
                  }}
                  className="u-mono u-text-xs"
                >
                  <span className="u-text-faint">BUFFER INTEGRITY</span>
                  <span className="u-text-main">{progressPercent}%</span>
                </div>
                <div
                  style={{
                    height: '12px',
                    backgroundColor: 'var(--color-surface-raised)',
                    border: '1px solid var(--color-border)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${progressPercent}%`,
                      backgroundColor: 'var(--color-accent)',
                      transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </div>
              </div>

              {/* Step Output Terminal */}
              <div
                style={{
                  backgroundColor: 'var(--color-bg)',
                  border: 'var(--border-1bit)',
                  padding: 'var(--space-4)',
                  minHeight: '128px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-2)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  marginBottom: 'var(--space-6)',
                }}
              >
                {DIAGNOSTIC_STEPS.map((stepText, idx) => {
                  const isVisible = idx < currentStep;
                  const isCurrent = idx === currentStep;

                  if (!isVisible && !isCurrent) return null;

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '8px',
                        color: isVisible ? 'var(--color-success)' : 'var(--color-text-muted)',
                      }}
                    >
                      <span>{isVisible ? '✓' : '▶'}</span>
                      <span style={{ color: isVisible ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                        {stepText}
                      </span>
                    </motion.div>
                  );
                })}

                {isDone && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      marginTop: 'var(--space-2)',
                      paddingTop: 'var(--space-2)',
                      borderTop: 'var(--border-1bit-subtle)',
                      color: 'var(--color-accent)',
                    }}
                  >
                    [SYSTEM INTEGRITY 100%: ALL SCHEMAS DETERMINISTIC & SOUND]
                  </motion.div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 'var(--space-2)',
                  borderTop: 'var(--border-1bit-subtle)',
                }}
              >
                <span className="u-mono u-text-xs u-text-faint">Press [ESC] to dismiss</span>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: 'var(--space-2) var(--space-4)',
                    backgroundColor: isDone ? 'var(--color-accent)' : 'transparent',
                    color: isDone ? 'var(--color-text)' : 'var(--color-text-muted)',
                    border: 'var(--border-1bit)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    letterSpacing: 'var(--tracking-wider)',
                    textTransform: 'uppercase',
                  }}
                >
                  {isDone ? 'Acknowledge & Close' : 'Skip / Close (ESC)'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
