const products = [
  {
    id: 'green-1l',
    name: 'CRYO Green Radiator Coolant 1L',
    color: 'green',
    size: '1L',
    weight: '1 kg',
    regularPrice: 650,
    offerPrice: 553,
    discount: 15,
    image1L: 'assets/images/green-1L.jpg',
    image4L: 'assets/images/green-4L.jpg',
    colorHex: '#4CAF50'
  },
  {
    id: 'red-1l',
    name: 'CRYO Red Radiator Coolant 1L',
    color: 'red',
    size: '1L',
    weight: '1 kg',
    regularPrice: 650,
    offerPrice: 553,
    discount: 15,
    image1L: 'assets/images/red-1L.jpg',
    image4L: 'assets/images/red-4L.jpg',
    colorHex: '#E53935'
  },
  {
    id: 'blue-1l',
    name: 'CRYO Blue Radiator Coolant 1L',
    color: 'blue',
    size: '1L',
    weight: '1 kg',
    regularPrice: 650,
    offerPrice: 553,
    discount: 15,
    image1L: 'assets/images/blue-1L.jpg',
    image4L: 'assets/images/blue-4L.jpg',
    colorHex: '#1E88E5'
  },
  {
    id: 'green-4l',
    name: 'CRYO Green Radiator Coolant 4L',
    color: 'green',
    size: '4L',
    weight: '4 kg',
    regularPrice: 2300,
    offerPrice: 1955,
    discount: 15,
    image1L: 'assets/images/green-1L.jpg',
    image4L: 'assets/images/green-4L.jpg',
    colorHex: '#4CAF50'
  },
  {
    id: 'red-4l',
    name: 'CRYO Red Radiator Coolant 4L',
    color: 'red',
    size: '4L',
    weight: '4 kg',
    regularPrice: 2300,
    offerPrice: 1955,
    discount: 15,
    image1L: 'assets/images/red-1L.jpg',
    image4L: 'assets/images/red-4L.jpg',
    colorHex: '#E53935'
  },
  {
    id: 'blue-4l',
    name: 'CRYO Blue Radiator Coolant 4L',
    color: 'blue',
    size: '4L',
    weight: '4 kg',
    regularPrice: 2300,
    offerPrice: 1955,
    discount: 15,
    image1L: 'assets/images/blue-1L.jpg',
    image4L: 'assets/images/blue-4L.jpg',
    colorHex: '#1E88E5'
  }
];

const waNumber = '923014138007';

// --- Cart System ---
function getCart() {
  return JSON.parse(localStorage.getItem('cryoCart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cryoCart', JSON.stringify(cart));
  updateCartBadge();
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.qty, 0);
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.offerPrice * item.qty), 0);
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function addToCart(productId, quantity, size, color, showAlert = true) {
  const cart = getCart();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItemIndex = cart.findIndex(item => item.id === productId && item.size === size && item.color === color);
  
  if (existingItemIndex > -1) {
    cart[existingItemIndex].qty += parseInt(quantity);
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      size: size,
      color: color,
      qty: parseInt(quantity),
      offerPrice: product.offerPrice,
      regularPrice: product.regularPrice,
      image: size === '1L' ? product.image1L : product.image4L
    });
  }
  saveCart(cart);
  if (showAlert) {
    alert('Added to cart successfully!');
  }
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function updateQuantity(index, quantity) {
  if (quantity < 1) return;
  const cart = getCart();
  cart[index].qty = parseInt(quantity);
  saveCart(cart);
  renderCart();
}

function clearCart() {
  localStorage.removeItem('cryoCart');
  updateCartBadge();
}

// --- WhatsApp Link Builders ---
function buildWhatsAppMessage(cart) {
  let msg = "Hi CRYO Team! I want to place an order:\n\n";
  cart.forEach(item => {
    msg += `• ${item.name} (${item.size}, ${item.color}) x${item.qty} = Rs. ${item.offerPrice * item.qty}\n`;
  });
  msg += `\nTotal: Rs. ${getCartTotal()}\nPlease confirm my order. Thank you!`;
  return encodeURIComponent(msg);
}

function openWhatsAppCheckout(cart, details) {
  let msg = "Hi CRYO Team! I want to place an order:\n\n";
  cart.forEach(item => {
    msg += `• ${item.name} (${item.size}, ${item.color}) x${item.qty} = Rs. ${item.offerPrice * item.qty}\n`;
  });
  msg += `\nSubtotal: Rs. ${getCartTotal()}`;
  msg += `\nDelivery: Rs. ${details.deliveryFee}`;
  msg += `\nTotal: Rs. ${getCartTotal() + details.deliveryFee}\n\n`;
  msg += `*Customer Details*\n`;
  msg += `Name: ${details.name}\n`;
  msg += `Phone: ${details.phone}\n`;
  msg += `City: ${details.city}\n`;
  msg += `Address: ${details.address}\n`;
  if(details.notes) msg += `Notes: ${details.notes}\n`;
  msg += `Payment Method: ${details.payment}\n`;
  
  window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
}

