import { initCareerDisclosure } from './career-disclosure.js';

// Keep native disclosures usable without JS, with coordinated rail and node
// feedback when scrolling or expanding an experience.
export function initExperienceTimeline(root, environment = window) {
  if (!root) return () => {};
  const entries = [...root.querySelectorAll('[data-career-entry]')];
  const markers = entries.map(entry => entry.querySelector('.career-marker'));
  const rail = root.querySelector('.career-rail');
  if (!entries.length || markers.some(marker => !marker) || !rail) return () => {};
  const motion = environment.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = null;
  let active = -1;
  let entered = false;
  let destroyed = false;
  const update = () => {
    frame = null;
    const rootBox = root.getBoundingClientRect();
    const positions = markers.map(marker => {
      const box = marker.getBoundingClientRect();
      return box.top + box.height / 2;
    });
    const start = positions[0];
    const height = Math.max(1, positions[positions.length - 1] - start);
    rail.style.top = `${start - rootBox.top}px`;
    rail.style.height = `${height}px`;
    const readingLine = environment.innerHeight * .48;
    const fill = Math.max(0, Math.min(1, (readingLine - start) / height));
    rail.style.setProperty('--career-progress', motion.matches ? '1' : String(fill));
    if (!entered && rootBox.top < environment.innerHeight - 80 && rootBox.bottom > 100) {
      entered = true;
      root.classList.add('has-entered');
    }
    const next = positions.reduce((index, position, i) => position <= readingLine ? i : index, 0);
    if (next !== active) {
      entries.forEach((entry, i) => entry.classList.toggle('is-active', i === next));
      active = next;
    }
    root.classList.toggle('reduced-motion', motion.matches);
  };
  const schedule = () => {
    if (destroyed) return;
    if (frame === null) frame = environment.requestAnimationFrame(update);
  };
  const resize = typeof environment.ResizeObserver === 'function' ? new environment.ResizeObserver(schedule) : null;
  const disclosures = entries.map(entry => {
    const details = entry.querySelector('.career-content');
    return initCareerDisclosure(details, motion, () => {
      entry.classList.toggle('is-expanded', Boolean(details?.open));
      schedule();
    });
  });
  resize?.observe(root);
  environment.addEventListener('scroll', schedule, { passive: true });
  environment.addEventListener('resize', schedule);
  motion.addEventListener('change', schedule);
  root.addEventListener?.('toggle', schedule, true);
  environment.document.fonts?.ready.then(schedule);
  update();
  return () => {
    destroyed = true;
    disclosures.forEach(cleanup => cleanup());
    if (frame !== null) environment.cancelAnimationFrame(frame);
    resize?.disconnect();
    environment.removeEventListener('scroll', schedule);
    environment.removeEventListener('resize', schedule);
    motion.removeEventListener('change', schedule);
    root.removeEventListener?.('toggle', schedule, true);
  };
}

if (typeof document !== 'undefined') {
  document.querySelectorAll('[data-experience-timeline]').forEach(root => initExperienceTimeline(root));
}
