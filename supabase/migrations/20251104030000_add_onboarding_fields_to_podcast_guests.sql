/*
  # Add onboarding fields to podcast guests table

  1. Changes
    - Add `last_name` (text, not null with default) - Guest's last name
    - Add `long_bio` (text, not null with default) - Extended biography (optional but defaults to empty)
    - Add `linkedin_url` (text, nullable) - LinkedIn profile URL
    - Add `email` (text, nullable) - Guest email address
    - Add `phone` (text, nullable) - Guest phone number

  2. Notes
    - Using IF NOT EXISTS pattern to safely add columns
    - Setting default values to allow existing records to remain valid
    - long_bio defaults to empty string as per requirements
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'podcast_guests' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE podcast_guests ADD COLUMN last_name text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'podcast_guests' AND column_name = 'long_bio'
  ) THEN
    ALTER TABLE podcast_guests ADD COLUMN long_bio text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'podcast_guests' AND column_name = 'linkedin_url'
  ) THEN
    ALTER TABLE podcast_guests ADD COLUMN linkedin_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'podcast_guests' AND column_name = 'email'
  ) THEN
    ALTER TABLE podcast_guests ADD COLUMN email text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'podcast_guests' AND column_name = 'phone'
  ) THEN
    ALTER TABLE podcast_guests ADD COLUMN phone text;
  END IF;
END $$;
