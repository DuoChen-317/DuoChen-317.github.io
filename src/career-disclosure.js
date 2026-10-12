// Animate the native disclosure's real height so later dates and nodes move with
// it. Native details remains the no-JS fallback; reduced motion settles at once.
export function initCareerDisclosure(details, motion, onResize = () => {}) {
  const summary = details?.querySelector?.('summary');
  if (!summary || typeof summary.addEventListener !== 'function') return () => {};
  let desired = details.open;
  let running = null;

  const cancel = () => {
    if (running) {
      running.onfinish = null;
      running.cancel();
      running = null;
    }
    details.classList.remove('is-animating');
  };
  const settle = () => {
    details.open = desired;
    cancel();
    onResize();
  };
  const click = event => {
    if (event.defaultPrevented || event.button > 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const from = details.getBoundingClientRect().height;
    if (!running) desired = details.open;
    desired = !desired;
    cancel();
    details.open = true;
    if (motion.matches || typeof details.animate !== 'function') {
      settle();
      return;
    }
    const border = details.offsetHeight - details.clientHeight;
    const to = desired ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height + border;
    details.classList.add('is-animating');
    const animation = details.animate([{ height: `${from}px` }, { height: `${to}px` }], {
      duration: 240, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both'
    });
    running = animation;
    animation.onfinish = () => {
      if (running === animation) settle();
    };
    onResize();
  };
  const preference = () => { if (motion.matches && running) settle(); };
  summary.addEventListener('click', click);
  motion.addEventListener('change', preference);
  return () => {
    settle();
    summary.removeEventListener('click', click);
    motion.removeEventListener('change', preference);
  };
}
