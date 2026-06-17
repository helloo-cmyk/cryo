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
  const tbody = document.getElementById('reviews-table-body');
  if (!tbody) return;

  await loadReviewsTable();

  document.getElementById('add-review-btn').addEventListener('click', () => {
    document.getElementById('review-form').reset();
    document.getElementById('review-id').value = '';
    document.getElementById('review-modal-title').textContent = 'Add Review';
    document.getElementById('review-modal').classList.add('active');
  });

  document.getElementById('close-review-modal').addEventListener('click', () => {
    document.getElementById('review-modal').classList.remove('active');
  });

  document.getElementById('review-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('review-id').value;
    const reviewData = {
      id: id || crypto.randomUUID(),
      rating: Number(document.getElementById('review-rating').value),
      text: document.getElementById('review-text').value.trim(),
      author: document.getElementById('review-author').value.trim(),
      is_active: document.getElementById('review-active').checked,
      sort_order: Number(document.getElementById('review-sort').value) || 0
    };

    try {
      let list = await loadAllTestimonialsAdmin();
      if (id) {
        list = list.map(r => r.id === id ? { ...r, ...reviewData } : r);
      } else {
        list.push(reviewData);
      }
      list.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      const { error } = await saveTestimonialsList(list);
      if (error) throw error;
      document.getElementById('review-modal').classList.remove('active');
      await loadReviewsTable();
    } catch (err) {
      alert(cmsSchemaErrorMessage(err) || ('Error saving review: ' + err.message));
    }
  });
}

async function loadReviewsTable() {
  const tbody = document.getElementById('reviews-table-body');
  const reviews = await loadAllTestimonialsAdmin();

  if (!reviews || reviews.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No reviews yet. Add your first review.</td></tr>';
    return;
  }

  tbody.innerHTML = reviews.map(r => `
    <tr>
      <td>${'★'.repeat(r.rating || 5)}</td>
      <td style="max-width:300px;">${r.text}</td>
      <td>${r.author}</td>
      <td><span class="badge ${r.is_active !== false ? 'badge-success' : 'badge-danger'}">${r.is_active !== false ? 'Active' : 'Hidden'}</span></td>
      <td>
        <div style="display:flex; gap:8px;">
          <button class="btn-sm" style="background:#0D47A1;" onclick="editReview('${r.id}')">Edit</button>
          <button class="btn-sm" style="background:var(--admin-danger);" onclick="deleteReview('${r.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.editReview = async function (id) {
  const reviews = await loadAllTestimonialsAdmin();
  const data = reviews.find(r => r.id === id);
  if (!data) return;

  document.getElementById('review-id').value = data.id;
  document.getElementById('review-rating').value = data.rating || 5;
  document.getElementById('review-text').value = data.text || '';
  document.getElementById('review-author').value = data.author || '';
  document.getElementById('review-active').checked = data.is_active !== false;
  document.getElementById('review-sort').value = data.sort_order || 0;
  document.getElementById('review-modal-title').textContent = 'Edit Review';
  document.getElementById('review-modal').classList.add('active');
};

window.deleteReview = async function (id) {
  const confirmed = await customConfirm('Delete this review?');
  if (!confirmed) return;
  const list = (await loadAllTestimonialsAdmin()).filter(r => r.id !== id);
  const { error } = await saveTestimonialsList(list);
  if (error) alert(cmsSchemaErrorMessage(error) || error.message);
  else await loadReviewsTable();
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('banners')) initBannersPage();
  if (window.location.pathname.includes('content')) initContentPage();
  if (window.location.pathname.includes('reviews')) initReviewsPage();
});
