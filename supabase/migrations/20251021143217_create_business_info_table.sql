/*
  # Create business_info table for local SEO

  1. New Tables
    - `business_info`
      - `id` (uuid, primary key) - Unique identifier
      - `business_name` (text) - Business name for NAP consistency
      - `address_street` (text) - Street address
      - `address_city` (text) - City name
      - `address_state` (text) - State/region
      - `address_zip` (text) - ZIP/postal code
      - `address_country` (text) - Country
      - `phone` (text) - Business phone number
      - `email` (text) - Business email
      - `website` (text) - Website URL
      - `business_type` (text) - Schema.org business type
      - `description` (text) - Business description
      - `founded_year` (integer) - Year business was founded
      - `service_area` (text[]) - Areas served (for virtual services)
      - `social_profiles` (jsonb) - Social media profile URLs
      - `hours_of_operation` (jsonb) - Business hours
      - `logo_url` (text) - Logo image URL
      - `image_url` (text) - Primary business image URL
      - `price_range` (text) - Price range indicator
      - `accepts_reservations` (boolean) - Whether bookings are accepted
      - `updated_at` (timestamptz) - Last update timestamp
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on `business_info` table
    - Add policy for public read access (business info is public)
    - Add policy for authenticated admin updates

  3. Notes
    - Single source of truth for all NAP (Name, Address, Phone) data
    - Used to generate structured data and ensure consistency
    - Service area array supports virtual/remote service businesses
*/

CREATE TABLE IF NOT EXISTS business_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL DEFAULT 'Inner Edge',
  address_street text NOT NULL DEFAULT '11059 Dutton Dr',
  address_city text NOT NULL DEFAULT 'La Mesa',
  address_state text NOT NULL DEFAULT 'CA',
  address_zip text NOT NULL DEFAULT '91941',
  address_country text NOT NULL DEFAULT 'US',
  phone text NOT NULL DEFAULT '310-266-2677',
  email text NOT NULL DEFAULT 'contact@inneredge.co',
  website text NOT NULL DEFAULT 'https://www.inneredge.co',
  business_type text NOT NULL DEFAULT 'ProfessionalService',
  description text NOT NULL DEFAULT 'Transformative life coaching and emotional wellness services in San Diego. Virtual coaching for personal growth, emotional intelligence, and authentic living.',
  founded_year integer DEFAULT 2020,
  service_area text[] DEFAULT ARRAY['San Diego, CA', 'California', 'United States'],
  social_profiles jsonb DEFAULT '{}',
  hours_of_operation jsonb DEFAULT '{"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "09:00", "closes": "18:00"}',
  logo_url text DEFAULT '/inner-edge-logo.png',
  image_url text DEFAULT '/soleiman-main.jpg',
  price_range text DEFAULT '$$',
  accepts_reservations boolean DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE business_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business info is publicly readable"
  ON business_info
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only authenticated users can update business info"
  ON business_info
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default business information
INSERT INTO business_info (id) 
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;