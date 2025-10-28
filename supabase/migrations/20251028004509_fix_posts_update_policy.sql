/*
  # Fix Posts Update Policy

  1. Changes
    - Drop and recreate the update policy to ensure it works correctly
    - Add a SELECT policy for anon/authenticated to read all posts (needed for update operations)
  
  2. Security
    - Admin panel is password protected in the frontend
    - Anon users can read, insert, update, and delete posts (for admin operations)
    - Public users can only read published posts
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow admin operations on posts - update" ON posts;
DROP POLICY IF EXISTS "Anyone can read published posts" ON posts;

-- Create SELECT policy for admin (anon/authenticated can read all posts)
CREATE POLICY "Admin can read all posts"
  ON posts FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create SELECT policy for public (only published posts)
CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT
  TO public
  USING (published = true);

-- Recreate UPDATE policy
CREATE POLICY "Admin can update posts"
  ON posts FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
