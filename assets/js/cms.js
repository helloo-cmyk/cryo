// CMS loader for static pages (policies, about, contact) and shared site settings

let cmsSettings = {};
let cmsTestimonials = [];

function formatPhoneDisplay(waNumber, phoneDisplay) {
  if (phoneDisplay) return phoneDisplay;
  if (waNumber && waNumber.startsWith('92') && waNumber.length === 12) {
    return '0' + waNumber.substring(2, 5) + '-' + waNumber.substring(5);
  }
  return waNumber || '';
}

function formatPhoneTel(phoneDisplay, waNumber) {
  const raw = phoneDisplay || waNumber || '';
  return raw.replace(/[^0-9]/g, '').replace(/^0/, '92');
}

async function loadCmsData() {
  if (typeof supabaseClient === 'undefined') return;

  try {
    const { data: settingsData } = await supabaseClient.from('settings').select('*').eq('id', 'global').single();
    if (settingsData) cmsSettings = settingsData;

    const { data: reviewsData } = await supabaseClient.from('testimonials').select('*').eq('is_active', true).order('sort_order', { ascending: true });
    if (reviewsData) cmsTestimonials = reviewsData;
  } catch (e) {
    console.error('CMS load error:', e);
  }
}

function applyBannerImage(selector, url, gradient) {
  if (!url) return;
  const el = document.querySelector(selector);
  if (!el) return;
  const grad = gradient || 'linear-gradient(rgba(17, 17, 17, 0.7), rgba(17, 17, 17, 0.9))';
  el.style.background = `${grad}, url('${url}') center/cover no-repeat`;
}

function applySiteContactInfo() {
  const phone = formatPhoneDisplay(cmsSettings.whatsappNumber, cmsSettings.phone_display);
  const tel = formatPhoneTel(cmsSettings.phone_display, cmsSettings.whatsappNumber);
  const wa = cmsSettings.whatsappNumber || '923014138007';
  const email = cmsSettings.email || 'info@cryo.pk';
  const address = cmsSettings.address || '';

  document.querySelectorAll('.cms-phone').forEach(el => {
    el.textContent = phone;
  });
  document.querySelectorAll('.cms-phone-link').forEach(el => {
    el.textContent = phone;
    el.href = `tel:${tel}`;
  });
  document.querySelectorAll('.cms-wa-link').forEach(el => {
    el.textContent = phone;
    el.href = `https://wa.me/${wa}`;
  });
  document.querySelectorAll('.cms-email').forEach(el => {
    el.textContent = email;
    if (el.tagName === 'A') el.href = `mailto:${email}`;
  });
  document.querySelectorAll('.cms-email-link').forEach(el => {
    el.textContent = email;
    el.href = `mailto:${email}`;
  });
  document.querySelectorAll('.cms-address').forEach(el => {
    el.innerHTML = address.replace(/\n/g, '<br>');
  });
  document.querySelectorAll('.cms-header-address-label').forEach(el => {
    const parts = address.split(',');
    el.textContent = parts[0] ? parts[0].trim() : 'Fiesta Garden, Near RTO Office';
  });
  document.querySelectorAll('.cms-header-address-value').forEach(el => {
    const parts = address.split(',');
    el.textContent = parts.slice(1).join(',').trim() || 'NAWAN SHEHAR, MULTAN';
  });

  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
    link.href = `https://wa.me/${wa}`;
  });
}

function applyCmsBanners() {
  if (cmsSettings.hero_image_url) {
    const hero = document.getElementById('home-hero') || document.querySelector('.hero-full');
    if (hero) hero.style.backgroundImage = `url('${cmsSettings.hero_image_url}')`;
  }
  applyBannerImage('.page-banner.shop-banner', cmsSettings.shop_banner_url);
  applyBannerImage('.page-banner.about-banner', cmsSettings.about_banner_url);
  applyBannerImage('.page-banner.contact-banner', cmsSettings.contact_banner_url);
  applyBannerImage('.page-banner.dealer-banner', cmsSettings.dealer_banner_url);

  const storyImg = document.getElementById('about-story-img');
  if (storyImg && cmsSettings.about_story_image_url) storyImg.src = cmsSettings.about_story_image_url;
  const qualityImg = document.getElementById('about-quality-img');
  if (qualityImg && cmsSettings.about_quality_image_url) qualityImg.src = cmsSettings.about_quality_image_url;
  const benefitsImg = document.getElementById('benefits-section-img');
  if (benefitsImg && cmsSettings.benefits_image_url) benefitsImg.src = cmsSettings.benefits_image_url;
}

