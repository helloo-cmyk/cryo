// --- Global State ---
let products = [];
let waNumber = '923014138007';
let defaultDeliveryFee = 200;
let expressDeliveryFee = 350;
let siteSettings = {};

// Function to fetch data from Supabase before initializing the app
async function fetchSupabaseData() {
  try {
    // Fetch global settings
    if (typeof supabaseClient !== 'undefined') {
      const { data: settingsData, error: settingsError } = await supabaseClient.from('settings').select('*').eq('id', 'global').single();
      if (!settingsError && settingsData) {
        siteSettings = settingsData;
        if (settingsData.whatsappNumber) waNumber = settingsData.whatsappNumber;
        if (settingsData.deliveryCharge !== undefined && settingsData.deliveryCharge !== null) {
          defaultDeliveryFee = settingsData.deliveryCharge;
        }
        if (settingsData.expressDeliveryCharge !== undefined && settingsData.expressDeliveryCharge !== null) {
          expressDeliveryFee = settingsData.expressDeliveryCharge;
        }
      }

      // Load CMS + testimonials from page_content
      if (typeof window.loadSiteCms === 'function') {
        const cms = await window.loadSiteCms();
        siteSettings = { ...siteSettings, ...cms };
        cmsSettings = { ...cms, whatsappNumber: waNumber };
      }
      if (typeof window.loadTestimonials === 'function') {
        window.cmsTestimonials = await window.loadTestimonials();
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
            shortDescription: data.shortDescription || 'CRYO Premium Radiator Coolant provides ultimate protection against overheating and corrosion. Engineered for extreme climates, it ensures your engine runs smoother and lasts longer.',
            longDescription: data.longDescription || 'CRYO Premium Radiator Coolant is a technologically advanced thermal management solution designed to protect your vehicle\'s engine from the most extreme temperature fluctuations. Whether you are navigating through scorching summer traffic or operating heavy-duty industrial machinery, CRYO maintains optimal engine temperatures to prevent boiling over and thermal breakdown.<br><br>Formulated with an exclusive anti-rust and anti-corrosion additive package, it forms a protective shield inside your radiator, water pump, and engine block. This prevents the buildup of harmful scale and rust that can lead to costly repairs. CRYO is pre-mixed and ready to use, offering a hassle-free, pour-and-go experience that guarantees long-lasting performance and peak engine efficiency.',
            features: data.features || `<ul class="benefits-list" style="margin-top: 10px;">
  <li style="margin-bottom: 10px;"><strong>Advanced Heat Transfer:</strong> Maximizes engine cooling efficiency even under heavy loads.</li>
  <li style="margin-bottom: 10px;"><strong>Anti-Corrosion Formula:</strong> Protects metal parts, including aluminum, brass, and copper, from rust and scaling.</li>
  <li style="margin-bottom: 10px;"><strong>Ready to Use:</strong> Pre-diluted with deionized water for immediate pour-and-go application. No mixing required.</li>
  <li style="margin-bottom: 10px;"><strong>Universal Compatibility:</strong> Safe for use in all passenger cars, commercial trucks, and industrial generators.</li>
  <li style="margin-bottom: 10px;"><strong>Long-Life Protection:</strong> Engineered to last up to 2 years or 40,000 kilometers under normal driving conditions.</li>
</ul>`,
            specifications: data.specifications || `<table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
  <tbody>
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px 0; font-weight: bold; width: 40%; color: #333;">Brand</td>
      <td style="padding: 10px 0; color: #666;">CRYO</td>
    </tr>
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px 0; font-weight: bold; color: #333;">Volume</td>
      <td style="padding: 10px 0; color: #666;">1 Liter / 4 Liters</td>
    </tr>
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px 0; font-weight: bold; color: #333;">Type</td>
      <td style="padding: 10px 0; color: #666;">Ready to Use (Pre-Mixed)</td>
    </tr>
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px 0; font-weight: bold; color: #333;">Lifespan</td>
      <td style="padding: 10px 0; color: #666;">2 Years / 40,000 KM</td>
    </tr>
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px 0; font-weight: bold; color: #333;">Application</td>
      <td style="padding: 10px 0; color: #666;">Automobiles, Generators, Industrial</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; font-weight: bold; color: #333;">Boiling Point</td>
      <td style="padding: 10px 0; color: #666;">Up to 105°C (in pressurized system)</td>
    </tr>
  </tbody>
</table>`,
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

// --- Skeleton Loader Generation ---
function createSkeletonCard() {
  return `
    <div class="product-card" style="pointer-events: none; border: none; box-shadow: none;">
      <div class="skeleton-image skeleton-pulse"></div>
      <div class="product-info" style="padding: 10px 0;">
        <div class="skeleton-text skeleton-pulse short"></div>
        <div class="skeleton-text skeleton-pulse long" style="margin-top: 15px;"></div>
        <div class="skeleton-price-row">
          <div class="skeleton-text skeleton-pulse short"></div>
        </div>
      </div>
    </div>
  `;
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
        <button class="quick-add-cart-btn" onclick="event.stopPropagation(); addToCart('${product.id}', 1, '${product.size}', '${product.color}', true)" aria-label="Add to cart">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        </button>
        <img src="${product.imageUrl}" alt="${product.name}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
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
  // Inject skeletons before fetching data
  const path = window.location.pathname;
  const isHome = path.includes('index') || path === '/' || path.endsWith('/');
  const isShop = path.includes('shop');
  
  if (isHome) {
    const featuredGrid = document.getElementById('featured-products');
    if (featuredGrid) {
      featuredGrid.innerHTML = Array(4).fill(createSkeletonCard()).join('');
    }
  } else if (isShop) {
    const shopGrid = document.getElementById('shop-products');
    if (shopGrid) {
      shopGrid.innerHTML = Array(8).fill(createSkeletonCard()).join('');
    }
  }

  await fetchSupabaseData();
  if (typeof window.cmsLoadData === 'function') {
    await window.cmsLoadData();
    if (typeof window.cmsApplyAll === 'function') {
      window.cmsApplyAll({ whatsappNumber: waNumber, ...siteSettings });
    }
  }
  applyDynamicSettings();

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
    
    const resultsCountEl = document.getElementById('shop-results-count');
    if (resultsCountEl) {
      if (filtered.length === 0) {
        resultsCountEl.textContent = 'Showing 0 results';
      } else if (filtered.length < products.length) {
        resultsCountEl.textContent = `Showing 1–${filtered.length} of ${products.length} results`;
      } else {
        resultsCountEl.textContent = `Showing all ${products.length} results`;
      }
    }
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
  const titleEl = document.getElementById('product-title');
  titleEl.textContent = product.name;
  titleEl.classList.remove('skeleton-pulse', 'skeleton-text', 'long');
  titleEl.style.minHeight = 'auto';
  
  const ratingStars = document.getElementById('product-rating-stars');
  if (ratingStars) ratingStars.style.opacity = '1';
  const ratingContainer = document.getElementById('product-rating-container');
  if (ratingContainer) ratingContainer.classList.remove('skeleton-pulse', 'skeleton-text', 'medium');

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
    const priceSection = document.getElementById('price-section-container');
    
    if (regEl) {
      regEl.textContent = `Rs. ${regPrice}`;
      regEl.style.display = 'inline-block';
    }
    if (offEl) {
      offEl.textContent = `Rs. ${offPrice}`;
      offEl.style.display = 'inline-block';
    }
    if (priceSection) {
      priceSection.classList.remove('skeleton-pulse', 'skeleton-text', 'short');
      priceSection.style.minHeight = 'auto';
    }
    
    if (badgeEl) {
      badgeEl.style.display = 'none';
    }
  }
  
  function updateImageDisplay() {
    const imgEl = document.getElementById('main-image-el');
    const phEl = document.getElementById('main-placeholder-el');
    let imageSrc = product.imageUrl;
    
    imgEl.src = imageSrc;
    // imgEl.style.display = 'block'; // Handled by onload in HTML now to ensure skeleton stays until loaded
    phEl.style.display = 'none';
    
    imgEl.onerror = () => {
      imgEl.style.display = 'none';
      phEl.className = `placeholder ${currentColor} bottle-hero`;
      phEl.innerHTML = `<span>CRYO ${currentSize}</span>`;
      phEl.style.display = 'flex';
      const wrapper = document.getElementById('main-image-wrapper');
      if (wrapper) wrapper.classList.remove('skeleton-pulse', 'skeleton-image');
    };
  }

  function updateTextContent() {
    const shortDesc = document.getElementById('product-short-desc');
    if (shortDesc) {
      if (product.shortDescription) {
        shortDesc.innerHTML = product.shortDescription;
        shortDesc.classList.remove('skeleton-pulse', 'skeleton-text', 'long');
        shortDesc.style.minHeight = 'auto';
      } else {
        shortDesc.style.display = 'none';
      }
    }

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
    const others = products.filter(p => p.id !== product.id).slice(0, 4);
    related.innerHTML = others.map(p => createProductCard(p)).join('');
  }

  // Initialize reviews for this product page
  initProductReviews(product);
}

// --- Customer Reviews Section ---
let allProductReviewsList = [];

async function initProductReviews(product) {
  const modalProductName = document.getElementById('modal-product-name');
  if (modalProductName) modalProductName.textContent = product.name;

  // Load reviews from page_content (product_reviews)
  try {
    if (typeof window.loadProductReviews === 'function') {
      if (typeof window.loadAllProductReviewsAdmin === 'function') {
        allProductReviewsList = await window.loadAllProductReviewsAdmin() || [];
      } else {
        allProductReviewsList = await window.loadProductReviews() || [];
      }
    }
  } catch (e) {
    console.error("Failed to load product reviews:", e);
    allProductReviewsList = [];
  }

  renderReviewsTab(product);
  setupReviewModalEvents(product);
}

function renderReviewsTab(product) {
  // Filter active reviews for this product
  const productReviews = allProductReviewsList.filter(r => r.product_id === product.id && r.is_active !== false);

  const totalCount = productReviews.length;
  let avgRating = 0;
  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  if (totalCount > 0) {
    let sum = 0;
    productReviews.forEach(r => {
      const rating = Math.round(Number(r.rating || 5));
      sum += rating;
      if (starCounts[rating] !== undefined) {
        starCounts[rating]++;
      }
    });
    avgRating = (sum / totalCount).toFixed(1);
  } else {
    avgRating = "0.0";
  }

  // Update product details header rating stars
  const mainStarsContainer = document.getElementById('product-rating-stars');
  if (mainStarsContainer) {
    mainStarsContainer.style.opacity = '1';
    let starsHtml = '';
    const roundedAvg = Math.round(Number(avgRating));
    for (let i = 1; i <= 5; i++) {
      const fill = i <= (roundedAvg || 5) ? 'var(--accent-gold)' : 'none';
      const stroke = i <= (roundedAvg || 5) ? 'none' : 'currentColor';
      starsHtml += `<svg width="16" height="16" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="2" style="display:inline;margin-right:2px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    }
    starsHtml += `<span style="color: var(--text-muted); margin-left: 10px; font-weight: 600;" id="product-rating-summary-text">${avgRating} (${totalCount} review${totalCount === 1 ? '' : 's'})</span>`;
    mainStarsContainer.innerHTML = starsHtml;
  }

  // Update tabs reviews count
  const tabReviewsBtn = document.getElementById('tab-reviews-btn');
  if (tabReviewsBtn) {
    tabReviewsBtn.textContent = `Reviews (${totalCount})`;
  }

  // Update tab overall metrics summary
  const avgRatingVal = document.getElementById('avg-rating-val');
  if (avgRatingVal) avgRatingVal.textContent = avgRating;

  const avgStarsInner = document.getElementById('avg-stars-inner');
  if (avgStarsInner) {
    const percentage = (Number(avgRating) / 5) * 100;
    avgStarsInner.style.width = `${percentage}%`;
  }

  const totalReviewsCountLabel = document.getElementById('total-reviews-count-label');
  if (totalReviewsCountLabel) {
    totalReviewsCountLabel.textContent = `Based on ${totalCount} review${totalCount === 1 ? '' : 's'}`;
  }

  // Update Breakdown bars
  const breakdownContainer = document.getElementById('rating-breakdown-bars');
  if (breakdownContainer) {
    let breakdownHtml = '';
    for (let i = 5; i >= 1; i--) {
      const count = starCounts[i] || 0;
      const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
      breakdownHtml += `
        <div class="breakdown-row">
          <span class="breakdown-label">${i} Star</span>
          <div class="breakdown-bar-outer">
            <div class="breakdown-bar-inner" style="width: ${percent}%;"></div>
          </div>
          <span class="breakdown-percent">${percent}%</span>
        </div>
      `;
    }
    breakdownContainer.innerHTML = breakdownHtml;
  }

  renderFilteredReviewsList(product);
}

function renderFilteredReviewsList(product) {
  let filteredList = allProductReviewsList.filter(r => r.product_id === product.id && r.is_active !== false);

  // Update subtitle counts
  const showingCount = document.getElementById('showing-reviews-count');
  if (showingCount) {
    showingCount.textContent = `Showing ${filteredList.length} review${filteredList.length === 1 ? '' : 's'}`;
  }

  const listContainer = document.getElementById('product-reviews-list');
  if (!listContainer) return;

  if (filteredList.length === 0) {
    listContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted); font-weight: 600; font-family: 'Inter', sans-serif;">
        No reviews found matching the filter criteria. Be the first to write a review!
      </div>
    `;
    return;
  }

  listContainer.innerHTML = filteredList.map(r => {
    const isProductReview = r.product_id === product.id;
    const badgeText = isProductReview ? 'Product Review' : 'Brand Review';
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
      const fill = i <= (r.rating || 5) ? 'var(--accent-gold)' : 'none';
      const stroke = i <= (r.rating || 5) ? 'none' : 'var(--mid-grey)';
      starsHtml += `<svg width="14" height="14" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="2" style="display:inline;margin-right:2px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    }

    return `
      <div class="review-item" style="font-family: 'Inter', sans-serif;">
        <div class="review-item-header">
          <div class="review-author-info">
            <span class="review-item-author">${r.author}</span>
            <span class="review-badge">${badgeText}</span>
          </div>
          <div class="review-item-rating">
            ${starsHtml}
          </div>
        </div>
        <p class="review-item-text">${r.text}</p>
      </div>
    `;
  }).join('');
}

function setupReviewModalEvents(product) {
  const modal = document.getElementById('write-review-modal');
  const openBtn = document.getElementById('write-review-trigger-btn');
  const closeBtn = document.getElementById('close-write-review-modal');
  const form = document.getElementById('write-review-form');
  const filterSelect = document.getElementById('review-filter-type');

  if (filterSelect) {
    filterSelect.addEventListener('change', () => renderFilteredReviewsList(product));
  }

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      form.reset();
      resetStarInput();
      // Reset radio selector styles
      const typeOptProduct = document.getElementById('type-opt-product');
      const typeOptBrand = document.getElementById('type-opt-brand');
      if (typeOptProduct) typeOptProduct.classList.add('active');
      if (typeOptBrand) typeOptBrand.classList.remove('active');
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    });
  }

  // Close modal when clicking outside modal content
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  // Radio button visual selector highlight toggling
  const radioInputs = document.querySelectorAll('input[name="review-type"]');
  radioInputs.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const typeOptProduct = document.getElementById('type-opt-product');
      const typeOptBrand = document.getElementById('type-opt-brand');
      if (e.target.value === 'product') {
        if (typeOptProduct) typeOptProduct.classList.add('active');
        if (typeOptBrand) typeOptBrand.classList.remove('active');
      } else {
        if (typeOptProduct) typeOptProduct.classList.remove('active');
        if (typeOptBrand) typeOptBrand.classList.add('active');
      }
    });
  });

  // Star Rating input hover and click interactions
  const starInputs = document.querySelectorAll('.star-input');
  const ratingInputVal = document.getElementById('review-rating-val');

  starInputs.forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.dataset.value);
      if (ratingInputVal) ratingInputVal.value = val;
      updateStarInputDisplay(val);
    });

    star.addEventListener('mouseenter', () => {
      const val = parseInt(star.dataset.value);
      highlightStarsOnHover(val);
    });

    star.addEventListener('mouseleave', () => {
      const currentVal = ratingInputVal ? parseInt(ratingInputVal.value) : 5;
      updateStarInputDisplay(currentVal);
    });
  });

  function resetStarInput() {
    if (ratingInputVal) ratingInputVal.value = '5';
    updateStarInputDisplay(5);
  }

  function updateStarInputDisplay(rating) {
    starInputs.forEach(star => {
      const val = parseInt(star.dataset.value);
      if (val <= rating) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
      star.classList.remove('hover');
    });
  }

  function highlightStarsOnHover(rating) {
    starInputs.forEach(star => {
      const val = parseInt(star.dataset.value);
      if (val <= rating) {
        star.classList.add('hover');
      } else {
        star.classList.remove('hover');
      }
    });
  }

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const rating = Number(document.getElementById('review-rating-val').value);
      const name = document.getElementById('review-user-name').value.trim();
      const text = document.getElementById('review-user-text').value.trim();
      const targetProductId = product.id;

      const submitBtn = form.querySelector('.btn-submit-review');
      if (submitBtn) {
        submitBtn.textContent = 'SUBMITTING...';
        submitBtn.disabled = true;
      }

      try {
        // Fetch current comprehensive product reviews array
        let list = [];
        if (typeof window.loadAllProductReviewsAdmin === 'function') {
          list = await window.loadAllProductReviewsAdmin() || [];
        } else if (typeof window.loadProductReviews === 'function') {
          list = await window.loadProductReviews() || [];
        }

        const newReviewObj = {
          id: crypto.randomUUID(),
          rating: rating,
          text: text,
          author: name,
          is_active: true, // Display instantly on website
          sort_order: 0,
          product_id: targetProductId
        };

        list.push(newReviewObj);
        list.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

        if (typeof window.saveProductReviewsList === 'function') {
          const { error } = await window.saveProductReviewsList(list);
          if (error) throw error;
        }

        // Close modal
        if (modal) {
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }

        // Trigger notification
        if (typeof window.showToast === 'function') {
          window.showToast('Review submitted successfully!');
        } else {
          alert('Review submitted successfully!');
        }

        // Reload lists in-memory
        allProductReviewsList = list;
        renderReviewsTab(product);
      } catch (err) {
        console.error("Failed to submit review:", err);
        alert('Error submitting review: ' + err.message);
      } finally {
        if (submitBtn) {
          submitBtn.textContent = 'SUBMIT REVIEW';
          submitBtn.disabled = false;
        }
      }
    });
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

  let deliveryFee = defaultDeliveryFee; // default standard
  
  function updateTotal() {
    const subtotal = getCartTotal();
    document.getElementById('checkout-subtotal').textContent = `Rs. ${subtotal}`;
    if (deliveryFee === 0) {
      document.getElementById('checkout-delivery').innerHTML = '<span style="color: var(--success);">Free</span>';
    } else {
      document.getElementById('checkout-delivery').textContent = `Rs. ${deliveryFee}`;
    }
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
    form.addEventListener('submit', async (e) => {
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

      // Loading State
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'PLACING ORDER...';
      submitBtn.disabled = true;

      const deliveryLabel = document.querySelector('input[name="delivery"]:checked').nextElementSibling.querySelector('strong').innerText;

      const details = {
        name: document.getElementById('chk-name').value,
        phone: document.getElementById('chk-phone').value,
        city: document.getElementById('chk-city').value,
        address: document.getElementById('chk-address').value,
        notes: document.getElementById('chk-notes').value,
        deliveryFee: deliveryFee,
        deliveryMethod: deliveryLabel,
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
        deliveryMethod: details.deliveryMethod,
        paymentMethod: details.payment,
        items: cart.map(i => ({ name: i.name, size: i.size, color: i.color, qty: i.qty, price: i.offerPrice })),
        total: getCartTotal() + details.deliveryFee,
        status: 'Pending'
      };

      // Save to Supabase Synchronously
      if (typeof supabaseClient !== 'undefined') {
        const { error } = await supabaseClient.from('orders').insert([orderRecord]);
        if (error) {
          console.error("Error saving order:", error);
          alert("Failed to place order. Please try again or contact us.");
          submitBtn.innerText = originalText;
          submitBtn.disabled = false;
          return;
        }
      }

      // Hide checkout layout and page banner, show success section inline
      document.getElementById('checkout-container').style.display = 'none';
      const pageBanner = document.querySelector('.page-banner');
      if (pageBanner) pageBanner.style.display = 'none';
      
      const successSection = document.getElementById('checkout-success');
      if(successSection) {
        successSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Setup optional WA button
      const waBtn = document.getElementById('wa-redirect-btn');
      if(waBtn) {
        waBtn.onclick = () => {
          openWhatsAppCheckout(cart, details);
        };
      }
      
      clearCart();
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
  const contactEmail = siteSettings.email || 'info@cryo.pk';
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = document.getElementById('c-msg') ? document.getElementById('c-msg').value : '';
      const successMsg = document.getElementById('contact-success-msg');
      if (successMsg) successMsg.style.display = 'block';
      
      setTimeout(() => {
        window.location.href = 'mailto:' + contactEmail + '?subject=Contact Inquiry&body=' + encodeURIComponent(msg);
      }, 500);
    });
  }
}

// --- Dual Range Slider Logic ---
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
});

function applyDynamicSettings() {
  // Apply CMS contact, banners, bank details when cms.js is loaded
  if (typeof window.cmsApplyAll === 'function') {
    window.cmsApplyAll();
  }

  // Update WhatsApp Links across the site (fallback for any missed links)
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
    link.href = `https://wa.me/${waNumber}`;
  });

  // Update checkout delivery options if on checkout page
  const stdInput = document.getElementById('delivery-std');
  const stdPrice = document.getElementById('delivery-std-price');
  if (stdInput && stdPrice) {
    stdInput.value = defaultDeliveryFee;
    if (defaultDeliveryFee === 0) {
      stdPrice.innerHTML = '<span style="color: var(--success);">Free</span>';
    } else {
      stdPrice.textContent = `Rs. ${defaultDeliveryFee}`;
    }
  }

  const expInput = document.getElementById('delivery-exp');
  const expPrice = document.getElementById('delivery-exp-price');
  if (expInput && expPrice) {
    expInput.value = expressDeliveryFee;
    expPrice.textContent = `Rs. ${expressDeliveryFee}`;
  }

  // Recalculate totals if currently checked
  const checkoutDeliverySpan = document.getElementById('checkout-delivery');
  if (checkoutDeliverySpan) {
    const checkedInput = document.querySelector('input[name="delivery"]:checked');
    if (checkedInput) {
      if (Number(checkedInput.value) === 0) {
        checkoutDeliverySpan.innerHTML = '<span style="color: var(--success);">Free</span>';
      } else {
        checkoutDeliverySpan.textContent = `Rs. ${checkedInput.value}`;
      }
      const totalEl = document.getElementById('checkout-total');
      if (totalEl) {
        const subtotal = getCartTotal();
        totalEl.textContent = `Rs. ${subtotal + parseInt(checkedInput.value)}`;
      }
    }
  }
}

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
