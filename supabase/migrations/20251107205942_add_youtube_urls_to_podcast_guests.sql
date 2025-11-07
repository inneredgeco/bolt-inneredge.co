/*
  # Add YouTube URLs to Podcast Guests Table

  1. Changes
    - Add `guest_youtube_url` column to store the guest's personal YouTube channel
    - Add `podcast_youtube_url` column to store the YouTube URL for the specific podcast episode
  
  2. Notes
    - Both columns are nullable to support existing records
    - `guest_youtube_url` is for the guest's own YouTube channel (displayed in social links)
    - `podcast_youtube_url` is for the podcast episode on the host's YouTube channel (displayed in episode section)
    - Existing `youtube_url` column will be migrated to `podcast_youtube_url` and then removed
    - No RLS changes needed as this is just adding data fields to existing table
*/

DO $$
BEGIN
  -- Add guest's personal YouTube channel URL
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'podcast_guests' AND column_name = 'guest_youtube_url'
  ) THEN
    ALTER TABLE podcast_guests ADD COLUMN guest_youtube_url text;
  END IF;

  -- Add podcast episode YouTube URL
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'podcast_guests' AND column_name = 'podcast_youtube_url'
  ) THEN
    ALTER TABLE podcast_guests ADD COLUMN podcast_youtube_url text;
  END IF;

  -- Migrate existing youtube_url data to podcast_youtube_url
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'podcast_guests' AND column_name = 'youtube_url'
  ) THEN
    UPDATE podcast_guests 
    SET podcast_youtube_url = youtube_url 
    WHERE youtube_url IS NOT NULL AND podcast_youtube_url IS NULL;
    
    -- Drop the old youtube_url column
    ALTER TABLE podcast_guests DROP COLUMN IF EXISTS youtube_url;
  END IF;
END $$;