function applyBankDetails() {
  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el && val) el.textContent = val;
  };
  setText('bank-jazz-title', cmsSettings.jazzcash_title);
  setText('bank-jazz-account', cmsSettings.jazzcash_account);
  setText('bank-meezan-title', cmsSettings.meezan_title);
  setText('bank-meezan-account', cmsSettings.meezan_account);
  setText('bank-meezan-iban', cmsSettings.meezan_iban);
  setText('bank-ubl-title', cmsSettings.ubl_title);
  setText('bank-ubl-account', cmsSettings.ubl_account);
  setText('bank-ubl-iban', cmsSettings.ubl_iban);
}

function renderTestimonialStars(rating) {
  const starSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent-gold)" stroke="none" style="display:inline;margin-right:2px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
  return starSvg.repeat(rating || 5);
}

function renderTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid || !cmsTestimonials.length) return;

  grid.innerHTML = cmsTestimonials.map(t => `
    <div class="testimonial-card">
      <div class="testimonial-rating">${renderTestimonialStars(t.rating)}</div>
      <p class="testimonial-text">${t.text}</p>
      <p class="testimonial-author">${t.author}</p>
    </div>
  `).join('');
}

async function loadPolicyPage(slug) {
  const container = document.getElementById('cms-page-content');
  if (!container) return;

  const { data } = await supabaseClient.from('page_content').select('*').eq('slug', slug).single();
  if (data && data.content) {
    container.innerHTML = data.content;
  }
  if (data && data.title) {
    const titleEl = document.getElementById('cms-page-title');
    if (titleEl) titleEl.textContent = data.title;
  }
}

function applyAboutContent() {
  const setHtml = (id, html) => {
    const el = document.getElementById(id);
    if (el && html) el.innerHTML = html;
  };
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  };

  setText('about-mission-title', cmsSettings.about_mission_title);
  setHtml('about-mission-content', cmsSettings.about_mission_content);
  if (cmsSettings.about_benefits_list) {
    const el = document.getElementById('about-benefits-list');
    if (el) {
      const html = cmsSettings.about_benefits_list.trim();
      if (html.startsWith('<ul')) {
        el.outerHTML = html;
      } else {
        el.innerHTML = html;
      }
    }
  }
  setHtml('about-formula-title', cmsSettings.about_formula_title);
  setHtml('about-formula-content', cmsSettings.about_formula_content);
  setText('about-quality-title', cmsSettings.about_quality_title);
  setHtml('about-quality-content', cmsSettings.about_quality_content);
}

function applyContactPage() {
  const mapFrame = document.getElementById('contact-map');
  if (mapFrame && cmsSettings.map_embed_url) mapFrame.src = cmsSettings.map_embed_url;
}

async function initCmsPage() {
  await loadCmsData();
  applySiteContactInfo();
  applyCmsBanners();
  applyBankDetails();
  renderTestimonials();

  const path = window.location.pathname;
  if (path.includes('about')) {
    applyAboutContent();
  }
  if (path.includes('contact')) {
    applyContactPage();
  }
  if (path.includes('privacy-policy')) await loadPolicyPage('privacy-policy');
  if (path.includes('terms')) await loadPolicyPage('terms');
  if (path.includes('shipping-policy')) await loadPolicyPage('shipping-policy');
  if (path.includes('return-policy')) await loadPolicyPage('return-policy');
}

// Auto-init on CMS-only pages (no main.js)
if (!document.querySelector('script[src*="main.js"]')) {
  document.addEventListener('DOMContentLoaded', initCmsPage);
}

// Expose for main.js
window.cmsLoadData = loadCmsData;
window.cmsApplyAll = function () {
  applySiteContactInfo();
  applyCmsBanners();
  applyBankDetails();
  renderTestimonials();
  applyAboutContent();
  applyContactPage();
};
