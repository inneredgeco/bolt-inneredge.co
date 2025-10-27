/*
  # Create Admin User

  1. Changes
    - Creates an admin user with email admin@inner-edge.com
    - Password: innerwork2024
  
  2. Security
    - This user will be used for admin operations
    - Can be used to update posts through the admin interface
*/

-- Create admin user using Supabase auth
DO $$
DECLARE
  user_id uuid;
BEGIN
  -- Check if user already exists
  SELECT id INTO user_id FROM auth.users WHERE email = 'admin@inner-edge.com';
  
  IF user_id IS NULL THEN
    -- Create the user
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_sent_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@inner-edge.com',
      crypt('innerwork2024', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      NOW(),
      NOW(),
      NOW()
    );
  END IF;
END $$;
