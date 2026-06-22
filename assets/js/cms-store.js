// CMS data store — uses page_content table (JSON blobs) so no extra settings columns needed

const CMS_SLUG = 'site_cms';
const TESTIMONIALS_SLUG = 'testimonials';
const PRODUCT_REVIEWS_SLUG = 'product_reviews';

const CMS_DEFAULTS = {
  phone_display: '0301-4138007',
  email: 'info@cryo.pk',
  address: 'Fiesta Garden, Nawan Shehar, Near RTO Office, Multan',
  map_embed_url: 'https://maps.google.com/maps?q=Fiesta%20Garden%20Nawan%20Shehar%20Near%20RTO%20Office%20Multan&t=&z=13&ie=UTF8&iwloc=&output=embed',
  jazzcash_title: 'Ali imtiaz',
  jazzcash_account: '03017462055',
  meezan_title: 'Imtiaz & sons traders',
  meezan_account: '68010113530815',
  meezan_iban: 'PK59MEZN0068010113530815',
  ubl_title: 'Imtiaz and Sons Traders',
  ubl_account: '2713378030254',
  ubl_iban: 'PK54UNIL0109000378030254',
  hero_image_url: 'assets/images/hero bg.png',
  shop_banner_url: 'assets/images/shop-hero.png',
  about_banner_url: 'assets/images/about-hero.png',
  contact_banner_url: 'assets/images/contact-hero.png',
  dealer_banner_url: 'assets/images/dealer-hero.png',
  about_story_image_url: 'assets/images/hero-worker-coolant.jpg',
  about_quality_image_url: 'assets/images/quality-commitment.png',
  benefits_image_url: 'assets/images/1l and 4l red.jpeg',
  about_mission_title: 'Beyond Temperature',
  about_mission_content: '<p style="margin-bottom: 15px;"><strong>CRYO Radiator Coolant</strong> helps keep car engines and industrial machinery cool by controlling temperature and reducing overheating risk. Suitable for automobiles, commercial vehicles, generators, and industrial machinery cooling systems.</p><p style="margin-bottom: 25px;">From the scorching summer heat to heavy-duty industrial workloads, engines require more than just water—they need a shield.</p>',
  about_formula_title: 'The Premium Formula',
  about_formula_content: '<p>What makes CRYO "Beyond Temperature"? It\'s our proprietary anti-rust and long-life formula. Standard coolants degrade quickly, leaving internal components vulnerable to scaling and corrosion. CRYO maintains a protective barrier, ensuring optimal heat transfer and extending the life of your radiator and water pump.</p>',
  about_quality_title: 'Quality Commitment',
  about_quality_content: '<p style="margin-bottom: 20px; line-height: 1.8;">Whether you\'re pouring CRYO Red into a commercial generator, or CRYO Green into your daily driver, you\'re getting a product that has been rigorously formulated for stability.</p><p style="margin-bottom: 20px; line-height: 1.8;">Every batch of CRYO coolant undergoes strict laboratory testing to ensure it meets high automotive standards. From anti-corrosion properties to extreme boiling point resilience, we guarantee a formula that performs flawlessly under the toughest conditions.</p><p style="line-height: 1.8;">Available in 1L and 4L packing with Red, Green and Blue variants, CRYO is the professional\'s choice for thermal management.</p>',
  about_benefits_list: '<li>Helps protect engines from overheating</li><li>Supports stable cooling system performance</li><li>Suitable for cars, commercial vehicles, generators and industrial machinery</li><li>Professional coolant solution for daily and heavy-duty use</li>'
};

function parseJsonContent(raw, fallback) {
  if (!raw) return fallback;
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return fallback;
  }
}

async function loadSiteCms() {
  if (typeof supabaseClient === 'undefined') return { ...CMS_DEFAULTS };
  const { data, error } = await supabaseClient.from('page_content').select('content').eq('slug', CMS_SLUG).maybeSingle();
  if (error || !data) return { ...CMS_DEFAULTS };
  return { ...CMS_DEFAULTS, ...parseJsonContent(data.content, {}) };
}

async function saveSiteCms(patch) {
  const current = await loadSiteCms();
  const merged = { ...current, ...patch };
  const { error } = await supabaseClient.from('page_content').upsert({
    slug: CMS_SLUG,
    title: 'Site CMS Settings',
    content: JSON.stringify(merged),
    updated_at: new Date().toISOString()
  });
  return { error, data: merged };
}

async function loadTestimonials() {
  if (typeof supabaseClient === 'undefined') return [];
  const { data, error } = await supabaseClient.from('page_content').select('content').eq('slug', TESTIMONIALS_SLUG).maybeSingle();
  if (error || !data) return [];
  const list = parseJsonContent(data.content, []);
  return Array.isArray(list) ? list.filter(t => t.is_active !== false) : [];
}

async function loadAllTestimonialsAdmin() {
  if (typeof supabaseClient === 'undefined') return [];
  const { data, error } = await supabaseClient.from('page_content').select('content').eq('slug', TESTIMONIALS_SLUG).maybeSingle();
  if (error || !data) return [];
  const list = parseJsonContent(data.content, []);
  return Array.isArray(list) ? list : [];
}

async function saveTestimonialsList(list) {
  const { error } = await supabaseClient.from('page_content').upsert({
    slug: TESTIMONIALS_SLUG,
    title: 'Customer Testimonials',
    content: JSON.stringify(list),
    updated_at: new Date().toISOString()
  });
  return { error };
}

async function loadProductReviews() {
  if (typeof supabaseClient === 'undefined') return [];
  const { data, error } = await supabaseClient.from('page_content').select('content').eq('slug', PRODUCT_REVIEWS_SLUG).maybeSingle();
  if (error || !data) return [];
  const list = parseJsonContent(data.content, []);
  return Array.isArray(list) ? list.filter(t => t.is_active !== false) : [];
}

async function loadAllProductReviewsAdmin() {
  if (typeof supabaseClient === 'undefined') return [];
  const { data, error } = await supabaseClient.from('page_content').select('content').eq('slug', PRODUCT_REVIEWS_SLUG).maybeSingle();
  if (error || !data) return [];
  const list = parseJsonContent(data.content, []);
  return Array.isArray(list) ? list : [];
}

async function saveProductReviewsList(list) {
  const { error } = await supabaseClient.from('page_content').upsert({
    slug: PRODUCT_REVIEWS_SLUG,
    title: 'Product Reviews',
    content: JSON.stringify(list),
    updated_at: new Date().toISOString()
  });
  return { error };
}

function cmsSchemaErrorMessage(error) {
  if (!error) return null;
  const msg = error.message || '';
  if (msg.includes('page_content') || msg.includes('schema cache') || error.code === '42P01') {
    return 'Database not set up yet. Open Supabase → SQL Editor → run the file supabase/schema.sql, then try again.';
  }
  return error.message;
}

// Expose globally for admin + storefront
window.loadSiteCms = loadSiteCms;
window.saveSiteCms = saveSiteCms;
window.loadTestimonials = loadTestimonials;
window.loadAllTestimonialsAdmin = loadAllTestimonialsAdmin;
window.saveTestimonialsList = saveTestimonialsList;
window.loadProductReviews = loadProductReviews;
window.loadAllProductReviewsAdmin = loadAllProductReviewsAdmin;
window.saveProductReviewsList = saveProductReviewsList;
window.cmsSchemaErrorMessage = cmsSchemaErrorMessage;
