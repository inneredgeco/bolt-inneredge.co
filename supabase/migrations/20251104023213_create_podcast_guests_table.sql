/*
  # Create podcast guests table

  1. New Tables
    - `podcast_guests`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier
      - `full_name` (text) - Guest's full name
      - `first_name` (text) - Guest's first name
      - `profession` (text) - Guest's profession/title
      - `short_bio` (text) - Brief bio for hero section
      - `photo_url` (text) - URL to guest's profile photo
      - `pitch` (text) - Why they're a great guest
      - `exercise_description` (text) - The practice/exercise they lead
      - `website_url` (text, nullable) - Personal website
      - `facebook_url` (text, nullable) - Facebook profile
      - `instagram_url` (text, nullable) - Instagram profile
      - `episode_title` (text, nullable) - Podcast episode title
      - `episode_date` (date, nullable) - Episode publication date
      - `spotify_url` (text, nullable) - Spotify episode link
      - `apple_url` (text, nullable) - Apple Podcasts episode link
      - `youtube_url` (text, nullable) - YouTube episode link
      - `status` (text) - Publication status (Draft, Published)
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `podcast_guests` table
    - Add policy for public read access to published guests
    - Add policy for authenticated users to manage all guests

  3. Indexes
    - Index on slug for fast lookups
    - Index on status for filtering
*/

CREATE TABLE IF NOT EXISTS podcast_guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  full_name text NOT NULL,
  first_name text NOT NULL,
  profession text NOT NULL,
  short_bio text NOT NULL,
  photo_url text NOT NULL,
  pitch text NOT NULL,
  exercise_description text NOT NULL,
  website_url text,
  facebook_url text,
  instagram_url text,
  episode_title text,
  episode_date date,
  spotify_url text,
  apple_url text,
  youtube_url text,
  status text NOT NULL DEFAULT 'Draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE podcast_guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published guests"
  ON podcast_guests
  FOR SELECT
  USING (status = 'Published');

CREATE POLICY "Authenticated users can view all guests"
  ON podcast_guests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert guests"
  ON podcast_guests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update guests"
  ON podcast_guests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete guests"
  ON podcast_guests
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_podcast_guests_slug ON podcast_guests(slug);
CREATE INDEX IF NOT EXISTS idx_podcast_guests_status ON podcast_guests(status);
