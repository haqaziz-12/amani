-- Run once in Supabase SQL Editor
-- Adds optional featured image for the About page

ALTER TABLE about_content
  ADD COLUMN IF NOT EXISTS image_url text;

-- Optional: allow public read already covered by existing policy
