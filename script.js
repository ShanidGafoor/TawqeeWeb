// Mobile navigation
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

// Approval types tabs (WAI-ARIA tabs pattern, automatic activation)
const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab, focus) {
  for (const other of tabs) {
    const selected = other === tab;
    other.setAttribute('aria-selected', String(selected));
    other.tabIndex = selected ? 0 : -1;
    document.getElementById(other.getAttribute('aria-controls')).hidden = !selected;
  }
  if (focus) tab.focus();
}
for (const tab of tabs) {
  tab.addEventListener('click', () => selectTab(tab, false));
  tab.addEventListener('keydown', (event) => {
    const index = tabs.indexOf(tab);
    const moves = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next;
    if (event.key in moves) next = tabs[(index + moves[event.key] + tabs.length) % tabs.length];
    else if (event.key === 'Home') next = tabs[0];
    else if (event.key === 'End') next = tabs[tabs.length - 1];
    if (next) {
      event.preventDefault();
      selectTab(next, true);
    }
  });
}

// Demo video: the hero link and chapter buttons
const video = document.querySelector('#demo-video');
const chapters = [...document.querySelectorAll('[data-seek]')];
function play() {
  video.play().catch(() => { /* Native controls remain available if playback is blocked. */ });
}
document.querySelector('[data-play]').addEventListener('click', play);
for (const chapter of chapters) {
  chapter.addEventListener('click', () => {
    const seek = () => { video.currentTime = Number(chapter.dataset.seek); play(); };
    if (video.readyState >= 1) seek();
    else {
      video.addEventListener('loadedmetadata', seek, { once: true });
      video.preload = 'metadata';
      video.load();
    }
  });
}
video.addEventListener('timeupdate', () => {
  let current;
  for (const chapter of chapters) if (video.currentTime >= Number(chapter.dataset.seek) - 0.1) current = chapter;
  for (const chapter of chapters) {
    if (chapter === current) chapter.setAttribute('aria-current', 'true');
    else chapter.removeAttribute('aria-current');
  }
});

document.querySelector('#year').textContent = String(new Date().getFullYear());
