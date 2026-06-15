// --- Global State ---
let products = [];
let waNumber = '923014138007';
let defaultDeliveryFee = 200;

// Function to fetch data from Supabase before initializing the app
async function fetchSupabaseData() {
  try {
    // Fetch global settings
    if (typeof supabaseClient !== 'undefined') {
      const { data: settingsData, error: settingsError } = await supabaseClient.from('settings').select('*').eq('id', 'global').single();
      if (!settingsError && settingsData) {
        if (settingsData.whatsappNumber) waNumber = settingsData.whatsappNumber;
        if (settingsData.deliveryCharge) defaultDeliveryFee = settingsData.deliveryCharge;
      }

      // Fetch products
      const { data: productsData, error: productsError } = await supabaseClient.from('products').select('*').eq('inStock', true);
      if (!productsError && productsData) {
        products = productsData.map(data => {
          return {
            id: data.id,
            name: data.name,
            color: data.color,
            size: data.size || '1L',
            regularPrice: data.regularPrice || 0,
            offerPrice: data.offerPrice || 0,
            imageUrl: data.imageUrl || '../assets/images/placeholder.png',
            shortDescription: data.shortDescription || '',
            longDescription: data.longDescription || '',
            features: data.features || '',
            specifications: data.specifications || '',
            colorHex: data.color === 'red' ? '#E53935' : (data.color === 'blue' ? '#1E88E5' : '#4CAF50')
          };
        });
      }
    }
  } catch (error) {
    console.error("Error fetching data from Supabase:", error);
    // Fallback or empty state handled gracefully
  }
}


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
  const badges = document.querySelectorAll('.cart-badge');
  const count = getCartCount();
  badges.forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

function addToCart(productId, quantity, size, color, showAlert = true) {
  const cart = getCart();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItemIndex = cart.findIndex(item => item.id === productId && item.size === size && item.color === color);
  
  if (existingItemIndex > -1) {
    cart[existingItemIndex].qty += parseInt(quantity);
  } else {
    let selectedOfferPrice = product.offerPrice;
    let selectedRegPrice = product.regularPrice;
    let selectedImage = product.imageUrl;

    cart.push({
      id: product.id,
      name: product.name,
      size: size,
      color: color,
      qty: parseInt(quantity),
      offerPrice: selectedOfferPrice,
      regularPrice: selectedRegPrice,
      image: selectedImage
    });
  }
  saveCart(cart);
  if (showAlert) {
    showToast('Added to cart successfully!');
  }
}

// --- Toast Notification ---
function showToast(message) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = '9999';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '10px';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.style.background = '#111';
  toast.style.color = '#fff';
  toast.style.padding = '12px 20px';
  toast.style.borderRadius = '4px';
  toast.style.borderLeft = '4px solid #E8211D';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  toast.style.fontFamily = "'Inter', sans-serif";
  toast.style.fontSize = '14px';
  toast.style.opacity = '0';
  toast.style.transform = 'translateX(100%)';
  toast.style.transition = 'all 0.3s ease';
  toast.innerText = message;

  toastContainer.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  }, 10);

  // Animate out and remove
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if(toast.parentElement) toast.remove();
    }, 300);
  }, 3000);
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
  let regPrice = Number(product.regularPrice || 0);
  let offPrice = Number(product.offerPrice || 0);
  let discountBadge = '';
  if (regPrice > offPrice && offPrice > 0) {
    discountBadge = `<div class="discount-badge">-20%</div>`;
  }

  return `
    <div class="product-card">
      <div class="product-image" onclick="window.location.href='product.html?product=${product.id}'">
        ${discountBadge}
        <div class="quick-view-icon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <img src="${product.imageUrl}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="placeholder ${product.color} bottle-1l" style="display:none;"><span>CRYO ${product.size}</span></div>
        <div class="hover-add-btn">VIEW DETAILS</div>
      </div>
      <div class="product-info">
        <div class="product-brand">${(product.category || 'Radiator Coolant').toUpperCase()} ${product.size}</div>
        <div class="product-title" onclick="window.location.href='product.html?product=${product.id}'">${product.name}</div>
        <div class="product-price-row">
          <span class="regular-price">Rs. ${product.regularPrice || 0}</span>
          <span class="offer-price">Rs. ${product.offerPrice || 0}</span>
        </div>
        <div class="product-rating">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </div>
      </div>
    </div>
  `;
}

