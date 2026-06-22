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
  about_mission_content: '',
  about_formula_title: 'The Premium Formula',
  about_formula_content: '',
  about_quality_title: 'Quality Commitment',
  about_quality_content: '',
  about_benefits_list: ''
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
