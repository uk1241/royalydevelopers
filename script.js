const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress span');
const customCursor = document.querySelector('.custom-cursor');
const cursorGlow = document.querySelector('.cursor-glow');
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const menuClose = document.querySelector('.mobile-menu-top button');
const mobileLinks = document.querySelectorAll('.mobile-menu a');

const updateScroll = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
  header.classList.toggle('scrolled', window.scrollY > 30);
};
window.addEventListener('scroll', updateScroll, { passive: true });
updateScroll();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

const heroTitle = document.querySelector('.hero h1');
const heroMedia = document.querySelector('.hero-media img');
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking || window.scrollY > window.innerHeight) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = Math.min(window.scrollY / 2, 180);
    heroTitle.style.transform = `translateY(${y * 0.18}px)`;
    heroMedia.style.transform = `scale(1.15) translateY(${y}px)`;
    ticking = false;
  });
}, { passive: true });

if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    customCursor.style.left = `${event.clientX}px`;
    customCursor.style.top = `${event.clientY}px`;
    customCursor.style.opacity = '1';
    cursorGlow.style.opacity = '1';
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
  window.addEventListener('pointerleave', () => {
    customCursor.style.opacity = '0';
    cursorGlow.style.opacity = '0';
  });
  document.querySelectorAll('a,button,.project-card,.material-card').forEach((element) => {
    element.addEventListener('pointerenter', () => customCursor.classList.add('hover'));
    element.addEventListener('pointerleave', () => customCursor.classList.remove('hover'));
  });
}

function setMenu(open) {
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
  menuButton.querySelectorAll('span').forEach((line, index) => {
    line.style.transform = open
      ? index === 0 ? 'translateY(4px) rotate(45deg)' : 'translateY(-4px) rotate(-45deg)'
      : '';
  });
}
menuButton.addEventListener('click', () => setMenu(true));
menuClose.addEventListener('click', () => setMenu(false));
mobileLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

const compare = document.querySelector('.compare-stage');
const before = document.querySelector('.compare-before');
const handle = document.querySelector('.compare-handle');
const range = document.querySelector('.compare-range');
const updateCompare = (value) => {
  before.style.width = `${value}%`;
  handle.style.left = `${value}%`;
};
range.addEventListener('input', (event) => updateCompare(event.target.value));
compare.addEventListener('pointerdown', (event) => {
  if (event.target === range) return;
  const rect = compare.getBoundingClientRect();
  updateCompare(((event.clientX - rect.left) / rect.width) * 100);
  range.value = Math.round(((event.clientX - rect.left) / rect.width) * 100);
});

const showProject = document.querySelectorAll('.project-card');
showProject.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.querySelector('.project-image img').style.transform = `scale(1.07) translate(${x * 8}px, ${y * 8}px)`;
  });
  card.addEventListener('pointerleave', () => {
    card.querySelector('.project-image img').style.transform = '';
  });
});
