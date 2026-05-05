// ============================================================
//  CART SYSTEM — Full featured cart with localStorage
// ============================================================

const Cart = (() => {
  let items = JSON.parse(localStorage.getItem('amazon_cart') || '[]');

  function save() {
    localStorage.setItem('amazon_cart', JSON.stringify(items));
  }

  function add(product, qty = 1) {
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, 10);
    } else {
      items.push({ ...product, qty });
    }
    save();
    render();
    updateCount();
    showToast('success', `<i class="fa-solid fa-check"></i>`, `"${product.name.slice(0, 40)}..." added to cart`);
    bumpCartIcon();
  }

  function remove(id) {
    items = items.filter(i => i.id !== id);
    save();
    render();
    updateCount();
  }

  function updateQty(id, delta) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, Math.min(item.qty + delta, 10));
    if (item.qty === 0) { remove(id); return; }
    save();
    render();
    updateCount();
  }

  function getTotal() {
    return items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function getCount() {
    return items.reduce((sum, i) => sum + i.qty, 0);
  }

  function updateCount() {
    const count = getCount();
    const el = document.getElementById('cartCount');
    if (el) el.textContent = count;
    const itemCount = document.getElementById('cartItemCount');
    if (itemCount) itemCount.textContent = count;
  }

  function bumpCartIcon() {
    const el = document.getElementById('cartCount');
    if (!el) return;
    el.classList.remove('pulse');
    void el.offsetWidth;
    el.classList.add('pulse');
    setTimeout(() => el.classList.remove('pulse'), 400);
  }

  function render() {
    const body = document.getElementById('cartBody');
    const cartItemsEl = document.getElementById('cartItems');
    const emptyEl = document.getElementById('cartEmpty');
    const footer = document.getElementById('cartFooter');
    const totalEl = document.getElementById('cartTotalPrice');
    const subtotalCount = document.getElementById('cartSubtotalCount');
    if (!body) return;

    if (items.length === 0) {
      if (emptyEl) emptyEl.hidden = false;
      if (cartItemsEl) cartItemsEl.innerHTML = '';
      if (footer) footer.hidden = true;
      return;
    }

    if (emptyEl) emptyEl.hidden = true;
    if (footer) footer.hidden = false;
    if (totalEl) totalEl.textContent = getTotal().toLocaleString('en-IN');
    if (subtotalCount) subtotalCount.textContent = getCount();

    if (cartItemsEl) {
      cartItemsEl.innerHTML = items.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.img}" alt="${item.name}" class="cart-item-img" loading="lazy" />
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            ${item.prime ? '<div class="prime-tag"></div>' : ''}
            <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
            <div style="font-size:11px;color:#007600">${item.delivery || 'FREE delivery'}</div>
            <div class="cart-item-controls">
              <button class="qty-btn" onclick="Cart.updateQty(${item.id}, -1)">−</button>
              <span class="qty-display">${item.qty}</span>
              <button class="qty-btn" onclick="Cart.updateQty(${item.id}, 1)">+</button>
              <span class="cart-item-remove" onclick="Cart.remove(${item.id})">Remove</span>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  function open() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar) { sidebar.hidden = false; document.body.style.overflow = 'hidden'; }
    if (overlay) overlay.hidden = false;
    render();
  }

  function close() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar) sidebar.hidden = true;
    if (overlay) overlay.hidden = true;
    document.body.style.overflow = '';
  }

  // Init
  updateCount();
  render();

  return { add, remove, updateQty, open, close, getTotal, getCount, items: () => items };
})();
