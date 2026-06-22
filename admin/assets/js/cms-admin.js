// Admin CMS: banners, page content, testimonials

const CMS_BUCKET = 'product-images';

const BANNER_FIELDS = [
  { key: 'hero_image_url', label: 'Homepage Hero', previewId: 'preview-hero', inputId: 'banner-hero' },
  { key: 'shop_banner_url', label: 'Shop Page Banner', previewId: 'preview-shop', inputId: 'banner-shop' },
  { key: 'about_banner_url', label: 'About Page Banner', previewId: 'preview-about-banner', inputId: 'banner-about-banner' },
  { key: 'contact_banner_url', label: 'Contact Page Banner', previewId: 'preview-contact', inputId: 'banner-contact' },
  { key: 'dealer_banner_url', label: 'Dealer Page Banner', previewId: 'preview-dealer', inputId: 'banner-dealer' },
  { key: 'about_story_image_url', label: 'About — Story Image', previewId: 'preview-about-story', inputId: 'banner-about-story' },
  { key: 'about_quality_image_url', label: 'About — Quality Image', previewId: 'preview-about-quality', inputId: 'banner-about-quality' },
  { key: 'benefits_image_url', label: 'Home — Benefits Image', previewId: 'preview-benefits', inputId: 'banner-benefits' }
];

