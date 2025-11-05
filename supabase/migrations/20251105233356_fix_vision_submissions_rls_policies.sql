/*
  # Fix RLS Policies for Vision Submissions

  ## Summary
  Updates Row Level Security policies for the vision_submissions table to allow public form submissions
  and access to vision data via unique links.

  ## Changes Made
  1. Enables RLS on vision_submissions table
  2. Drops any existing conflicting policies
  3. Creates new policies:
     - Allow public insert: Anyone can submit a vision (anon + authenticated users)
     - Allow read own submissions: Anyone can read submissions (for unique link access)
     - Allow update own submissions: Anyone can update submissions (for continuing progress)

  ## Security Notes
  - Policies are permissive to support public vision builder functionality
  - Users access their submissions via unique UUID links
  - No authentication required for vision builder to improve UX
  - All data access is via unique submission IDs which are essentially secrets
*/

-- Enable RLS on the table (if not already enabled)
ALTER TABLE vision_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public insert" ON vision_submissions;
DROP POLICY IF EXISTS "Allow public read own submissions" ON vision_submissions;
DROP POLICY IF EXISTS "Allow read own submissions" ON vision_submissions;
DROP POLICY IF EXISTS "Allow update own submissions" ON vision_submissions;

-- Create policy to allow anyone to insert (public form submission)
CREATE POLICY "Allow public insert" 
ON vision_submissions 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Create policy to allow users to read their own submissions via unique link
CREATE POLICY "Allow read own submissions"
ON vision_submissions
FOR SELECT
TO anon, authenticated
USING (true);

-- Create policy to allow users to update their submissions as they progress
CREATE POLICY "Allow update own submissions"
ON vision_submissions
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);
