-- CRYO CMS schema — run in Supabase SQL Editor
-- Extends settings + adds page_content and testimonials tables

-- ── Settings extensions (contact, bank, banner URLs, about content) ──
ALTER TABLE settings ADD COLUMN IF NOT EXISTS phone_display TEXT DEFAULT '0301-4138007';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS email TEXT DEFAULT 'info@cryo.pk';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS address TEXT DEFAULT 'Fiesta Garden, Nawan Shehar, Near RTO Office, Multan';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS map_embed_url TEXT DEFAULT 'https://maps.google.com/maps?q=Fiesta%20Garden%20Nawan%20Shehar%20Near%20RTO%20Office%20Multan&t=&z=13&ie=UTF8&iwloc=&output=embed';

ALTER TABLE settings ADD COLUMN IF NOT EXISTS jazzcash_title TEXT DEFAULT 'Ali imtiaz';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS jazzcash_account TEXT DEFAULT '03017462055';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS meezan_title TEXT DEFAULT 'Imtiaz & sons traders';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS meezan_account TEXT DEFAULT '68010113530815';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS meezan_iban TEXT DEFAULT 'PK59MEZN0068010113530815';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS ubl_title TEXT DEFAULT 'Imtiaz and Sons Traders';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS ubl_account TEXT DEFAULT '2713378030254';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS ubl_iban TEXT DEFAULT 'PK54UNIL0109000378030254';

ALTER TABLE settings ADD COLUMN IF NOT EXISTS hero_image_url TEXT DEFAULT 'assets/images/hero bg.png';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS shop_banner_url TEXT DEFAULT 'assets/images/shop-hero.png';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS about_banner_url TEXT DEFAULT 'assets/images/about-hero.png';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS contact_banner_url TEXT DEFAULT 'assets/images/contact-hero.png';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS dealer_banner_url TEXT DEFAULT 'assets/images/dealer-hero.png';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS about_story_image_url TEXT DEFAULT 'assets/images/hero-worker-coolant.jpg';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS about_quality_image_url TEXT DEFAULT 'assets/images/quality-commitment.png';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS benefits_image_url TEXT DEFAULT 'assets/images/1l and 4l red.jpeg';

ALTER TABLE settings ADD COLUMN IF NOT EXISTS about_mission_title TEXT DEFAULT 'Beyond Temperature';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS about_mission_content TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS about_formula_title TEXT DEFAULT 'The Premium Formula';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS about_formula_content TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS about_quality_title TEXT DEFAULT 'Quality Commitment';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS about_quality_content TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS about_benefits_list TEXT;

-- ── Policy / static page content ──
CREATE TABLE IF NOT EXISTS page_content (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Customer testimonials (homepage) ──
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ──
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read page_content" ON page_content;
CREATE POLICY "Public read page_content" ON page_content FOR SELECT USING (true);
DROP POLICY IF EXISTS "Auth manage page_content" ON page_content;
CREATE POLICY "Auth manage page_content" ON page_content FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read active testimonials" ON testimonials;
CREATE POLICY "Public read active testimonials" ON testimonials FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Auth read all testimonials" ON testimonials;
CREATE POLICY "Auth read all testimonials" ON testimonials FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth manage testimonials" ON testimonials;
CREATE POLICY "Auth manage testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
