/*
  # Create posts table for men's personal development blog

  1. New Tables
    - `posts`
      - `id` (uuid, primary key) - Unique identifier for each post
      - `title` (text) - Post title
      - `slug` (text, unique) - URL-friendly version of title
      - `content` (text) - Full blog post content
      - `excerpt` (text) - Short preview text (3-4 sentences)
      - `author` (text) - Author name
      - `image_url` (text) - URL to featured image
      - `published` (boolean, default false) - Publication status
      - `created_at` (timestamptz) - Timestamp of creation

  2. Security
    - Enable RLS on `posts` table
    - Add policy for public to read published posts
    - Add policy for all operations (temporary for Phase 1, will secure in Phase 2)
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  author text NOT NULL DEFAULT 'Soleiman',
  image_url text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published posts"
  ON posts
  FOR SELECT
  USING (published = true);

CREATE POLICY "Allow all operations for now"
  ON posts
  FOR ALL
  USING (true)
  WITH CHECK (true);