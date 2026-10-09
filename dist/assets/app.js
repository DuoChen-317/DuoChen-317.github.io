const toggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
if (toggle && mobileMenu) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    mobileMenu.hidden = open;
  });
  mobileMenu.addEventListener('click', event => {
    if (event.target.closest('a')) {
      toggle.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
    }
  });
}
