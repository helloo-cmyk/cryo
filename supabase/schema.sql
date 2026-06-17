-- CRYO CMS — run this ONCE in Supabase Dashboard → SQL Editor
-- Creates the page_content table used for policies, site settings (JSON), and reviews

CREATE TABLE IF NOT EXISTS page_content (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read page_content" ON page_content;
CREATE POLICY "Public read page_content" ON page_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Auth manage page_content" ON page_content;
CREATE POLICY "Auth manage page_content" ON page_content FOR ALL USING (auth.role() = 'authenticated');

-- Ensure global settings row exists (whatsapp + delivery — original columns)
INSERT INTO settings (id, whatsappNumber, deliveryCharge, expressDeliveryCharge)
VALUES ('global', '923014138007', 200, 350)
ON CONFLICT (id) DO NOTHING;
