const toggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
const gamesDropdown = document.querySelector('.main-nav .nav-dropdown');
if (gamesDropdown) {
  document.addEventListener('click', event => {
    if (!gamesDropdown.contains(event.target)) gamesDropdown.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && gamesDropdown.open) {
      gamesDropdown.open = false;
      gamesDropdown.querySelector('summary').focus();
    }
  });
}
if (toggle && mobileMenu) {
  const setMenuOpen = open => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? toggle.dataset.closeLabel : toggle.dataset.openLabel);
    mobileMenu.hidden = !open;
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!open);
  });
  mobileMenu.addEventListener('click', event => {
    if (event.target.closest('a')) setMenuOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileMenu.hidden) {
      setMenuOpen(false);
      toggle.focus();
    }
  });
}
