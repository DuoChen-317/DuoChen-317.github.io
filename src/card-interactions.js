import { animate } from 'motion/mini';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

for (const card of document.querySelectorAll('.feature-card')) {
  const scene = card.querySelector('.card-scene');
  if (!scene) continue;

  let animation;
  const move = transform => {
    if (reducedMotion.matches || !finePointer.matches) return;
    animation?.stop();
    animation = animate(scene, { transform }, { duration: 0.5, ease: 'ease-out' });
  };

  card.addEventListener('pointerenter', () => move('scale(1.035)'));
  card.addEventListener('pointerleave', () => move('scale(1)'));
}
