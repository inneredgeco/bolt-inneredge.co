/*
  # Add updated_at and image_alt_text to posts table

  1. Changes
    - Add `updated_at` column to track when posts are modified
    - Add `image_alt_text` column for custom image alt text
    - Create trigger to automatically update `updated_at` on row updates

  2. Details
    - `updated_at` defaults to current timestamp
    - Trigger function updates `updated_at` automatically on any UPDATE
    - `image_alt_text` is optional text field for SEO optimization
*/

-- Add updated_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE posts ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Add image_alt_text column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'image_alt_text'
  ) THEN
    ALTER TABLE posts ADD COLUMN image_alt_text text;
  END IF;
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists and recreate
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();