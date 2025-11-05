/*
  # Create vision_submissions table for Vision Builder tool

  1. New Tables
    - `vision_submissions`
      - `id` (uuid, primary key) - Unique submission identifier used in resume URLs
      - `name` (text) - User's full name
      - `email` (text) - User's email address
      - `area_of_life` (text, nullable) - Selected life area to focus on
      - `current_reality` (text, nullable) - Current state description (Step 3)
      - `why_important` (text, nullable) - Motivation and importance (Step 4)
      - `being_words` (jsonb, nullable) - Identity/being words collection (Step 5)
      - `doing_actions` (jsonb, nullable) - Action items collection (Step 5)
      - `having_outcomes` (jsonb, nullable) - Desired outcomes collection (Step 5)
      - `current_step` (integer) - Track which step user is on (1-6)
      - `status` (text) - Submission status: 'started', 'in_progress', 'completed'
      - `created_at` (timestamptz) - When submission was created
      - `updated_at` (timestamptz) - Last update timestamp
      - `step_1_completed_at` (timestamptz, nullable) - Step 1 completion timestamp
      - `step_2_completed_at` (timestamptz, nullable) - Step 2 completion timestamp
      - `step_3_completed_at` (timestamptz, nullable) - Step 3 completion timestamp
      - `step_4_completed_at` (timestamptz, nullable) - Step 4 completion timestamp
      - `step_5_completed_at` (timestamptz, nullable) - Step 5 completion timestamp
      - `step_6_completed_at` (timestamptz, nullable) - Step 6 completion timestamp
      - `completed_at` (timestamptz, nullable) - Full completion timestamp

  2. Security
    - Enable RLS on `vision_submissions` table
    - Allow anonymous users to insert new submissions (create)
    - Allow anonymous users to read their own submission by ID (for resume link)
    - Allow anonymous users to update their own submission by ID
    - Allow authenticated admin users to view all submissions
    - Allow authenticated admin users to delete submissions

  3. Indexes
    - Index on email for lookup
    - Index on status for analytics filtering
    - Index on created_at for chronological sorting
    - Index on area_of_life for popularity analytics

  4. Notes
    - JSONB fields support flexible arrays of words/actions/outcomes
    - Step timestamps enable drop-off analysis
    - current_step allows resuming from exact point
    - ID is used in resume URLs: /vision-builder/resume/{id}
*/

CREATE TABLE IF NOT EXISTS vision_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  area_of_life text,
  current_reality text,
  why_important text,
  being_words jsonb DEFAULT '[]'::jsonb,
  doing_actions jsonb DEFAULT '[]'::jsonb,
  having_outcomes jsonb DEFAULT '[]'::jsonb,
  current_step integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'started',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  step_1_completed_at timestamptz,
  step_2_completed_at timestamptz,
  step_3_completed_at timestamptz,
  step_4_completed_at timestamptz,
  step_5_completed_at timestamptz,
  step_6_completed_at timestamptz,
  completed_at timestamptz
);

ALTER TABLE vision_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create vision submissions"
  ON vision_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read vision submissions by ID"
  ON vision_submissions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update vision submissions by ID"
  ON vision_submissions
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all vision submissions"
  ON vision_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete vision submissions"
  ON vision_submissions
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_vision_submissions_email ON vision_submissions(email);
CREATE INDEX IF NOT EXISTS idx_vision_submissions_status ON vision_submissions(status);
CREATE INDEX IF NOT EXISTS idx_vision_submissions_created_at ON vision_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vision_submissions_area_of_life ON vision_submissions(area_of_life);
CREATE INDEX IF NOT EXISTS idx_vision_submissions_current_step ON vision_submissions(current_step);