// --- Product Card Generation ---
function createProductCard(product) {
  return `
    <div class="product-card">
      <div class="product-image" onclick="window.location.href='product.html?product=${product.id}'">
        <img src="${product.image1L}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="placeholder ${product.color} bottle-1l" style="display:none;"><span>CRYO ${product.size}</span></div>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category || 'Radiator Coolant'}</div>
        <div class="product-title" onclick="window.location.href='product.html?product=${product.id}'">${product.name}</div>
        <div class="product-meta">
          <div class="product-price-col">
            <span class="offer-price">Rs. ${product.offerPrice}</span>
            <span class="regular-price">Rs. ${product.regularPrice}</span>
          </div>
          <div class="product-rating">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>
        </div>
      </div>
      <div class="product-actions-sharp" onclick="window.location.href='product.html?product=${product.id}'">
        <span class="btn-add-cart-text">View Details</span>
        <span class="btn-add-cart-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </span>
      </div>
    </div>
  `;
}

// --- Initialize App ---
document.addEventListener('DOMContentLoaded', () => {
  // Sticky Header with Hysteresis & WhatsApp Float toggle
  const header = document.querySelector('header');
  const waFloat = document.querySelector('.floating-wa');
  
  window.addEventListener('scroll', () => {
    // Header Sticky logic
    if (header) {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else if (window.scrollY < 40) {
        header.classList.remove('scrolled');
      }
    }
    
    // WhatsApp floating button show/hide logic (only visible when scrolled down)
    if (waFloat) {
      if (window.scrollY > 300) {
        waFloat.classList.add('visible');
      } else {
        waFloat.classList.remove('visible');
      }
    }
  });

  // Mobile Nav
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav-overlay');
  const closeMenu = document.querySelector('.close-menu');
  if(hamburger && mobileNav && closeMenu) {
    hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
    closeMenu.addEventListener('click', () => mobileNav.classList.remove('open'));
  }

  // Initialize Cart Badge
  updateCartBadge();

  // Page specific logic
  const path = window.location.pathname;
  if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
    initHomePage();
  } else if (path.includes('shop.html')) {
    initShopPage();
  } else if (path.includes('product.html')) {
    initProductPage();
  } else if (path.includes('cart.html')) {
    renderCart();
  } else if (path.includes('checkout.html')) {
    initCheckoutPage();
  } else if (path.includes('dealer.html')) {
    initDealerPage();
  }
});

// --- Home Page ---
function initHomePage() {
  const grid = document.getElementById('featured-products');
  if (grid) {
    grid.innerHTML = products.map(p => createProductCard(p)).join('');
  }
}

// --- Shop Page ---
function initShopPage() {
  const grid = document.getElementById('shop-products');
  const sortFilter = document.getElementById('filter-sort');
  
  // New Filter Elements
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const priceMin = document.getElementById('price-min');
  const priceMax = document.getElementById('price-max');
  const priceFilterBtn = document.getElementById('price-filter-btn');
  
  let currentSize = 'all';
  let currentColor = 'all';

  if (!grid) return;

  function renderShop() {
    let filtered = [...products];

    // Text Search Filter
    if (searchInput && searchInput.value.trim() !== '') {
      const q = searchInput.value.trim().toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
    }

    // Size Filter
    if (currentSize !== 'all') {
      filtered = filtered.filter(p => p.size === currentSize);
    }

    // Color Filter
    if (currentColor !== 'all') {
      filtered = filtered.filter(p => p.color === currentColor);
    }

    // Price Filter
    if (priceMin && priceMax) {
      const minVal = parseInt(priceMin.value);
      const maxVal = parseInt(priceMax.value);
      filtered = filtered.filter(p => p.offerPrice >= minVal && p.offerPrice <= maxVal);
    }

    // Sorting
    if (sortFilter) {
      if (sortFilter.value === 'low-high') {
        filtered.sort((a, b) => a.offerPrice - b.offerPrice);
      } else if (sortFilter.value === 'high-low') {
        filtered.sort((a, b) => b.offerPrice - a.offerPrice);
      }
    }
    grid.innerHTML = filtered.map(p => createProductCard(p)).join('');
  }

  if (sortFilter) sortFilter.addEventListener('change', renderShop);
  
  // Search Events
  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') renderShop();
    });
  }
  if (searchBtn) searchBtn.addEventListener('click', renderShop);

  // Price Filter Event
  if (priceFilterBtn) priceFilterBtn.addEventListener('click', renderShop);

  // Category Buttons Events
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Handle active class toggling
      const currentBtn = e.currentTarget;
      const parentList = currentBtn.closest('.category-btn-list');
      if (parentList) {
        parentList.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        currentBtn.classList.add('active');
      }
      
      // Update state
      const filterVal = currentBtn.dataset.filter;
      if (parentList.id === 'filter-size-list') currentSize = filterVal;
      if (parentList.id === 'filter-color-list') currentColor = filterVal;
      
      renderShop();
    });
  });

  renderShop();
}

