'use strict';
/* =========================================================
   PILLAR PAGES — pillar.js
   Handles: tab filtering, search, view toggle, load more,
   scroll reveal (reuses main.js reveal observer pattern)
   ========================================================= */

/* ── Filter Tabs ── */
(function initTabs() {
  const tabs  = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.article-card[data-category]');
  const empty = document.querySelector('.articles-empty');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      const cat = this.dataset.filter;
      let visible = 0;

      cards.forEach(card => {
        const match = cat === 'all' || card.dataset.category === cat;
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });

      // Show empty state if nothing matches
      if (empty) empty.classList.toggle('visible', visible === 0);

      // Update article count
      const countEl = document.querySelector('.articles-header__label span');
      if (countEl) countEl.textContent = visible;
    });
  });
})();


/* ── Live Search ── */
(function initSearch() {
  const input = document.querySelector('.filter-search input');
  const cards = document.querySelectorAll('.article-card');
  const empty = document.querySelector('.articles-empty');
  if (!input) return;

  input.addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    let visible = 0;

    cards.forEach(card => {
      const title   = card.querySelector('.article-card__title')?.textContent.toLowerCase() || '';
      const excerpt = card.querySelector('.article-card__excerpt')?.textContent.toLowerCase() || '';
      const tags    = card.querySelector('.article-card__tags')?.textContent.toLowerCase() || '';
      const match   = !q || title.includes(q) || excerpt.includes(q) || tags.includes(q);
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    if (empty) empty.classList.toggle('visible', visible === 0);

    const countEl = document.querySelector('.articles-header__label span');
    if (countEl) countEl.textContent = visible;
  });
})();


/* ── View Toggle (grid ↔ list) ── */
(function initViewToggle() {
  const btnGrid = document.querySelector('.view-btn--grid');
  const btnList = document.querySelector('.view-btn--list');
  const grid    = document.querySelector('.articles-grid');
  if (!btnGrid || !grid) return;

  btnGrid.addEventListener('click', () => {
    grid.classList.remove('list-view');
    btnGrid.classList.add('active');
    btnList.classList.remove('active');
    localStorage.setItem('pillar-view', 'grid');
  });

  btnList.addEventListener('click', () => {
    grid.classList.add('list-view');
    btnList.classList.add('active');
    btnGrid.classList.remove('active');
    localStorage.setItem('pillar-view', 'list');
  });

  // Restore saved preference
  if (localStorage.getItem('pillar-view') === 'list') {
    grid.classList.add('list-view');
    btnList?.classList.add('active');
    btnGrid?.classList.remove('active');
  }
})();


/* ── Load More (placeholder — wire to your CMS/backend) ── */
(function initLoadMore() {
  const btn = document.querySelector('.btn-load-more');
  if (!btn) return;

  btn.addEventListener('click', function () {
    // When you connect a CMS, fetch the next page of articles here
    // and append them to .articles-grid.
    // For now, show a friendly message.
    this.textContent = 'No more articles yet — check back soon!';
    this.disabled = true;
    this.style.opacity = '0.5';
    this.style.cursor  = 'default';
  });
})();


/* ── Scroll Reveal (mirrors main.js) ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
  els.forEach(el => io.observe(el));
})();


/* ── Article card stagger ── */
(function initCardStagger() {
  const cards = document.querySelectorAll('.article-card');
  cards.forEach((c, i) => {
    c.style.transitionDelay = `${(i % 3) * 60}ms`;
  });
})();


/* ── Active pillar nav highlight ── */
(function highlightNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.navbar__nav a').forEach(a => {
    if (a.getAttribute('href') && path.includes(a.getAttribute('href').replace('../', ''))) {
      a.classList.add('nav-active');
    }
  });
})();
