/*
  # Add Anonymous Insert Policy for Podcast Guests

  1. Changes
    - Add RLS policy to allow anonymous users to insert into podcast_guests table
    - This enables the public onboarding form to work correctly

  2. Security
    - Policy allows INSERT only for anon role
    - All data must pass validation in the edge function before reaching the database
    - Other policies remain restrictive (only authenticated users can update/delete)
*/

-- Allow anonymous users to insert new podcast guests (for onboarding form)
DROP POLICY IF EXISTS "Allow anonymous insert for onboarding" ON podcast_guests;

CREATE POLICY "Allow anonymous insert for onboarding"
ON podcast_guests
FOR INSERT
TO anon
WITH CHECK (true);
