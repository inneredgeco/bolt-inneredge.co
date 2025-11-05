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
    'Contact Form Confirmation',
    'contact_form_confirmation',
    'Thanks for Reaching Out - Inner Edge',
    '<h1>Thank You for Your Message</h1>
<p>Hi {name},</p>
<p>Thank you for reaching out through Inner Edge. I have received your message and will get back to you within 24-48 hours.</p>
<h2>Your Message</h2>
<p><strong>Subject:</strong> {subject}</p>
<p>{message}</p>
<p>If your inquiry is urgent, feel free to connect with me on social media:</p>
<ul>
<li><a href="https://www.instagram.com/inneredge.co">Instagram</a></li>
<li><a href="https://www.facebook.com/inneredge.co">Facebook</a></li>
</ul>
<p>Best regards,<br>Soleiman Bolour<br>Inner Edge</p>',
    '["name", "email", "subject", "message"]'::jsonb,
    'Sent to users after they submit the contact form'
  ),
  (
    'Contact Form Notification',
    'contact_form_notification',
    'New Contact Form Submission - {firstName} {lastName}',
    '<h2>New Contact Form Submission</h2>
<p><strong>NAME:</strong> {firstName} {lastName}</p>
<p><strong>EMAIL:</strong> {email}</p>
<p><strong>PHONE:</strong> {phone}</p>
<p><strong>NEWSLETTER:</strong> {newsletter}</p>
<h3>Message:</h3>
<p>{message}</p>
<p><strong>SUBMITTED AT:</strong> {submittedAt}</p>',
    '["firstName", "lastName", "email", "phone", "message", "newsletter", "submittedAt"]'::jsonb,
    'Internal notification sent when someone submits the contact form'
  ),
  (
    'Podcast Guest Application Confirmation',
    'podcast_guest_confirmation',
    'Thanks for Your Podcast Guest Application!',
    '<h1>Thank You for Your Application!</h1>
<p>Hi {firstName},</p>
<p>Thank you for your interest in being a guest on the Inner Edge Podcast! We have received your application and are excited to learn more about your work.</p>
<p>We will review your submission and get back to you within 3-5 business days.</p>
<p>In the meantime, feel free to explore our podcast episodes at <a href="https://inneredge.co/podcast">inneredge.co/podcast</a>.</p>
<p>Looking forward to connecting,<br>The Inner Edge Team</p>',
    '["firstName", "email"]'::jsonb,
    'Sent to users after they submit the podcast guest application form'
  ),
  (
    'Podcast Guest Application Notification',
    'podcast_guest_notification',
    'New Podcast Guest Application - {firstName} {lastName}',
    '<h2>New Podcast Guest Application</h2>
<p><strong>NAME:</strong> {firstName} {lastName}</p>
<p><strong>EMAIL:</strong> {email}</p>
<p><strong>PHONE:</strong> {phone}</p>
<p><strong>PROFESSION:</strong> {profession}</p>
<h3>Why They Would Be a Great Guest:</h3>
<p>{whyGuest}</p>
<h3>Practical Exercise:</h3>
<p>{exercise}</p>
<h3>Social Media:</h3>
<ul>
<li><strong>Website:</strong> {website}</li>
<li><strong>Facebook:</strong> {facebook}</li>
<li><strong>Instagram:</strong> {instagram}</li>
</ul>
<p><strong>SUBMITTED AT:</strong> {submittedAt}</p>',
    '["firstName", "lastName", "email", "phone", "website", "facebook", "instagram", "profession", "whyGuest", "exercise", "submittedAt"]'::jsonb,
    'Internal notification sent when someone submits a podcast guest application'
  ),
  (
    'Guest Onboarding Confirmation',
    'guest_onboarding_confirmation',
    'Profile Received - Inner Edge Podcast',
    '<h1>Thank You for Completing Your Profile!</h1>
<p>Hi {firstName},</p>
<p>Thank you for completing your guest profile! We have received all your information and your headshot looks great.</p>
<p>We will be in touch soon with recording details and episode scheduling.</p>
<p>Looking forward to our conversation,<br>The Inner Edge Team</p>',
    '["firstName", "email"]'::jsonb,
    'Sent to guests after they complete the onboarding form'
  ),
  (
    'Guest Onboarding Notification',
    'guest_onboarding_notification',
    'Guest Profile Completed - {firstName} {lastName}',
    '<h2>Guest Profile Completed</h2>
<p><strong>NAME:</strong> {firstName} {lastName}</p>
<p><strong>EMAIL:</strong> {email}</p>
<p><strong>PHONE:</strong> {phone}</p>
<p><strong>PROFESSION:</strong> {profession}</p>
<h3>Short Bio:</h3>
<p>{shortBio}</p>
<p><strong>PHOTO:</strong> {photoUrl}</p>
<h3>Social Links:</h3>
<ul>
<li><strong>Website:</strong> {website}</li>
<li><strong>Facebook:</strong> {facebook}</li>
<li><strong>Instagram:</strong> {instagram}</li>
<li><strong>LinkedIn:</strong> {linkedin}</li>
</ul>',
    '["firstName", "lastName", "email", "phone", "profession", "shortBio", "photoUrl", "website", "facebook", "instagram", "linkedin"]'::jsonb,
    'Internal notification sent when a guest completes their onboarding profile'
  )
ON CONFLICT (template_key) DO NOTHING;