// --- Product Page ---
function initProductPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('product') || 'green-1l';
  let product = products.find(p => p.id === productId);
  if (!product) product = products[0];

  let currentSize = product.size;
  let currentColor = product.color;
  let currentQty = 1;

  // Set initial info
  document.getElementById('product-title').textContent = product.name;
  const breadcrumbTitle = document.getElementById('product-title-breadcrumb');
  if (breadcrumbTitle) {
    breadcrumbTitle.textContent = product.name;
  }

  // Render size thumbnails dynamically matching the product color
  const thumbRow = document.querySelector('.thumbnail-row');
  if (thumbRow) {
    thumbRow.innerHTML = `
      <div class="thumbnail" data-size="1L">
        <img src="${product.image1L}" alt="${product.name} 1L" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="placeholder ${product.color} bottle-1l" style="display:none; font-size: 8px;"><span>${product.color.toUpperCase()} 1L</span></div>
      </div>
      <div class="thumbnail" data-size="4L">
        <img src="${product.image4L}" alt="${product.name} 4L" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="placeholder ${product.color} bottle-4l" style="display:none; font-size: 8px;"><span>${product.color.toUpperCase()} 4L</span></div>
      </div>
    `;

    // Handle thumbnail clicks
    thumbRow.querySelectorAll('.thumbnail').forEach(thumb => {
      thumb.addEventListener('click', () => {
        const size = thumb.dataset.size;
        const sizeBtn = document.querySelector(`.size-toggle[data-size="${size}"]`);
        if (sizeBtn) {
          sizeBtn.click();
        }
      });
    });
  }

  // Update active thumbnail highlight helper function
  function updateActiveThumbnail() {
    document.querySelectorAll('.thumbnail').forEach(t => {
      if (t.dataset.size === currentSize) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });
  }
  
  function updatePriceDisplay() {
    // Find matching product based on size and color to get correct prices
    const targetProduct = products.find(p => p.color === currentColor && p.size === currentSize) || product;
    document.getElementById('reg-price').textContent = `Rs. ${targetProduct.regularPrice}`;
    document.getElementById('off-price').textContent = `Rs. ${targetProduct.offerPrice}`;
  }
  
  function updateImageDisplay() {
    const targetProduct = products.find(p => p.color === currentColor && p.size === currentSize) || product;
    const imgEl = document.getElementById('main-image-el');
    const phEl = document.getElementById('main-placeholder-el');
    const imageSrc = currentSize === '1L' ? targetProduct.image1L : targetProduct.image4L;
    
    imgEl.src = imageSrc;
    imgEl.style.display = 'block';
    phEl.style.display = 'none';
    
    imgEl.onerror = () => {
      imgEl.style.display = 'none';
      phEl.className = `placeholder ${currentColor} bottle-hero`;
      phEl.innerHTML = `<span>CRYO ${currentSize}</span>`;
      phEl.style.display = 'flex';
    };
  }

  updatePriceDisplay();
  updateImageDisplay();
  updateActiveThumbnail();

  // Size toggles
  document.querySelectorAll('.size-toggle').forEach(btn => {
    if(btn.dataset.size === currentSize) btn.classList.add('active');
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.size-toggle').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentSize = e.target.dataset.size;
      updatePriceDisplay();
      updateImageDisplay();
      updateActiveThumbnail();
    });
  });

  // Qty
  const qtyInput = document.getElementById('qty-input');
  document.getElementById('qty-minus').addEventListener('click', () => {
    if (currentQty > 1) { currentQty--; qtyInput.value = currentQty; }
  });
  document.getElementById('qty-plus').addEventListener('click', () => {
    if (currentQty < 99) { currentQty++; qtyInput.value = currentQty; }
  });
  qtyInput.addEventListener('change', (e) => {
    let val = parseInt(e.target.value);
    if(isNaN(val) || val < 1) val = 1;
    if(val > 99) val = 99;
    currentQty = val;
    qtyInput.value = currentQty;
  });

  // Buttons
  document.getElementById('add-to-cart-btn').addEventListener('click', () => {
    // We add the specific variant the user selected
    const targetProduct = products.find(p => p.color === currentColor && p.size === currentSize) || product;
    addToCart(targetProduct.id, currentQty, currentSize, currentColor, true);
  });

  const buyNowBtn = document.getElementById('buy-now-btn');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      const targetProduct = products.find(p => p.color === currentColor && p.size === currentSize) || product;
      addToCart(targetProduct.id, currentQty, currentSize, currentColor, false);
      window.location.href = 'checkout.html';
    });
  }

  document.getElementById('wa-buy-btn').addEventListener('click', () => {
    const targetProduct = products.find(p => p.color === currentColor && p.size === currentSize) || product;
    const msg = `Hi CRYO Team! I want to buy:\n\n• ${targetProduct.name} (${currentSize}, ${currentColor})\nQuantity: ${currentQty}\nPrice: Rs. ${targetProduct.offerPrice * currentQty}`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  });

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      e.target.classList.add('active');
      document.getElementById(e.target.dataset.tab).classList.add('active');
    });
  });

  // Related products
  const related = document.getElementById('related-products');
  if(related) {
    const others = products.filter(p => p.id !== product.id).slice(0, 3);
    related.innerHTML = others.map(p => createProductCard(p)).join('');
  }
}

