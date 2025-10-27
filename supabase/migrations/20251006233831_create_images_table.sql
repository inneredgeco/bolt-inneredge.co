/*
  # Create images storage table

  1. New Tables
    - `images`
      - `id` (uuid, primary key) - Unique identifier for each image
      - `user_id` (uuid) - Reference to the user who uploaded the image
      - `file_name` (text) - Original filename of the image
      - `file_path` (text) - Storage path in Supabase storage
      - `file_size` (integer) - Size of the file in bytes
      - `mime_type` (text) - MIME type of the image (e.g., image/jpeg, image/png)
      - `uploaded_at` (timestamptz) - Timestamp when image was uploaded
      - `description` (text, optional) - Optional description for the image

  2. Security
    - Enable RLS on `images` table
    - Add policy for authenticated users to upload their own images
    - Add policy for authenticated users to view their own images
    - Add policy for authenticated users to delete their own images
*/

CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size integer NOT NULL DEFAULT 0,
  mime_type text NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  description text DEFAULT ''
);

ALTER TABLE images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own images"
  ON images
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload own images"
  ON images
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own images"
  ON images
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own images"
  ON images
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS images_user_id_idx ON images(user_id);
CREATE INDEX IF NOT EXISTS images_uploaded_at_idx ON images(uploaded_at DESC);