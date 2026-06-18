'use strict';

/* ── Page Loader ── */
window.addEventListener('load', () => {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('done'), 600);
  }
});

/* ── Cursor Glow ── */
(function() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow || window.matchMedia('(pointer:coarse)').matches) return;
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();

/* ── Navbar Scroll ── */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Hero Slider ── */
(function() {
  const track  = document.querySelector('.hero__slides');
  const slides = document.querySelectorAll('.hero__slide');
  const dots   = document.querySelectorAll('.hero__dot');
  const labels = document.querySelectorAll('.hero__label');
  const counterEl = document.querySelector('.hero__counter-current');
  if (!track || !slides.length) return;

  let cur = 0, timer = null;
  const INTERVAL = 5800;

  function goTo(n) {
    slides[cur].classList.remove('active');
    dots[cur].classList.remove('active');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('active');
    dots[cur].classList.add('active');
    track.style.transform = `translateX(-${cur * 100}%)`;
    labels.forEach((l, i) => { l.style.display = i === cur ? 'block' : 'none'; });
    if (counterEl) counterEl.textContent = String(cur + 1).padStart(2, '0');
  }

  function start() { stop(); timer = setInterval(() => goTo(cur + 1), INTERVAL); }
  function stop()  { clearInterval(timer); }

  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); start(); }));
  document.querySelector('.hero__arrow--prev')?.addEventListener('click', () => { goTo(cur - 1); start(); });
  document.querySelector('.hero__arrow--next')?.addEventListener('click', () => { goTo(cur + 1); start(); });

  let tx = 0;
  track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; stop(); }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = tx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) goTo(cur + (dx > 0 ? 1 : -1));
    start();
  });

  track.addEventListener('mouseenter', stop);
  track.addEventListener('mouseleave', start);

  goTo(0); start();
})();

/* ── Scroll Reveal ── */
(function() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ── Pillar card stagger ── */
(function() {
  const cards = document.querySelectorAll('.pillar-card');
  if (!cards.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), parseInt(e.target.dataset.delay || 0));
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach((c, i) => { c.classList.add('reveal'); c.dataset.delay = i * 110; io.observe(c); });
})();

/* ── Follow Button ── */
(function() {
  document.querySelectorAll('.btn-follow').forEach(btn => {
    btn.addEventListener('click', function() {
      const on = this.classList.toggle('active');
      const icon  = this.querySelector('.follow-icon');
      const label = this.querySelector('.follow-label');
      if (icon)  icon.innerHTML  = on ? checkSvg() : plusSvg();
      if (label) label.textContent = on ? 'Following' : 'Follow';
      if (on) {
        this.animate([
          { transform: 'scale(1)' },
          { transform: 'scale(1.08)' },
          { transform: 'scale(1)' }
        ], { duration: 400, easing: 'cubic-bezier(0.34,1.56,0.64,1)' });
      }
    });
  });
  function plusSvg()  { return `<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`; }
  function checkSvg() { return `<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`; }
})();

/* ── Mobile Nav ── */
(function() {
  const burger   = document.querySelector('.navbar__hamburger');
  const mobileNav= document.querySelector('.mobile-nav');
  const closeBtn = document.querySelector('.mobile-nav__close');
  if (!burger || !mobileNav) return;

  function open()  { mobileNav.classList.add('open');  burger.classList.add('open');  document.body.style.overflow = 'hidden'; }
  function close() { mobileNav.classList.remove('open'); burger.classList.remove('open'); document.body.style.overflow = ''; }

  burger.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();

/* ── Parallax: hero title slight shift ── */
(function() {
  const block = document.querySelector('.hero__title-block');
  if (!block || window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      block.style.transform = `translateY(calc(-50% + ${y * 0.18}px))`;
    }
  }, { passive: true });
})();

/* ── Copyright year ── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
