class HeaderComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="site-header">
        <div class="header-top">
          <div class="container header-top-container">
            <div class="header-logo-section">
              <a href="/" class="logo" style="text-decoration: none;">
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
                  <span class="info-value cms-phone">0301-4138007</span>
                </div>
              </div>
              <div class="info-block">
                <div class="info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div class="info-text">
                  <span class="info-label cms-header-address-label">Fiesta Garden, Near RTO Office</span>
                  <span class="info-value cms-header-address-value">NAWAN SHEHAR, MULTAN</span>
                </div>
              </div>
              <div class="header-socials">
                <a href="https://www.facebook.com/cryo.pk?rdid=FhYpj42aTim2K3SW&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18y9Y756VX%2F#" target="_blank" aria-label="Facebook"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                <a href="https://www.instagram.com/cryocoolant.pk?igsh=MWxudzl6dWYxeDZiNA%3D%3D" target="_blank" aria-label="Instagram"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                <a href="https://x.com/CRYOCOOLANT" target="_blank" aria-label="Twitter"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733-16z"></path><path d="M4 20l6.768-6.768m2.46-2.46l6.772-6.772"></path></svg></a>
                <a href="https://pinterest.com/imtiazsons6/?invite_code=2b01e9aed90b47378f062225f2fadea3&sender=1142507136627488890" target="_blank" aria-label="Pinterest"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.195 0 7.457 2.99 7.457 6.98 0 4.172-2.63 7.531-6.284 7.531-1.226 0-2.38-.638-2.775-1.391 0 0-.606 2.309-.753 2.876-.273 1.047-1.008 2.352-1.503 3.149 1.144.341 2.345.525 3.58.525 6.62 0 11.987-5.365 11.987-11.987C24.004 5.367 18.637 0 12.017 0z"/></svg></a>
                <a href="https://www.tiktok.com/@cryo.pk?_d=secCgYIASAHKAESPgo8WzcS4E0fYDEnn%2BDv61cnHmsts%2F0aJ0cjTOjG1WZGBUqoJnfzmi0ghsa5MXKey25DGTLavoudZ7j6w3gFGgA%3D&_r=1&_svg=1&checksum=a8de086536edaa1de0105c9bc3ace2bd0188b72c6e89c0ab88a4566197bf2c3b&lang=en-GB&reflow_sign_scene=7&rgssign=8.1.zRacQBpk1j3IEcCuf2Rylw&sec_uid=MS4wLjABAAAAYhG9Q3dpisv2KNfmyQrPZFSbKVdQm8kRUK-B1x3haJry70JcEG0Zk0hFmLvv2FTK&sec_user_id=MS4wLjABAAAAYhG9Q3dpisv2KNfmyQrPZFSbKVdQm8kRUK-B1x3haJry70JcEG0Zk0hFmLvv2FTK&share_app_id=1340&share_author_id=7648869042287232016&share_link_id=f15aea13-555b-4100-b050-a6455570ccf0&share_region=PK&share_scene=1&sharer_language=en&source=h5_m&timestamp=1781747346&u_code=f40g165m53h6hj&ugbiz_name=Account&user_id=7648869042287232016&utm_campaign=client_share&utm_source=copy" target="_blank" aria-label="TikTok"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-1.15 4.38-2.9 5.8-1.74 1.4-4.14 1.94-6.38 1.52-2.22-.4-4.22-1.74-5.38-3.64-1.16-1.88-1.45-4.25-.79-6.32.65-2.05 2.17-3.79 4.13-4.7 1.94-.89 4.22-1.02 6.26-.35v4.06c-1.3-.47-2.82-.4-3.99.34-1.15.72-1.85 2.05-1.85 3.4.01 1.34.72 2.64 1.86 3.35 1.14.7 2.65.74 3.94.22 1.27-.5 2.19-1.65 2.4-3.02.09-.58.07-1.17.07-1.76l-.01-16.28z"/></svg></a>
              </div>
            </div>
          </div>
        </div>
        
        <div class="header-bottom" id="header-bottom">
          <div class="container header-bottom-container">
            <a href="/" class="scrolled-logo" style="text-decoration: none;">
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
                <span class="cart-badge" id="cart-badge">0</span>
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
              <a href="/" style="display: inline-block; margin-bottom: 20px; text-decoration: none;">
                <img src="assets/images/cryo-logo-horizontal.png" alt="CRYO Logo" style="height: 55px !important; mix-blend-mode: screen; margin-left: -5px; display: block;">
              </a>
              <p style="margin-bottom: 5px;">Ultimate Protection. Peak Performance.</p>
              <p>Premium engine coolant helping keep cars and industrial machinery cool.</p>
              <div class="footer-socials">
                <a href="https://www.facebook.com/cryo.pk?rdid=FhYpj42aTim2K3SW&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18y9Y756VX%2F#" target="_blank" aria-label="Facebook"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                <a href="https://www.instagram.com/cryocoolant.pk?igsh=MWxudzl6dWYxeDZiNA%3D%3D" target="_blank" aria-label="Instagram"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                <a href="https://x.com/CRYOCOOLANT" target="_blank" aria-label="Twitter"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733-16z"></path><path d="M4 20l6.768-6.768m2.46-2.46l6.772-6.772"></path></svg></a>
                <a href="https://pinterest.com/imtiazsons6/?invite_code=2b01e9aed90b47378f062225f2fadea3&sender=1142507136627488890" target="_blank" aria-label="Pinterest"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.195 0 7.457 2.99 7.457 6.98 0 4.172-2.63 7.531-6.284 7.531-1.226 0-2.38-.638-2.775-1.391 0 0-.606 2.309-.753 2.876-.273 1.047-1.008 2.352-1.503 3.149 1.144.341 2.345.525 3.58.525 6.62 0 11.987-5.365 11.987-11.987C24.004 5.367 18.637 0 12.017 0z"/></svg></a>
                <a href="https://www.tiktok.com/@cryo.pk?_d=secCgYIASAHKAESPgo8WzcS4E0fYDEnn%2BDv61cnHmsts%2F0aJ0cjTOjG1WZGBUqoJnfzmi0ghsa5MXKey25DGTLavoudZ7j6w3gFGgA%3D&_r=1&_svg=1&checksum=a8de086536edaa1de0105c9bc3ace2bd0188b72c6e89c0ab88a4566197bf2c3b&lang=en-GB&reflow_sign_scene=7&rgssign=8.1.zRacQBpk1j3IEcCuf2Rylw&sec_uid=MS4wLjABAAAAYhG9Q3dpisv2KNfmyQrPZFSbKVdQm8kRUK-B1x3haJry70JcEG0Zk0hFmLvv2FTK&sec_user_id=MS4wLjABAAAAYhG9Q3dpisv2KNfmyQrPZFSbKVdQm8kRUK-B1x3haJry70JcEG0Zk0hFmLvv2FTK&share_app_id=1340&share_author_id=7648869042287232016&share_link_id=f15aea13-555b-4100-b050-a6455570ccf0&share_region=PK&share_scene=1&sharer_language=en&source=h5_m&timestamp=1781747346&u_code=f40g165m53h6hj&ugbiz_name=Account&user_id=7648869042287232016&utm_campaign=client_share&utm_source=copy" target="_blank" aria-label="TikTok"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-1.15 4.38-2.9 5.8-1.74 1.4-4.14 1.94-6.38 1.52-2.22-.4-4.22-1.74-5.38-3.64-1.16-1.88-1.45-4.25-.79-6.32.65-2.05 2.17-3.79 4.13-4.7 1.94-.89 4.22-1.02 6.26-.35v4.06c-1.3-.47-2.82-.4-3.99.34-1.15.72-1.85 2.05-1.85 3.4.01 1.34.72 2.64 1.86 3.35 1.14.7 2.65.74 3.94.22 1.27-.5 2.19-1.65 2.4-3.02.09-.58.07-1.17.07-1.76l-.01-16.28z"/></svg></a>
              </div>
            </div>
            
            <div class="footer-col">
              <h4>Quick Links</h4>
              <div class="footer-links">
                <a href="/">Home</a>
                <a href="/shop">Shop</a>
                <a href="/about">About Us</a>
                <a href="/contact">Contact Us</a>
                <a href="/dealer">Dealer Inquiry</a>
              </div>
            </div>
            
            <div class="footer-col">
              <h4>Policies</h4>
              <div class="footer-links">
                <a href="/shipping-policy">Shipping Policy</a>
                <a href="/return-policy">Return/Refund Policy</a>
                <a href="/privacy-policy">Privacy Policy</a>
                <a href="/terms">Terms & Conditions</a>
              </div>
            </div>
            
            <div class="footer-col">
              <h4>Contact Info</h4>
              <div class="footer-links">
                <p><strong style="color: var(--white);">Phone:</strong> <span class="cms-phone" style="color: var(--text-muted);">0301-4138007</span></p>
                <p><strong style="color: var(--white);">WhatsApp:</strong> <a href="https://wa.me/923014138007" target="_blank" rel="noopener" class="cms-wa-link" style="color: var(--text-muted);">0301-4138007</a></p>
                <p><strong style="color: var(--white);">Email:</strong> <a href="mailto:info@cryo.pk" class="cms-email-link" style="color: var(--text-muted);">info@cryo.pk</a></p>
                <p><strong style="color: var(--white);">Address:</strong><br><span class="cms-address" style="color: var(--text-muted); line-height: 1.8; display: inline-block; margin-top: 5px;">Fiesta Garden, Nawan Shehar,<br>Near RTO Office, Multan</span></p>
              </div>
            </div>
          </div>
          
          <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} CRYO Radiator Coolant. All Rights Reserved.</p>
          </div>
        </div>
        
        <a href="https://wa.me/923014138007" class="floating-wa" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width="75" height="75" style="border-radius: 50%;">
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
