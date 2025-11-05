/*
  # Create email_templates table

  1. New Tables
    - `email_templates`
      - `id` (uuid, primary key)
      - `template_name` (text) - Human-readable name for the template
      - `template_key` (text, unique) - Unique identifier key for programmatic access
      - `subject` (text) - Email subject line
      - `content` (text) - HTML content of the email template
      - `variables` (jsonb) - Available variables for template personalization
      - `description` (text) - Description of when this template is used
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `email_templates` table
    - Add policy for authenticated users to read templates
    - Add policy for authenticated users to update templates

  3. Initial Data
    - Seed with common email templates for podcast guest communications
*/

CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name text NOT NULL,
  template_key text UNIQUE NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  variables jsonb DEFAULT '[]'::jsonb,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read email templates"
  ON email_templates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update email templates"
  ON email_templates
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_email_templates_key ON email_templates(template_key);

INSERT INTO email_templates (template_name, template_key, subject, content, variables, description)
VALUES
  (
    'Podcast Guest Welcome',
    'podcast_guest_welcome',
    'Welcome to Inner Edge Podcast - Next Steps',
    '<h1>Welcome to Inner Edge Podcast!</h1>
<p>Hi {{firstName}},</p>
<p>Thank you for applying to be a guest on the Inner Edge Podcast. We''re excited to learn more about your story and expertise.</p>
<h2>Next Steps</h2>
<p>Please complete your guest profile by clicking the link below:</p>
<p><a href="{{onboardingLink}}">Complete Your Guest Profile</a></p>
<p>This will help us prepare for a great conversation and create promotional materials for your episode.</p>
<p>If you have any questions, feel free to reply to this email.</p>
<p>Best regards,<br>Soleiman Bolour<br>Inner Edge Podcast</p>',
    '["firstName", "lastName", "email", "onboardingLink"]'::jsonb,
    'Sent to podcast guests after they submit the initial application form'
  ),
  (
    'Podcast Guest Confirmation',
    'podcast_guest_confirmation',
    'Your Inner Edge Podcast Profile is Complete',
    '<h1>Thank You for Completing Your Profile!</h1>
<p>Hi {{firstName}},</p>
<p>Your guest profile for the Inner Edge Podcast has been received and looks great.</p>
<h2>What Happens Next?</h2>
<ul>
<li>We''ll review your profile and topics</li>
<li>You''ll receive a calendar invite for recording within 3-5 business days</li>
<li>We''ll send you preparation tips before the recording</li>
</ul>
<p>Your profile page is live at: <a href="{{profileUrl}}">{{profileUrl}}</a></p>
<p>We''re looking forward to our conversation!</p>
<p>Best regards,<br>Soleiman Bolour<br>Inner Edge Podcast</p>',
    '["firstName", "lastName", "email", "profileUrl"]'::jsonb,
    'Sent to podcast guests after they complete the onboarding form'
  ),
  (
    'Contact Form Submission',
    'contact_form_confirmation',
    'Thanks for Reaching Out - Inner Edge',
    '<h1>Thank You for Your Message</h1>
<p>Hi {{name}},</p>
<p>Thank you for reaching out through Inner Edge. I''ve received your message and will get back to you within 24-48 hours.</p>
<h2>Your Message</h2>
<p><strong>Subject:</strong> {{subject}}</p>
<p>{{message}}</p>
<p>If your inquiry is urgent, feel free to connect with me on social media:</p>
<ul>
<li><a href="https://www.instagram.com/inneredge.co">Instagram</a></li>
<li><a href="https://www.facebook.com/inneredge.co">Facebook</a></li>
</ul>
<p>Best regards,<br>Soleiman Bolour<br>Inner Edge</p>',
    '["name", "email", "subject", "message"]'::jsonb,
    'Sent to users after they submit the contact form'
  );
