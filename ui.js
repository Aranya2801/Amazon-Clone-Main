// ============================================================
//  UI UTILITIES — Toast, Wishlist, Scroll Reveal, Helpers
// ============================================================

// ── TOAST NOTIFICATION ──
function showToast(type = 'info', icon = '', message = '', duration = 3500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span>${message}</span>
    <span class="toast-dismiss" onclick="this.parentElement.remove()">✕</span>
  `;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(120%)'; toast.style.transition = '0.3s'; setTimeout(() => toast.remove(), 300); }, duration);
}

// ── WISHLIST ──
const Wishlist = (() => {
  let items = JSON.parse(localStorage.getItem('amazon_wishlist') || '[]');

  function save() { localStorage.setItem('amazon_wishlist', JSON.stringify(items)); }

  function toggle(product) {
    const idx = items.findIndex(i => i.id === product.id);
    if (idx >= 0) {
      items.splice(idx, 1);
      showToast('info', '<i class="fa-regular fa-heart"></i>', 'Removed from wishlist');
    } else {
      items.push(product);
      showToast('success', '<i class="fa-solid fa-heart"></i>', 'Added to wishlist!');
    }
    save();
    updateCount();
    return idx < 0; // returns true if added
  }

  function has(id) { return items.some(i => i.id === id); }

  function updateCount() {
    const el = document.getElementById('wishlistCount');
    const fab = document.getElementById('floatingWishlist');
    if (el) el.textContent = items.length;
    if (fab) fab.hidden = items.length === 0;
  }

  updateCount();
  return { toggle, has, items: () => items, updateCount };
})();

// ── STAR RENDERER ──
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '<i class="fa-solid fa-star"></i>'.repeat(full) +
    (half ? '<i class="fa-solid fa-star-half-stroke"></i>' : '') +
    '<i class="fa-regular fa-star"></i>'.repeat(empty);
}

// ── PRICE FORMATTER ──
function formatPrice(price) {
  return price.toLocaleString('en-IN');
}

// ── SCROLL REVEAL ──
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => observer.observe(el));
}

// ── PRODUCT CARD BUILDER ──
function buildProductCard(product, opts = {}) {
  const { width = '' } = opts;
  const isWishlisted = Wishlist.has(product.id);
  const badgeMap = { deal: 'badge-deal', prime: 'badge-prime', new: 'badge-new', top: 'badge-top' };
  const badgeLabelMap = { deal: 'Deal', new: 'New', top: '#1 Best Seller' };

  return `
    <div class="product-card ${width}" data-id="${product.id}" onclick="openProductModal(${product.id})" role="button" tabindex="0" aria-label="${product.name}">
      <div class="product-card-img-wrap">
        ${product.badge && badgeLabelMap[product.badge] ? `<span class="product-card-badge ${badgeMap[product.badge]}">${badgeLabelMap[product.badge]}</span>` : ''}
        <img src="${product.img}" alt="${product.name}" class="product-card-img" loading="lazy" />
        <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="handleWishlist(event,${product.id})" aria-label="Add to wishlist">
          <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart"></i>
        </button>
      </div>
      <div class="product-card-body">
        <div class="product-brand">${product.brand}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-rating">
          <span class="stars">${renderStars(product.rating)}</span>
          <span class="stars-count">${product.reviews.toLocaleString()}</span>
        </div>
        <div class="product-card-footer">
          <div class="price-block">
            <span class="price-current"><span class="price-symbol">₹</span>${formatPrice(product.price)}</span>
            ${product.originalPrice ? `<span class="price-original">₹${formatPrice(product.originalPrice)}</span>` : ''}
            ${product.discount ? `<span class="price-discount">(${product.discount}% off)</span>` : ''}
          </div>
          ${product.prime ? '<div class="prime-tag"></div>' : ''}
          <div class="delivery-tag"><i class="fa-solid fa-truck-fast"></i> ${product.delivery || 'FREE delivery'}</div>
          <button class="add-to-cart-btn" onclick="handleAddToCart(event,${product.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
}

// ── DEAL CARD BUILDER ──
function buildDealCard(deal) {
  return `
    <div class="deal-card" onclick="showToast('info','<i class=\\'fa-solid fa-bolt\\'></i>','Deal page coming soon!')">
      <div class="deal-discount-badge">${deal.discount}% off</div>
      <img src="${deal.img}" alt="${deal.name}" style="width:100%;height:150px;object-fit:contain;padding:10px;background:#f8f8f8;" loading="lazy" />
      <div style="padding:10px;">
        <div style="font-size:11px;color:#888;font-weight:600;">${deal.brand}</div>
        <div style="font-size:13px;font-weight:700;color:var(--text-primary);margin:4px 0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${deal.name}</div>
        <div style="display:flex;align-items:baseline;gap:6px;">
          <span style="font-size:16px;font-weight:800;color:var(--price-color);">₹${formatPrice(deal.price)}</span>
          <span style="font-size:12px;color:#888;text-decoration:line-through;">₹${formatPrice(deal.originalPrice)}</span>
        </div>
        <div class="deal-progress-wrap">
          <div class="deal-progress-label">${deal.claimed}% claimed</div>
          <div class="deal-progress-bar"><div class="deal-progress-fill" style="width:${deal.claimed}%"></div></div>
        </div>
      </div>
    </div>
  `;
}

