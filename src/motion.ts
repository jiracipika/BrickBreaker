// Motion (motion.dev) — MIT — DOM-shell animations only (never the canvas render loop).
import { animate, stagger } from 'motion';
import type { Phase } from './game';

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initShellMotion(): void {
  if (prefersReducedMotion()) return;

  // Entrance: stagger the shell elements (title, instructions, HUD, canvas frame, controls).
  const shell = ['#app h1', '#instructions', '.game-status', '#gameCanvas', '.controls']
    .map((selector) => document.querySelector<HTMLElement>(selector))
    .filter((el): el is HTMLElement => el !== null);
  // Initial hidden state set from JS only, so the page stays visible if this fails.
  shell.forEach((el) => {
    el.style.opacity = '0';
  });
  animate(
    shell,
    { opacity: [0, 1], transform: ['translateY(18px)', 'translateY(0px)'] },
    { delay: stagger(0.06), type: 'spring', bounce: 0.25, duration: 0.6 },
  );

  // Button hover lift + press springs.
  document.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
    button.addEventListener('pointerenter', () => {
      animate(button, { y: -2 }, { type: 'spring', bounce: 0.4, duration: 0.3 });
    });
    button.addEventListener('pointerleave', () => {
      animate(button, { y: 0 }, { type: 'spring', bounce: 0.3, duration: 0.35 });
    });
    button.addEventListener('pointerdown', () => {
      animate(button, { scale: 0.96 }, { type: 'spring', bounce: 0.5, duration: 0.25 });
    });
    button.addEventListener('pointerup', () => {
      animate(button, { scale: 1 }, { type: 'spring', bounce: 0.4, duration: 0.3 });
    });
  });
}

// Subtle spring pop on the status line when a round ends (won/lost only).
export function announcePhase(phase: Phase): void {
  if (prefersReducedMotion()) return;
  if (phase !== 'won' && phase !== 'lost') return;
  const status = document.querySelector<HTMLElement>('.game-status');
  if (!status) return;
  animate(status, { scale: [0.96, 1.05, 1] }, { duration: 0.45, ease: 'easeOut' });
}
