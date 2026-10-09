import { animate } from 'motion/mini';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

for (const card of document.querySelectorAll('.feature-card')) {
  const symbol = card.querySelector('.card-symbol');
  if (!symbol) continue;

  let animation;
  const move = transform => {
    if (reducedMotion.matches || !finePointer.matches) return;
    animation?.stop();
    animation = animate(symbol, { transform }, { duration: 0.34, ease: 'ease-out' });
  };

  card.addEventListener('pointerenter', () => move('translateY(-6px) rotate(-4deg) scale(1.05)'));
  card.addEventListener('pointerleave', () => move('translateY(0) rotate(0deg) scale(1)'));
}
