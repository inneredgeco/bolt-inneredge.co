/*
  # Add Sender Fields to Email Templates

  1. Changes
    - Add `from_email` column (text, default: 'vision@send.inneredge.co')
    - Add `from_name` column (text, default: 'Inner Edge')
    - Add `reply_to_email` column (text, default: 'info@inneredge.co')
  
  2. Updates
    - Set default values for all existing templates
    - Allow admins to customize sender information per template
*/

-- Add new columns to email_templates table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'email_templates' AND column_name = 'from_email'
  ) THEN
    ALTER TABLE email_templates ADD COLUMN from_email text DEFAULT 'vision@send.inneredge.co';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'email_templates' AND column_name = 'from_name'
  ) THEN
    ALTER TABLE email_templates ADD COLUMN from_name text DEFAULT 'Inner Edge';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'email_templates' AND column_name = 'reply_to_email'
  ) THEN
    ALTER TABLE email_templates ADD COLUMN reply_to_email text DEFAULT 'info@inneredge.co';
  END IF;
END $$;

-- Update existing templates with default values
UPDATE email_templates
SET 
  from_email = COALESCE(from_email, 'vision@send.inneredge.co'),
  from_name = COALESCE(from_name, 'Inner Edge'),
  reply_to_email = COALESCE(reply_to_email, 'info@inneredge.co')
WHERE from_email IS NULL OR from_name IS NULL OR reply_to_email IS NULL;
