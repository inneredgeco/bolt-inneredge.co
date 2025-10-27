/*
  # Fix Admin User Identity

  1. Changes
    - Adds missing identity record for admin user
    - This is required for Supabase auth to work properly
  
  2. Security
    - Ensures admin user can log in with email/password
*/

DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get the admin user ID
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@inner-edge.com';
  
  IF admin_user_id IS NOT NULL THEN
    -- Insert identity record if it doesn't exist
    INSERT INTO auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      admin_user_id,
      admin_user_id::text,
      jsonb_build_object(
        'sub', admin_user_id::text,
        'email', 'admin@inner-edge.com',
        'email_verified', true,
        'phone_verified', false
      ),
      'email',
      NOW(),
      NOW(),
      NOW()
    )
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
