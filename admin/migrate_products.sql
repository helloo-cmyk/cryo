-- 1. Add the new columns
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS "size" TEXT DEFAULT '1L',
ADD COLUMN IF NOT EXISTS "regularPrice" NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS "offerPrice" NUMERIC DEFAULT 0;

-- 2. Migrate existing data (Optional: defaults to 1L pricing if data exists)
UPDATE public.products 
SET 
  "size" = '1L',
  "regularPrice" = COALESCE("regPrice1L", "regularPrice", 0),
  "offerPrice" = COALESCE("offPrice1L", "offerPrice", 0)
WHERE true;

-- 3. Drop the old multiple pricing and image columns
ALTER TABLE public.products 
DROP COLUMN IF EXISTS "regPrice1L",
DROP COLUMN IF EXISTS "offPrice1L",
DROP COLUMN IF EXISTS "regPrice4L",
DROP COLUMN IF EXISTS "offPrice4L",
DROP COLUMN IF EXISTS "regPriceBoth",
DROP COLUMN IF EXISTS "offPriceBoth",
DROP COLUMN IF EXISTS "image1L",
DROP COLUMN IF EXISTS "image4L";