async function uploadSiteImage(file, folder) {
  if (!file) return null;
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${folder}/${Date.now()}_${safeName}`;
  const { error } = await supabaseClient.storage.from(CMS_BUCKET).upload(filePath, file);
  if (error) throw error;
  const { data: { publicUrl } } = supabaseClient.storage.from(CMS_BUCKET).getPublicUrl(filePath);
  return publicUrl;
}

async function initBannersPage() {
  const form = document.getElementById('banners-form');
  if (!form) return;

  const cms = await loadSiteCms();
  BANNER_FIELDS.forEach(field => {
    const preview = document.getElementById(field.previewId);
    const url = cms[field.key];
    if (preview && url) {
      preview.src = url;
      preview.style.display = 'block';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('save-banners-btn');
    btn.textContent = 'Saving...';
    btn.disabled = true;

    const patch = {};
    try {
      for (const field of BANNER_FIELDS) {
        const input = document.getElementById(field.inputId);
        if (input && input.files && input.files[0]) {
          patch[field.key] = await uploadSiteImage(input.files[0], 'banners');
        }
      }

      if (Object.keys(patch).length === 0) {
        alert('Select at least one image to upload.');
        btn.textContent = 'Save Banner Images';
        btn.disabled = false;
        return;
      }

      const { error } = await saveSiteCms(patch);
      if (error) throw error;

      const msg = document.getElementById('banners-msg');
      if (msg) {
        msg.style.display = 'block';
        setTimeout(() => { msg.style.display = 'none'; }, 3000);
      }

      BANNER_FIELDS.forEach(field => {
        if (patch[field.key]) {
          const preview = document.getElementById(field.previewId);
          if (preview) {
            preview.src = patch[field.key];
            preview.style.display = 'block';
          }
        }
      });

      form.querySelectorAll('input[type="file"]').forEach(inp => inp.value = '');
    } catch (err) {
      alert(cmsSchemaErrorMessage(err) || ('Error saving banners: ' + err.message));
    }

    btn.textContent = 'Save Banner Images';
    btn.disabled = false;
  });
}

let quillPolicy, quillAboutMission, quillAboutFormula, quillAboutQuality, quillAboutBenefits;

async function initContentPage() {
  const policyTab = document.getElementById('content-policy-tab');
  if (!policyTab) return;

  quillPolicy = new Quill('#editor-policy', { theme: 'snow' });
  quillAboutMission = new Quill('#editor-about-mission', { theme: 'snow' });
  quillAboutFormula = new Quill('#editor-about-formula', { theme: 'snow' });
  quillAboutQuality = new Quill('#editor-about-quality', { theme: 'snow' });
  quillAboutBenefits = new Quill('#editor-about-benefits', { theme: 'snow' });

  const slugSelect = document.getElementById('policy-slug');
  slugSelect.addEventListener('change', () => loadPolicyContent(slugSelect.value));

  document.querySelectorAll('.content-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.content-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.content-tab-panel').forEach(p => p.style.display = 'none');
      btn.classList.add('active');
      const panel = document.getElementById(btn.dataset.panel);
      if (panel) panel.style.display = 'block';
    });
  });

  await loadPolicyContent(slugSelect.value);
  await loadAboutContent();

  document.getElementById('save-policy-btn').addEventListener('click', savePolicyContent);
  document.getElementById('save-about-btn').addEventListener('click', saveAboutContent);
}

async function loadPolicyContent(slug) {
  const { data, error } = await supabaseClient.from('page_content').select('*').eq('slug', slug).maybeSingle();
  if (!error && data && data.content) {
    quillPolicy.root.innerHTML = data.content;
    document.getElementById('policy-title').value = data.title || '';
  } else {
    quillPolicy.root.innerHTML = '';
    document.getElementById('policy-title').value = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}

async function savePolicyContent() {
  const slug = document.getElementById('policy-slug').value;
  const title = document.getElementById('policy-title').value.trim();
  const content = quillPolicy.root.innerHTML;

  const { error } = await supabaseClient.from('page_content').upsert({
    slug,
    title,
    content,
    updated_at: new Date().toISOString()
  });

  if (error) {
    alert(cmsSchemaErrorMessage(error) || ('Error saving policy: ' + error.message));
    return;
  }
  showContentMsg('policy-msg');
}

async function loadAboutContent() {
  const cms = await loadSiteCms();
  document.getElementById('about-mission-title').value = cms.about_mission_title || 'Beyond Temperature';
  document.getElementById('about-formula-title').value = cms.about_formula_title || 'The Premium Formula';
  document.getElementById('about-quality-title').value = cms.about_quality_title || 'Quality Commitment';
  if (cms.about_mission_content) quillAboutMission.root.innerHTML = cms.about_mission_content;
  if (cms.about_formula_content) quillAboutFormula.root.innerHTML = cms.about_formula_content;
  if (cms.about_quality_content) quillAboutQuality.root.innerHTML = cms.about_quality_content;
  if (cms.about_benefits_list) quillAboutBenefits.root.innerHTML = cms.about_benefits_list;
}

async function saveAboutContent() {
  const { error } = await saveSiteCms({
    about_mission_title: document.getElementById('about-mission-title').value.trim(),
    about_formula_title: document.getElementById('about-formula-title').value.trim(),
    about_quality_title: document.getElementById('about-quality-title').value.trim(),
    about_mission_content: quillAboutMission.root.innerHTML,
    about_formula_content: quillAboutFormula.root.innerHTML,
    about_quality_content: quillAboutQuality.root.innerHTML,
    about_benefits_list: quillAboutBenefits.root.innerHTML
  });

  if (error) {
    alert(cmsSchemaErrorMessage(error) || ('Error saving about page: ' + error.message));
    return;
  }
  showContentMsg('about-msg');
}

function showContentMsg(id) {
  const msg = document.getElementById(id);
  if (msg) {
    msg.style.display = 'block';
    setTimeout(() => { msg.style.display = 'none'; }, 3000);
  }
}

async function initReviewsPage() {
  const tbodyTestimonials = document.getElementById('reviews-table-body');
  const tbodyProductReviews = document.getElementById('product-reviews-table-body');
  if (!tbodyTestimonials && !tbodyProductReviews) return;

  // Populate products select dynamically
  const productSelect = document.getElementById('review-product-id');
  if (productSelect && typeof supabaseClient !== 'undefined') {
    try {
      const { data: productsData } = await supabaseClient.from('products').select('id, name');
      if (productsData) {
        productSelect.innerHTML = '';
        productsData.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p.id;
          opt.textContent = p.name;
          productSelect.appendChild(opt);
        });
      }
    } catch (e) {
      console.error("Failed to load products for review modal:", e);
    }
  }

  await loadBothReviewsTables();

  const openModal = (title, type) => {
    document.getElementById('review-form').reset();
    document.getElementById('review-id').value = '';
    document.getElementById('admin-review-type').value = type;
    document.getElementById('review-modal-title').textContent = title;
    
    if (type === 'testimonial') {
      document.getElementById('review-target-group').style.display = 'none';
      if (document.getElementById('review-product-id')) {
        document.getElementById('review-product-id').value = 'brand';
      }
    } else {
      document.getElementById('review-target-group').style.display = 'block';
      if (productSelect && productSelect.options.length > 0) {
        productSelect.value = productSelect.options[0].value;
      }
    }
    document.getElementById('review-modal').classList.add('active');
  };

  const addTestimonialBtn = document.getElementById('add-review-btn');
  if (addTestimonialBtn) {
    addTestimonialBtn.addEventListener('click', () => openModal('Add Testimonial', 'testimonial'));
  }

  const addProductReviewBtn = document.getElementById('add-product-review-btn');
  if (addProductReviewBtn) {
    addProductReviewBtn.addEventListener('click', () => openModal('Add Product Review', 'product_review'));
  }

  document.getElementById('close-review-modal').addEventListener('click', () => {
    document.getElementById('review-modal').classList.remove('active');
  });

  document.getElementById('review-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('review-id').value;
    const type = document.getElementById('admin-review-type').value;
    const productId = type === 'testimonial' ? 'brand' : document.getElementById('review-product-id').value;

    const reviewData = {
      id: id || crypto.randomUUID(),
      rating: Number(document.getElementById('review-rating').value),
      text: document.getElementById('review-text').value.trim(),
      author: document.getElementById('review-author').value.trim(),
      is_active: document.getElementById('review-active').checked,
      sort_order: Number(document.getElementById('review-sort').value) || 0,
      product_id: productId
    };

    try {
      if (type === 'testimonial') {
        let list = await loadAllTestimonialsAdmin();
        if (id) list = list.map(r => r.id === id ? { ...r, ...reviewData } : r);
        else list.push(reviewData);
        list.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        const { error } = await saveTestimonialsList(list);
        if (error) throw error;
      } else {
        let list = await loadAllProductReviewsAdmin();
        if (id) list = list.map(r => r.id === id ? { ...r, ...reviewData } : r);
        else list.push(reviewData);
        list.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        const { error } = await saveProductReviewsList(list);
        if (error) throw error;
      }

      document.getElementById('review-modal').classList.remove('active');
      await loadBothReviewsTables();
    } catch (err) {
      alert(cmsSchemaErrorMessage(err) || ('Error saving review: ' + err.message));
    }
  });
}

async function loadBothReviewsTables() {
  const tbodyTestimonials = document.getElementById('reviews-table-body');
  const tbodyProductReviews = document.getElementById('product-reviews-table-body');

  let productMap = { 'brand': 'CRYO Brand (General)' };
  if (typeof supabaseClient !== 'undefined') {
    try {
      const { data } = await supabaseClient.from('products').select('id, name');
      if (data) data.forEach(p => { productMap[p.id] = p.name; });
    } catch (e) {
      console.error("Failed to fetch product mappings:", e);
    }
  }

  if (tbodyTestimonials) {
    const testimonials = await loadAllTestimonialsAdmin();
    if (!testimonials || testimonials.length === 0) {
      tbodyTestimonials.innerHTML = '<tr><td colspan="5" style="text-align:center;">No testimonials yet.</td></tr>';
    } else {
      tbodyTestimonials.innerHTML = testimonials.map(r => {
        return `
          <tr>
            <td>${'★'.repeat(r.rating || 5)}</td>
            <td style="max-width:300px;">${r.text}</td>
            <td>${r.author}</td>
            <td><span class="badge ${r.is_active !== false ? 'badge-success' : 'badge-danger'}">${r.is_active !== false ? 'Active' : 'Hidden'}</span></td>
            <td>
              <div style="display:flex; gap:8px;">
                <button class="btn-sm" style="background:#0D47A1;" onclick="editReview('${r.id}', 'testimonial')">Edit</button>
                <button class="btn-sm" style="background:var(--admin-danger);" onclick="deleteReview('${r.id}', 'testimonial')">Delete</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  if (tbodyProductReviews) {
    const productReviews = await loadAllProductReviewsAdmin();
    if (!productReviews || productReviews.length === 0) {
      tbodyProductReviews.innerHTML = '<tr><td colspan="6" style="text-align:center;">No product reviews yet.</td></tr>';
    } else {
      tbodyProductReviews.innerHTML = productReviews.map(r => {
        const targetName = productMap[r.product_id] || r.product_id || 'Unknown';
        return `
          <tr>
            <td>${'★'.repeat(r.rating || 5)}</td>
            <td style="max-width:300px;">${r.text}</td>
            <td>${r.author}</td>
            <td><span style="font-size:11px; font-weight:700; background:#f0f0f0; color:#333; padding:2px 8px; border-radius:4px; text-transform:uppercase;">${targetName}</span></td>
            <td><span class="badge ${r.is_active !== false ? 'badge-success' : 'badge-danger'}">${r.is_active !== false ? 'Active' : 'Hidden'}</span></td>
            <td>
              <div style="display:flex; gap:8px;">
                <button class="btn-sm" style="background:#0D47A1;" onclick="editReview('${r.id}', 'product_review')">Edit</button>
                <button class="btn-sm" style="background:var(--admin-danger);" onclick="deleteReview('${r.id}', 'product_review')">Delete</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
  }
}

window.editReview = async function (id, type) {
  const reviews = type === 'testimonial' ? await loadAllTestimonialsAdmin() : await loadAllProductReviewsAdmin();
  const data = reviews.find(r => r.id === id);
  if (!data) return;

  document.getElementById('review-id').value = data.id;
  document.getElementById('admin-review-type').value = type;
  document.getElementById('review-rating').value = data.rating || 5;
  document.getElementById('review-text').value = data.text || '';
  document.getElementById('review-author').value = data.author || '';
  document.getElementById('review-active').checked = data.is_active !== false;
  document.getElementById('review-sort').value = data.sort_order || 0;
  
  if (type === 'testimonial') {
    document.getElementById('review-target-group').style.display = 'none';
    if (document.getElementById('review-product-id')) document.getElementById('review-product-id').value = 'brand';
  } else {
    document.getElementById('review-target-group').style.display = 'block';
    if (document.getElementById('review-product-id')) document.getElementById('review-product-id').value = data.product_id || '';
  }

  document.getElementById('review-modal-title').textContent = type === 'testimonial' ? 'Edit Testimonial' : 'Edit Product Review';
  document.getElementById('review-modal').classList.add('active');
};

window.deleteReview = async function (id, type) {
  const confirmed = await customConfirm('Delete this review?');
  if (!confirmed) return;
  
  if (type === 'testimonial') {
    const list = (await loadAllTestimonialsAdmin()).filter(r => r.id !== id);
    const { error } = await saveTestimonialsList(list);
    if (error) alert(cmsSchemaErrorMessage(error) || error.message);
  } else {
    const list = (await loadAllProductReviewsAdmin()).filter(r => r.id !== id);
    const { error } = await saveProductReviewsList(list);
    if (error) alert(cmsSchemaErrorMessage(error) || error.message);
  }
  await loadBothReviewsTables();
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('banners')) initBannersPage();
  if (window.location.pathname.includes('content')) initContentPage();
  if (window.location.pathname.includes('reviews')) initReviewsPage();
});
