class HeaderComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="site-header">
        <div class="header-top">
          <div class="container header-top-container">
            <div class="header-logo-section">
              <a href="index.html" class="logo">
                <img src="assets/images/cryo-logo-horizontal.png" alt="CRYO Logo" height="48">
              </a>
            </div>
            
            <div class="header-info-blocks">
              <div class="info-block">
                <div class="info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div class="info-text">
                  <span class="info-label">Call Us Support</span>
                  <span class="info-value">0301-4138007</span>
                </div>
              </div>
              <div class="info-block">
                <div class="info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div class="info-text">
                  <span class="info-label">LMQ Rd, opp. RTO</span>
                  <span class="info-value">NAWAN SHEHR, MULTAN</span>
                </div>
              </div>
              <div class="header-socials">
                <a href="#" aria-label="Facebook"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                <a href="#" aria-label="Instagram"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                <a href="#" aria-label="Twitter"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
              </div>
            </div>
          </div>
        </div>
        
        <div class="header-bottom" id="header-bottom">
          <div class="container header-bottom-container">
            <a href="index.html" class="scrolled-logo">
              <img src="assets/images/cryo-logo-horizontal.png" alt="CRYO Logo" height="38">
            </a>
            <div class="menu-overlay"></div>
            <nav class="main-nav" id="nav-links">
              <div class="mobile-menu-header">
                <img src="assets/images/cryo-logo-horizontal.png" alt="CRYO Logo" height="28" style="filter: brightness(0)">
                <button class="mobile-close-btn">&times;</button>
              </div>
              <div class="mobile-search">
                <input type="text" placeholder="Search here...">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <a href="/">Home</a>
              <a href="/shop">Shop</a>
              <a href="/about">About Us</a>
              <a href="/contact">Contact Us</a>
              <a href="/dealer">Dealer Inquiry</a>
            </nav>
            <div class="header-actions">
              <a href="cart.html" class="action-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                <span class="cart-badge" id="cart-badge"><span>0</span></span>
              </a>
              <button class="action-box search-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
              <button class="hamburger" id="hamburger" aria-label="Toggle Navigation">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
            </div>
            <a href="https://wa.me/923014138007" target="_blank" class="appointment-btn">
              ORDER VIA WHATSAPP
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
        </div>
      </header>
    `;

    // Highlight the active navigation link based on the current URL
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = this.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
      let href = link.getAttribute('href');
      if (href && href.startsWith('/')) href = href.substring(1);
      if (!href) href = 'index.html';
      
      if (href === currentPath || href + '.html' === currentPath || (currentPath === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Create sticky clone for smooth slide-down animation
    const header = this.querySelector('.site-header');
    if (header) {
      const stickyHeader = header.cloneNode(true);
      stickyHeader.classList.add('sticky-clone');
      this.appendChild(stickyHeader);

      // Scroll event listener for sticky header
      window.addEventListener('scroll', () => {
        if (window.scrollY > 250) {
          stickyHeader.classList.add('scrolled');
        } else {
          stickyHeader.classList.remove('scrolled');
        }
      });
    }

    // Hamburger menu toggle
    const hamburgers = this.querySelectorAll('.hamburger');
    hamburgers.forEach(btn => {
      btn.addEventListener('click', () => {
        const headerContainer = btn.closest('.site-header, .sticky-clone');
        const nav = headerContainer.querySelector('.main-nav');
        const overlay = headerContainer.querySelector('.menu-overlay');
        if (nav) nav.classList.add('active');
        if (overlay) overlay.classList.add('active');
      });
    });

    // Close menu
    const closeBtns = this.querySelectorAll('.mobile-close-btn, .menu-overlay');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const headerContainer = btn.closest('.site-header, .sticky-clone');
        const nav = headerContainer.querySelector('.main-nav');
        const overlay = headerContainer.querySelector('.menu-overlay');
        if (nav) nav.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
      });
    });
  }
}

class FooterComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-col">
              <a href="index.html" style="display: inline-block; margin-bottom: 15px;">
                <img src="assets/images/cryo-logo-horizontal.png" alt="CRYO Logo" style="height: 55px !important; mix-blend-mode: screen; margin-left: -5px; display: block;">
              </a>
              <p>Ultimate Protection. Peak Performance.</p>
              <p>Premium engine coolant helping keep cars and industrial machinery cool.</p>
            </div>
            
            <div class="footer-col">
              <h4>Quick Links</h4>
              <div class="footer-links">
                <a href="index.html">Home</a>
                <a href="shop.html">Shop</a>
                <a href="about.html">About Us</a>
                <a href="contact.html">Contact Us</a>
                <a href="dealer.html">Dealer Inquiry</a>
              </div>
            </div>
            
            <div class="footer-col">
              <h4>Policies</h4>
              <div class="footer-links">
                <a href="shipping-policy.html">Shipping Policy</a>
                <a href="return-policy.html">Return/Refund Policy</a>
                <a href="privacy-policy.html">Privacy Policy</a>
                <a href="terms.html">Terms & Conditions</a>
              </div>
            </div>
            
            <div class="footer-col">
              <h4>Contact Info</h4>
              <div class="footer-links">
                <p><strong>Phone:</strong> 0301-4138007</p>
                <p><strong>WhatsApp:</strong> <a href="https://wa.me/923014138007" target="_blank" rel="noopener">0301-4138007</a></p>
                <p><strong>Address:</strong><br>LMQ Rd, opp. RTO,<br>Nawan Shehr, Multan, 60000</p>
              </div>
            </div>
          </div>
          
          <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} CRYO Radiator Coolant. All Rights Reserved.</p>
          </div>
        </div>
        
        <a href="https://wa.me/923014138007" class="floating-wa" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
          <svg width="35" height="35" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.146.564 4.237 1.636 6.07L.17 24l6.04-1.583A11.97 11.97 0 0 0 12.031 24c6.645 0 12.03-5.386 12.03-12.031S18.676 0 12.031 0zm3.327 17.202c-.524 1.472-2.584 2.128-3.565 2.213-.815.07-1.921-.132-3.41-1.258-2.55-1.928-4.228-4.706-4.356-4.877-.128-.17-1.04-1.385-1.04-2.639 0-1.254.653-1.874.887-2.129.233-.255.508-.318.678-.318.17 0 .34.004.492.01.17.009.398-.065.625.485.234.552.75 1.831.815 1.961.065.13.109.28.024.45-.084.17-.13.275-.256.425-.13.15-.27.322-.387.45-.13.14-.268.293-.113.561.155.267.693 1.144 1.488 1.854.912.816 1.765 1.07 2.033 1.199.268.13.425.109.584-.065.158-.174.68-1.041.862-1.399.182-.358.365-.298.614-.206.25.09 1.582.748 1.852.883.27.135.45.202.516.315.066.113.066.651-.458 2.123z"/>
          </svg>
        </a>
      </footer>
    `;
  }
}

// Define the custom elements
customElements.define('site-header', HeaderComponent);
customElements.define('site-footer', FooterComponent);

// Initialize common UI scripts once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const hamburger = document.getElementById('hamburger');
  const headerBottom = document.getElementById('header-bottom');
  
  if (hamburger && headerBottom) {
    hamburger.addEventListener('click', () => {
      headerBottom.classList.toggle('active');
    });
  }
});
