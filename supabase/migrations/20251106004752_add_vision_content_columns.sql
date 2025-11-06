/*
  # Add Vision Content Columns to vision_submissions Table

  1. Changes
    - Add `vision_narrative` column to store AI-generated vision story
    - Add `action_plan` column to store 12-month action plan
  
  2. Details
    - Both columns are TEXT type to accommodate large content
    - Columns are nullable since they're populated after submission
    - No default values needed as content is generated on demand
  
  3. Purpose
    These columns store the AI-generated content from the Claude API:
    - vision_narrative: First-person narrative of their ideal future
    - action_plan: Month-by-month breakdown with SMART goals
*/

-- Add vision content columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vision_submissions' AND column_name = 'vision_narrative'
  ) THEN
    ALTER TABLE vision_submissions ADD COLUMN vision_narrative TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vision_submissions' AND column_name = 'action_plan'
  ) THEN
    ALTER TABLE vision_submissions ADD COLUMN action_plan TEXT;
  END IF;
END $$;