// ── HANDLERS ──
function handleAddToCart(event, productId) {
  event.stopPropagation();
  const product = PRODUCTS.find(p => p.id === productId) || DEALS.find(d => d.id === productId);
  if (product) Cart.add(product);
}

function handleWishlist(event, productId) {
  event.stopPropagation();
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const added = Wishlist.toggle(product);
  // Update all wishlist buttons for this product
  document.querySelectorAll(`[data-id="${productId}"] .product-wishlist-btn`).forEach(btn => {
    btn.classList.toggle('active', added);
    btn.innerHTML = `<i class="fa-${added ? 'solid' : 'regular'} fa-heart"></i>`;
  });
}

// ── PRODUCT MODAL ──
function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  // Track recently viewed
  let recent = JSON.parse(localStorage.getItem('amazon_recent') || '[]');
  recent = [productId, ...recent.filter(id => id !== productId)].slice(0, 8);
  localStorage.setItem('amazon_recent', JSON.stringify(recent));

  const modal = document.getElementById('productModal');
  const overlay = document.getElementById('productModalOverlay');
  const content = document.getElementById('productModalContent');
  if (!modal || !content) return;

  const stockClass = product.stock.toLowerCase().includes('only') ? 'low' : '';

  content.innerHTML = `
    <div class="modal-img-section">
      <img src="${product.img}" alt="${product.name}" class="modal-main-img" id="modalMainImg" />
      <div class="modal-thumbs">
        <img src="${product.img}" alt="" class="modal-thumb active" onclick="document.getElementById('modalMainImg').src=this.src;document.querySelectorAll('.modal-thumb').forEach(t=>t.classList.remove('active'));this.classList.add('active')" />
      </div>
    </div>
    <div class="modal-info">
      <div class="modal-brand">${product.brand}</div>
      <div class="modal-title">${product.name}</div>
      <div class="modal-rating">
        <span class="stars">${renderStars(product.rating)}</span>
        <span class="stars-count">${product.reviews.toLocaleString()} ratings</span>
      </div>
      <div class="modal-price-block">
        <div class="price-block" style="margin-bottom:4px;">
          <span class="modal-price">₹${formatPrice(product.price)}</span>
        </div>
        ${product.originalPrice ? `<span class="modal-price-orig">M.R.P.: ₹${formatPrice(product.originalPrice)}</span>` : ''}
        ${product.discount ? `<div class="modal-price-saving">You save: ₹${formatPrice(product.originalPrice - product.price)} (${product.discount}%)</div>` : ''}
      </div>
      <div class="modal-delivery"><i class="fa-solid fa-truck-fast"></i> ${product.delivery || 'FREE delivery Tomorrow'}</div>
      <div class="modal-stock ${stockClass}">${product.stock}</div>
      ${product.prime ? '<div class="prime-tag" style="font-size:14px;margin:4px 0;"></div>' : ''}
      <div class="modal-features">
        ${(product.features || []).map(f => `<div class="modal-feature"><i class="fa-solid fa-check-circle"></i>${f}</div>`).join('')}
      </div>
      <button class="btn-primary modal-add-btn" onclick="Cart.add(${JSON.stringify(JSON.stringify(product)).slice(1,-1)});closeProductModal()">
        <i class="fa-solid fa-cart-shopping"></i> Add to Cart
      </button>
      <button class="modal-wishlist-btn" onclick="handleWishlist(event,${product.id})">
        <i class="fa-${Wishlist.has(product.id) ? 'solid' : 'regular'} fa-heart"></i>
        ${Wishlist.has(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
      </button>
    </div>
  `;

  // Fix the add to cart button to work properly
  content.querySelector('.modal-add-btn').onclick = () => {
    Cart.add(product);
    closeProductModal();
  };

  modal.hidden = false;
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('productModal').hidden = true;
  document.getElementById('productModalOverlay').hidden = true;
  document.body.style.overflow = '';
}

// ── COUNTDOWN TIMER ──
function startCountdown(endTime, hEl, mEl, sEl) {
  function tick() {
    const now = Date.now();
    let diff = Math.max(0, endTime - now);
    const h = Math.floor(diff / 3600000); diff %= 3600000;
    const m = Math.floor(diff / 60000); diff %= 60000;
    const s = Math.floor(diff / 1000);
    if (hEl) hEl.textContent = String(h).padStart(2,'0');
    if (mEl) mEl.textContent = String(m).padStart(2,'0');
    if (sEl) sEl.textContent = String(s).padStart(2,'0');
  }
  tick();
  return setInterval(tick, 1000);
}

function formatDealsTime(ms) {
  const h = Math.floor(ms / 3600000); ms %= 3600000;
  const m = Math.floor(ms / 60000); ms %= 60000;
  const s = Math.floor(ms / 1000);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
