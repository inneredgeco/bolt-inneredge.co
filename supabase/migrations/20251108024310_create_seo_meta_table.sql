/*
  # Create SEO Meta Management Table

  1. New Tables
    - `seo_meta`
      - `id` (uuid, primary key) - Unique identifier
      - `page_path` (text, unique, not null) - Page URL path (e.g., /, /about, /blog/post-slug)
      - `page_title` (text) - HTML page title tag content
      - `meta_description` (text) - Meta description for SEO
      - `keywords` (text) - Comma-separated keywords
      - `og_title` (text) - Open Graph title
      - `og_description` (text) - Open Graph description
      - `og_image_url` (text) - Open Graph image URL
      - `og_url` (text) - Canonical Open Graph URL
      - `twitter_card` (text) - Twitter card type (default: summary_large_image)
      - `twitter_image_url` (text) - Twitter card image URL
      - `locality` (text) - Geographic locality (e.g., San Diego)
      - `region` (text) - Geographic region (e.g., CA)
      - `additional_meta` (jsonb) - Additional meta tags as JSON
      - `created_at` (timestamp) - Record creation timestamp
      - `updated_at` (timestamp) - Last update timestamp

  2. Security
    - Enable RLS on `seo_meta` table
    - Add policy for public read access (anon and authenticated users)
    - Add policy for authenticated users to insert new records
    - Add policy for authenticated users to update existing records
    - Add policy for authenticated users to delete records

  3. Important Notes
    - page_path must be unique to prevent duplicate entries
    - All SEO fields are optional except page_path
    - JSONB additional_meta allows flexible storage of custom meta tags
    - RLS policies allow public read for frontend SEO rendering
    - Only authenticated users (admins) can modify SEO data
*/

CREATE TABLE IF NOT EXISTS seo_meta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text UNIQUE NOT NULL,
  page_title text,
  meta_description text,
  keywords text,
  og_title text,
  og_description text,
  og_image_url text,
  og_url text,
  twitter_card text DEFAULT 'summary_large_image',
  twitter_image_url text,
  locality text,
  region text,
  additional_meta jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE seo_meta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read seo_meta"
  ON seo_meta
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert seo_meta"
  ON seo_meta
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update seo_meta"
  ON seo_meta
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete seo_meta"
  ON seo_meta
  FOR DELETE
  TO authenticated
  USING (true);