// --- Cart Page ---
function renderCart() {
  const tbody = document.getElementById('cart-tbody');
  const emptyMsg = document.getElementById('cart-empty');
  const cartTable = document.getElementById('cart-table');
  const cartSummary = document.getElementById('cart-summary');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  
  if (!tbody) return;

  const cart = getCart();

  if (cart.length === 0) {
    emptyMsg.style.display = 'block';
    cartTable.style.display = 'none';
    cartSummary.style.display = 'none';
    return;
  }

  emptyMsg.style.display = 'none';
  cartTable.style.display = 'table';
  cartSummary.style.display = 'block';

  tbody.innerHTML = '';
  cart.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="cart-item-details">
          <div class="cart-item-img">
            <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="placeholder ${item.color} bottle-1l" style="display:none;font-size:10px;"><span>${item.size}</span></div>
          </div>
          <div>
            <strong>${item.name}</strong><br>
            <small>Size: ${item.size} | Color: ${item.color}</small>
          </div>
        </div>
      </td>
      <td>Rs. ${item.offerPrice}</td>
      <td>
        <div class="qty-selector" style="width:100px;">
          <button class="qty-btn" onclick="updateQuantity(${index}, ${item.qty - 1})">−</button>
          <input type="text" class="qty-input" value="${item.qty}" readonly style="width:30px;">
          <button class="qty-btn" onclick="updateQuantity(${index}, ${item.qty + 1})">+</button>
        </div>
      </td>
      <td><strong>Rs. ${item.offerPrice * item.qty}</strong></td>
      <td><button class="remove-btn" onclick="removeFromCart(${index})"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></td>
    `;
    tbody.appendChild(tr);
  });

  const total = getCartTotal();
  subtotalEl.textContent = `Rs. ${total}`;
  totalEl.textContent = `Rs. ${total}`;

  const waBtn = document.getElementById('cart-wa-btn');
  if (waBtn) {
    waBtn.onclick = () => {
      window.open(`https://wa.me/${waNumber}?text=${buildWhatsAppMessage(cart)}`, '_blank');
    };
  }
}

