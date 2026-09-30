const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav-wrap')) closeMenu();
});
matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);
document.querySelector('[data-play]').addEventListener('click', () => {
  const video = document.querySelector('#demo-video');
  video.play().catch(() => { /* Native controls remain available if playback is blocked. */ });
});
document.querySelector('#year').textContent = String(new Date().getFullYear());
