const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

for (const card of document.querySelectorAll('.card-scenes-v5 .feature-card')) {
  const output = card.querySelector('[data-screen-output]');
  const phrase = 'hello world';
  let hovered = false;
  let keyboardFocused = false;
  let active = false;
  let typingTimer;

  function write(text) {
    if (!output) return;
    output.textContent = text;
    // The paper screen uses inline editable text; its cursor follows text flow.
  }

  function stopTyping() {
    clearTimeout(typingTimer);
    typingTimer = undefined;
  }

  function startTyping() {
    if (!output) return;
    stopTyping();
    write('');
    if (reducedMotion.matches) {
      write(phrase);
      return;
    }
    let length = 0;
    const typeNext = () => {
      if (!active) return;
      write(phrase.slice(0, ++length));
      typingTimer = length < phrase.length ? setTimeout(typeNext, 90) : undefined;
    };
    typingTimer = setTimeout(typeNext, 180);
  }

  function update() {
    const next = !document.hidden && (hovered || keyboardFocused);
    if (next === active) return;
    active = next;
    card.classList.toggle('is-active', active);
    if (active) startTyping();
    else {
      stopTyping();
      write('');
    }
  }

  card.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch' || !finePointer.matches) return;
    hovered = true;
    update();
  });
  card.addEventListener('pointerleave', () => {
    hovered = false;
    update();
  });
  card.addEventListener('pointercancel', () => {
    hovered = false;
    update();
  });
  card.addEventListener('focusin', () => {
    keyboardFocused = card.matches(':focus-visible');
    update();
  });
  card.addEventListener('focusout', () => {
    keyboardFocused = false;
    update();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hovered = false;
    update();
  });
  finePointer.addEventListener('change', () => {
    if (!finePointer.matches) hovered = false;
    update();
  });
  reducedMotion.addEventListener('change', () => {
    if (active) startTyping();
  });
}
