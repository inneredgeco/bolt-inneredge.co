/*
  # Add LinkedIn URL to Podcast Guests Table

  1. Changes
    - Add `linkedin_url` column to `podcast_guests` table to store guest LinkedIn profile links
  
  2. Notes
    - Column is nullable to support existing records
    - No RLS changes needed as this is just adding a data field to existing table
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'podcast_guests' AND column_name = 'linkedin_url'
  ) THEN
    ALTER TABLE podcast_guests ADD COLUMN linkedin_url text;
  END IF;
END $$;