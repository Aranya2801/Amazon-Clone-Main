// ============================================================
//  MAIN APP — Orchestrates all components
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── DARK MODE ──
  const darkBtn = document.getElementById('darkModeBtn');
  const darkIcon = document.getElementById('darkModeIcon');
  const savedTheme = localStorage.getItem('amazon_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (darkIcon) darkIcon.className = savedTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';

  darkBtn?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('amazon_theme', next);
    if (darkIcon) darkIcon.className = next === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  });

  // ── HERO CAROUSEL ──
  let heroIdx = 0;
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const carousel = document.getElementById('heroCarousel');

  function goToSlide(idx) {
    heroIdx = (idx + slides.length) % slides.length;
    if (carousel) carousel.style.transform = `translateX(-${heroIdx * 100}%)`;
    slides.forEach((s, i) => s.classList.toggle('active', i === heroIdx));
    dots.forEach((d, i) => d.classList.toggle('active', i === heroIdx));
  }

  document.getElementById('heroPrev')?.addEventListener('click', () => goToSlide(heroIdx - 1));
  document.getElementById('heroNext')?.addEventListener('click', () => goToSlide(heroIdx + 1));
  dots.forEach(dot => dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.idx))));

  // Auto-advance
  let heroTimer = setInterval(() => goToSlide(heroIdx + 1), 5000);
  document.getElementById('heroSection')?.addEventListener('mouseenter', () => clearInterval(heroTimer));
  document.getElementById('heroSection')?.addEventListener('mouseleave', () => { heroTimer = setInterval(() => goToSlide(heroIdx + 1), 5000); });

  // ── COUNTDOWN TIMERS ──
  const heroEnd = Date.now() + (8 * 3600000 + 24 * 60000);
  startCountdown(heroEnd,
    document.getElementById('c1h'),
    document.getElementById('c1m'),
    document.getElementById('c1s'));

  // Deals countdown (midnight)
  const now = new Date();
  const midnight = new Date(now); midnight.setHours(23, 59, 59, 999);
  const dealsEnd = midnight.getTime();
  const dealsTimeEl = document.getElementById('dealsTime');
  if (dealsTimeEl) {
    setInterval(() => { dealsTimeEl.textContent = formatDealsTime(Math.max(0, dealsEnd - Date.now())); }, 1000);
  }

  // ── CATEGORIES ──
  const catGrid = document.getElementById('categoriesGrid');
  if (catGrid) {
    catGrid.innerHTML = CATEGORIES.map(cat => `
      <div class="category-card reveal" onclick="filterByCategory('${cat.id}')">
        <img src="${cat.img}" alt="${cat.name}" class="category-card-img" loading="lazy" />
        <div class="category-card-badge">${cat.badge}</div>
        <div class="category-card-body">
          <div class="category-card-title">${cat.name}</div>
          <a href="#featured-products" class="category-card-link">See all deals →</a>
        </div>
      </div>
    `).join('');
  }

  // ── TODAY'S DEALS ──
  const dealsSlider = document.getElementById('dealsSlider');
  if (dealsSlider) {
    dealsSlider.innerHTML = DEALS.map(deal => buildDealCard(deal)).join('');
  }

  // ── PRODUCTS ──
  let currentCategory = 'all';
  let displayedCount = 8;

  function renderProducts(cat = 'all', count = 8) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    let filtered = cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);
    const shown = filtered.slice(0, count);
    grid.innerHTML = shown.map(p => buildProductCard(p)).join('');
    const loadBtn = document.getElementById('loadMoreBtn');
    if (loadBtn) loadBtn.hidden = count >= filtered.length;
    initScrollReveal();
  }

  renderProducts();

  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.dataset.cat;
      displayedCount = 8;
      renderProducts(currentCategory, displayedCount);
    });
  });

  // Load more
  document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
    displayedCount += 8;
    renderProducts(currentCategory, displayedCount);
  });

  // Filter by category from category card
  window.filterByCategory = (cat) => {
    document.querySelector('.filter-tab.active')?.classList.remove('active');
    const tab = document.querySelector(`.filter-tab[data-cat="${cat}"]`);
    if (tab) tab.classList.add('active');
    currentCategory = cat;
    displayedCount = 8;
    renderProducts(cat, 8);
    document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── REVIEWS ──
  const reviewsGrid = document.getElementById('reviewsGrid');
  if (reviewsGrid) {
    reviewsGrid.innerHTML = REVIEWS.map(r => `
      <div class="review-card reveal">
        <div class="review-header">
          <div class="review-avatar">${r.initials}</div>
          <div class="review-meta">
            <div class="review-name">${r.name}</div>
            <div class="review-product">Reviewed: ${r.product}</div>
            <div class="stars" style="font-size:12px;">${renderStars(r.rating)}</div>
          </div>
        </div>
        <div class="review-text">"${r.text}"</div>
        <div class="review-date">${r.date}</div>
      </div>
    `).join('');
  }

  // ── SEARCH ──
  const searchInput = document.getElementById('searchInput');
  const searchSuggestions = document.getElementById('searchSuggestions');
  const searchBtn = document.getElementById('searchBtn');

  function doSearch(query) {
    if (!query.trim()) return;
    searchSuggestions?.classList.remove('visible');
    const q = query.toLowerCase();
    const results = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
    const section = document.getElementById('searchResultsSection');
    const grid = document.getElementById('searchResultsGrid');
    const title = document.getElementById('searchResultsTitle');
    if (!section || !grid || !title) return;

    title.textContent = `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`;
    grid.innerHTML = results.length
      ? results.map(p => buildProductCard(p)).join('')
      : `<div class="search-no-results"><i class="fa-solid fa-magnifying-glass fa-3x"></i><h3>No results for "${query}"</h3><p>Try different keywords or browse our categories below.</p></div>`;
    section.hidden = false;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  searchInput?.addEventListener('input', () => {
    const val = searchInput.value.trim().toLowerCase();
    if (!val) { searchSuggestions?.classList.remove('visible'); return; }
    const matches = [
      ...SEARCH_SUGGESTIONS.filter(s => s.toLowerCase().includes(val)),
      ...PRODUCTS.filter(p => p.name.toLowerCase().includes(val)).map(p => p.name).slice(0, 3)
    ].slice(0, 8);
    if (!searchSuggestions) return;
    if (matches.length === 0) { searchSuggestions.classList.remove('visible'); return; }
    searchSuggestions.innerHTML = `
      <div class="suggestion-divider">Suggestions</div>
      ${matches.map(m => `<div class="suggestion-item" onclick="document.getElementById('searchInput').value='${m}';doSearch('${m}')"><i class="fa-solid fa-magnifying-glass"></i>${m}</div>`).join('')}
    `;
    searchSuggestions.classList.add('visible');
  });

  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch(searchInput.value);
  });
  searchBtn?.addEventListener('click', () => doSearch(searchInput.value));

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-search')) {
      searchSuggestions?.classList.remove('visible');
    }
  });

  window.doSearch = doSearch;

  // Sort filter
  document.getElementById('sortFilter')?.addEventListener('change', (e) => {
    const query = searchInput?.value || '';
    if (!query) return;
    const q = query.toLowerCase();
    let results = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    const val = e.target.value;
    if (val === 'price-asc') results.sort((a, b) => a.price - b.price);
    else if (val === 'price-desc') results.sort((a, b) => b.price - a.price);
    else if (val === 'rating') results.sort((a, b) => b.rating - a.rating);
    else if (val === 'newest') results.sort((a, b) => b.id - a.id);
    const grid = document.getElementById('searchResultsGrid');
    if (grid) grid.innerHTML = results.map(p => buildProductCard(p)).join('');
  });

  // ── CART ──
  document.getElementById('cartBtn')?.addEventListener('click', () => Cart.open());
  document.getElementById('cartClose')?.addEventListener('click', () => Cart.close());
  document.getElementById('cartOverlay')?.addEventListener('click', () => Cart.close());
  document.getElementById('cartContinueBtn')?.addEventListener('click', () => Cart.close());
  document.getElementById('cartShopBtn')?.addEventListener('click', () => { Cart.close(); document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' }); });
  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (!Auth.isLoggedIn()) {
      Cart.close();
      openAuthModal('login');
      showToast('info', '<i class="fa-solid fa-user"></i>', 'Please sign in to checkout');
    } else {
      showToast('success', '<i class="fa-solid fa-check"></i>', 'Proceeding to checkout... (Demo mode)');
    }
  });

  // ── MEGA MENU ──
  document.getElementById('allMenuBtn')?.addEventListener('click', () => {
    document.getElementById('megaMenu').hidden = false;
    document.getElementById('megaMenuOverlay').hidden = false;
    requestAnimationFrame(() => document.getElementById('megaMenu').classList.add('open'));
    document.body.style.overflow = 'hidden';
  });

  function closeMegaMenu() {
    document.getElementById('megaMenu').classList.remove('open');
    document.getElementById('megaMenuOverlay').hidden = true;
    setTimeout(() => { document.getElementById('megaMenu').hidden = true; }, 400);
    document.body.style.overflow = '';
  }

  document.getElementById('megaMenuClose')?.addEventListener('click', closeMegaMenu);
  document.getElementById('megaMenuOverlay')?.addEventListener('click', closeMegaMenu);

  // ── PRODUCT/AUTH MODAL CLOSE ──
  document.getElementById('productModalClose')?.addEventListener('click', closeProductModal);
  document.getElementById('productModalOverlay')?.addEventListener('click', closeProductModal);

  // ── RECENTLY VIEWED ──
  function renderRecentlyViewed() {
    const recent = JSON.parse(localStorage.getItem('amazon_recent') || '[]');
    const products = recent.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
    const section = document.getElementById('recentlyViewedSection');
    const grid = document.getElementById('recentlyViewedGrid');
    if (!section || !grid || products.length === 0) return;
    section.hidden = false;
    grid.innerHTML = products.map(p => buildProductCard(p)).join('');
  }

  renderRecentlyViewed();

  // ── KEYBOARD ACCESSIBILITY ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductModal();
      closeAuthModal();
      Cart.close();
      closeMegaMenu();
    }
  });

  // Make product cards keyboard accessible
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('product-card')) {
      const id = parseInt(e.target.dataset.id);
      if (id) openProductModal(id);
    }
  });

  // ── SCROLL REVEAL INIT ──
  initScrollReveal();

  // ── NAVBAR SCROLL EFFECT ──
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    const navbar = document.getElementById('navbar');
    if (navbar) {
      if (scroll > 60) navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
      else navbar.style.boxShadow = '0 2px 12px rgba(0,0,0,0.3)';
    }
    // Floating wishlist
    const fab = document.getElementById('floatingWishlist');
    if (fab) fab.style.opacity = scroll > 300 ? '1' : '0';
    lastScroll = scroll;
  });

  console.log('%c🛒 Amazon Clone — Advanced Edition', 'color:#FF9900;font-size:16px;font-weight:bold;');
  console.log('%cBuilt with ❤️ by Aranya | HTML + CSS + Vanilla JS', 'color:#232F3E;font-size:12px;');
});