// --- Initialize App ---
document.addEventListener('DOMContentLoaded', async () => {
  await fetchSupabaseData();

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

  // Global Header Search functionality
  document.querySelectorAll('.mobile-search').forEach(searchContainer => {
    const input = searchContainer.querySelector('input');
    const svgBtn = searchContainer.querySelector('svg');
    const doSearch = () => {
      if (input && input.value.trim() !== '') {
        window.location.href = `shop.html?q=${encodeURIComponent(input.value.trim())}`;
      }
    };
    if (input) {
      input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') doSearch();
      });
    }
    if (svgBtn) {
      svgBtn.addEventListener('click', doSearch);
      svgBtn.style.cursor = 'pointer';
    }
  });

  document.querySelectorAll('.search-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = 'shop.html?focus=search';
    });
  });

  // Initialize Cart Badge
  updateCartBadge();

  // Page specific logic
  const path = window.location.pathname;
  if (path.includes('index') || path === '/' || path.endsWith('/')) {
    initHomePage();
  } else if (path.includes('shop')) {
    initShopPage();
  } else if (path.includes('product')) {
    initProductPage();
  } else if (path.includes('cart')) {
    renderCart();
  } else if (path.includes('checkout')) {
    initCheckoutPage();
  } else if (path.includes('dealer')) {
    initDealerPage();
  } else if (path.includes('contact')) {
    initContactPage();
  }
});

// --- Home Page ---
function initHomePage() {
  const grid = document.getElementById('featured-products');
  if (grid) {
    grid.innerHTML = products.slice(0, 6).map(p => createProductCard(p)).join('');
  }
}