// --- Checkout Page ---
function initCheckoutPage() {
  const cart = getCart();
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  // Render Order Review
  const reviewEl = document.getElementById('checkout-review-items');
  const totalEl = document.getElementById('checkout-total');
  
  if (reviewEl) {
    reviewEl.innerHTML = cart.map(item => `
      <div class="summary-row">
        <span>${item.name} (${item.size}) x${item.qty}</span>
        <span>Rs. ${item.offerPrice * item.qty}</span>
      </div>
    `).join('');
  }

  let deliveryFee = 200; // default standard
  
  function updateTotal() {
    const subtotal = getCartTotal();
    document.getElementById('checkout-subtotal').textContent = `Rs. ${subtotal}`;
    document.getElementById('checkout-delivery').textContent = `Rs. ${deliveryFee}`;
    totalEl.textContent = `Rs. ${subtotal + deliveryFee}`;
  }
  
  updateTotal();

  // Delivery options
  document.querySelectorAll('input[name="delivery"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      deliveryFee = parseInt(e.target.value);
      updateTotal();
    });
  });

  // Payment details toggle
  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      document.querySelectorAll('.payment-details').forEach(d => d.style.display = 'none');
      const details = document.getElementById(`details-${e.target.value}`);
      if(details) details.style.display = 'block';
    });
  });

  // Form Submit
  const form = document.getElementById('checkout-form');
  if(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic validation
      let isValid = true;
      const reqFields = ['name', 'phone', 'city', 'address'];
      reqFields.forEach(id => {
        const el = document.getElementById(`chk-${id}`);
        const err = document.getElementById(`err-${id}`);
        if(!el.value.trim()) {
          isValid = false;
          el.style.borderColor = 'var(--primary)';
          err.style.display = 'block';
        } else {
          el.style.borderColor = 'var(--border)';
          err.style.display = 'none';
        }
      });

      if(!isValid) return;

      const details = {
        name: document.getElementById('chk-name').value,
        phone: document.getElementById('chk-phone').value,
        city: document.getElementById('chk-city').value,
        address: document.getElementById('chk-address').value,
        notes: document.getElementById('chk-notes').value,
        deliveryFee: deliveryFee,
        payment: document.querySelector('input[name="payment"]:checked').value
      };

      // Show success modal
      document.getElementById('success-modal').style.display = 'flex';
      
      // Open WA after a short delay
      setTimeout(() => {
        openWhatsAppCheckout(cart, details);
        clearCart();
        window.location.href = 'index.html';
      }, 3000);
    });
  }
}

// --- Dealer Page ---
function initDealerPage() {
  const form = document.getElementById('dealer-form');
  if(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const reqFields = ['dlr-business', 'dlr-name', 'dlr-phone', 'dlr-city'];
      reqFields.forEach(id => {
        const el = document.getElementById(id);
        const err = document.getElementById(`err-${id}`);
        if(!el.value.trim()) {
          isValid = false;
          el.style.borderColor = 'var(--primary)';
          err.style.display = 'block';
        } else {
          el.style.borderColor = 'var(--border)';
          err.style.display = 'none';
        }
      });

      if(!isValid) return;

      const business = document.getElementById('dlr-business').value;
      const name = document.getElementById('dlr-name').value;
      const phone = document.getElementById('dlr-phone').value;
      const city = document.getElementById('dlr-city').value;
      const type = document.getElementById('dlr-type').value;
      const qty = document.getElementById('dlr-qty').value;
      const address = document.getElementById('dlr-address').value;
      const notes = document.getElementById('dlr-notes').value;

      const msg = `Hi CRYO Team! I'm interested in becoming a dealer.\n\nBusiness: ${business}\nContact: ${name}\nCity: ${city}\nType: ${type}\nMonthly Need: ${qty}\nWhatsApp: ${phone}\nAddress: ${address}\nNotes: ${notes}\n\nPlease share wholesale pricing and terms.`;
      
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }
}

// --- Dual Range Slider Logic ---
document.addEventListener('DOMContentLoaded', () => {
  const priceMin = document.getElementById('price-min');
  const priceMax = document.getElementById('price-max');
  const priceMinVal = document.getElementById('price-min-val');
  const priceMaxVal = document.getElementById('price-max-val');
  const sliderTrack = document.getElementById('slider-track');

  if (priceMin && priceMax && sliderTrack) {
    const minGap = 100;

    function formatRs(num) {
      return 'Rs. ' + parseInt(num).toLocaleString();
    }

    function updateSlider() {
      let minVal = parseInt(priceMin.value);
      let maxVal = parseInt(priceMax.value);

      if (maxVal - minVal < minGap) {
        if (this === priceMin) {
          priceMin.value = maxVal - minGap;
          minVal = parseInt(priceMin.value);
        } else {
          priceMax.value = minVal + minGap;
          maxVal = parseInt(priceMax.value);
        }
      }

      priceMinVal.textContent = formatRs(minVal);
      priceMaxVal.textContent = formatRs(maxVal);

      const minAbs = parseInt(priceMin.min);
      const maxAbs = parseInt(priceMax.max);
      const percentMin = ((minVal - minAbs) / (maxAbs - minAbs)) * 100;
      const percentMax = 100 - (((maxVal - minAbs) / (maxAbs - minAbs)) * 100);

      sliderTrack.style.left = percentMin + '%';
      sliderTrack.style.right = percentMax + '%';
    }

    priceMin.addEventListener('input', updateSlider);
    priceMax.addEventListener('input', updateSlider);
    
    // Initial call
    updateSlider.call(priceMin);
  }
});