// --- Shop Page ---
function initShopPage() {
  const grid = document.getElementById('shop-products');
  const sortFilter = document.getElementById('filter-sort');
  
  // Mobile Sidebar Toggle
  const filterBtn = document.getElementById('mobile-filter-btn');
  const sidebar = document.getElementById('shop-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const closeBtn = document.getElementById('sidebar-close');

  if (filterBtn && sidebar && overlay && closeBtn) {
    filterBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    const closeSidebar = () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
  }
  
  // New Filter Elements
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const priceMin = document.getElementById('price-min');
  const priceMax = document.getElementById('price-max');
  const priceFilterBtn = document.getElementById('price-filter-btn');
  
  // Handle URL parameters for global search
  const urlParams = new URLSearchParams(window.location.search);
  const qParam = urlParams.get('q');
  const focusParam = urlParams.get('focus');
  
  if (qParam && searchInput) {
    searchInput.value = qParam;
  }
  
  if (focusParam === 'search' && searchInput) {
    const filterBtn = document.getElementById('mobile-filter-btn');
    if (filterBtn && window.innerWidth <= 768) {
      filterBtn.click();
    }
    setTimeout(() => searchInput.focus(), 500);
  }
  
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
      const minStr = priceMin.value.trim();
      const maxStr = priceMax.value.trim();
      if (minStr !== '' || maxStr !== '') {
        const minVal = minStr !== '' ? parseInt(minStr) : 0;
        const maxVal = maxStr !== '' ? parseInt(maxStr) : Infinity;
        filtered = filtered.filter(p => {
          const cardPrice = Number(p.offerPrice || 0);
          return cardPrice >= minVal && cardPrice <= maxVal;
        });
      }
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

  // Custom Dropdown Logic
  const sortSelected = document.getElementById('sort-selected');
  const sortOptions = document.getElementById('sort-options');
  
  if (sortSelected && sortOptions) {
    sortSelected.addEventListener('click', (e) => {
      e.stopPropagation();
      sortOptions.classList.toggle('open');
    });
    
    document.addEventListener('click', () => {
      sortOptions.classList.remove('open');
    });
    
    const options = sortOptions.querySelectorAll('.sort-option');
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        sortSelected.querySelector('span').innerText = opt.innerText;
        if (sortFilter) {
          sortFilter.value = opt.getAttribute('data-value');
          renderShop();
        }
      });
    });
  }
  
  // Search Events
  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') renderShop();
    });
    searchInput.addEventListener('input', () => {
      if (searchInput.value.trim() === '') {
        renderShop();
      }
    });
  }
  if (searchBtn) searchBtn.addEventListener('click', renderShop);

  // Price Filter Event
  if (priceFilterBtn) priceFilterBtn.addEventListener('click', renderShop);
  if (priceMin) priceMin.addEventListener('input', renderShop);
  if (priceMax) priceMax.addEventListener('input', renderShop);

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

  let currentSize = '1L';
  let currentColor = product.color;
  let currentQty = 1;

  // Set initial info
  document.getElementById('product-title').textContent = product.name;
  const breadcrumbTitle = document.getElementById('product-title-breadcrumb');
  if (breadcrumbTitle) {
    breadcrumbTitle.textContent = product.name;
  }

  // Render size thumbs removed since size is fixed per product
  const thumbRow = document.querySelector('.thumbnail-row');
  if (thumbRow) {
    thumbRow.innerHTML = ''; // Clear out thumbnails
  }
  
  function updatePriceDisplay() {
    let regPrice = Number(product.regularPrice || 0);
    let offPrice = Number(product.offerPrice || 0);
    
    const regEl = document.getElementById('reg-price');
    const offEl = document.getElementById('off-price');
    const badgeEl = document.getElementById('discount-badge-el');
    
    if (regEl) regEl.textContent = `Rs. ${regPrice}`;
    if (offEl) offEl.textContent = `Rs. ${offPrice}`;
    
    if (badgeEl) {
      if (regPrice > offPrice && offPrice > 0) {
        badgeEl.textContent = `-20%`;
        badgeEl.style.display = 'block';
      } else {
        badgeEl.style.display = 'none';
      }
    }
  }
  
  function updateImageDisplay() {
    const imgEl = document.getElementById('main-image-el');
    const phEl = document.getElementById('main-placeholder-el');
    let imageSrc = product.imageUrl;
    
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

  function updateTextContent() {
    const shortDesc = document.getElementById('product-short-desc');
    if (shortDesc) shortDesc.innerHTML = product.shortDescription || '';

    const longDesc = document.getElementById('product-long-desc');
    if (longDesc) longDesc.innerHTML = product.longDescription || '';

    const features = document.getElementById('product-features');
    if (features) features.innerHTML = product.features || '';

    const specs = document.getElementById('product-specs');
    if (specs) specs.innerHTML = product.specifications || '';
  }

  updatePriceDisplay();
  updateImageDisplay();
  updateTextContent();
  
  // Update UI to reflect the product's actual size
  document.querySelectorAll('.size-toggle').forEach(btn => {
    btn.style.display = 'none'; // hide the size buttons entirely
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
    addToCart(product.id, currentQty, product.size, currentColor, true);
  });

  const buyNowBtn = document.getElementById('buy-now-btn');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      addToCart(product.id, currentQty, product.size, currentColor, false);
      window.location.href = 'cart.html';
    });
  }

  document.getElementById('wa-buy-btn').addEventListener('click', () => {
    const msg = `Hi CRYO Team! I want to buy:\n\n• ${product.name} (${product.size}, ${currentColor})\nQuantity: ${currentQty}\nPrice: Rs. ${product.offerPrice * currentQty}`;
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

      // Create Order Object
      const orderRecord = {
        customerName: details.name,
        phone: details.phone,
        city: details.city,
        address: details.address,
        notes: details.notes,
        deliveryFee: details.deliveryFee,
        paymentMethod: details.payment,
        items: cart.map(i => ({ name: i.name, size: i.size, color: i.color, qty: i.qty, price: i.offerPrice })),
        total: getCartTotal() + details.deliveryFee,
        status: 'Pending'
      };

      // Save to Supabase
      if (typeof supabaseClient !== 'undefined') {
        supabaseClient.from('orders').insert([orderRecord]).then(({ error }) => {
          if (error) console.error("Error saving order:", error);
        });
      }

      // Show success modal
      document.getElementById('success-modal').style.display = 'flex';
      
      // Open WA after a short delay
      setTimeout(() => {
        openWhatsAppCheckout(cart, details);
        clearCart();
      }, 1500);
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
          if(err) err.style.display = 'block';
        } else {
          el.style.borderColor = 'var(--border)';
          if(err) err.style.display = 'none';
        }
      });

      if(!isValid) return;

      const business = document.getElementById('dlr-business').value;
      const name = document.getElementById('dlr-name').value;
      const phone = document.getElementById('dlr-phone').value;
      const city = document.getElementById('dlr-city').value;
      const type = document.getElementById('dlr-type').value;
      const qty = document.getElementById('dlr-qty').value;
      const address = document.getElementById('dlr-address') ? document.getElementById('dlr-address').value : 'N/A';
      const notes = document.getElementById('dlr-notes') ? document.getElementById('dlr-notes').value : 'N/A';

      const msg = `Hi CRYO Team! I'm interested in becoming a dealer.\n\nBusiness: ${business}\nContact: ${name}\nCity: ${city}\nType: ${type}\nMonthly Need: ${qty}\nWhatsApp: ${phone}\nAddress: ${address}\nNotes: ${notes}\n\nPlease share wholesale pricing and terms.`;
      
      const successMsg = document.getElementById('dealer-success-msg');
      if (successMsg) successMsg.style.display = 'block';
      
      setTimeout(() => {
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
      }, 500);
    });
  }
}

// --- Contact Page ---
function initContactPage() {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = document.getElementById('c-msg') ? document.getElementById('c-msg').value : '';
      const successMsg = document.getElementById('contact-success-msg');
      if (successMsg) successMsg.style.display = 'block';
      
      setTimeout(() => {
        window.location.href = 'mailto:info@cryocoolant.com?subject=Contact Inquiry&body=' + encodeURIComponent(msg);
      }, 500);
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
