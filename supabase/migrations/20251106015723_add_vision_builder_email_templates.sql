/*
  # Add Vision Builder Email Templates

  1. New Templates
    - Vision Builder Completion Email (sent to user)
    - Vision Builder Admin Notification (sent to admin)

  2. Variables
    - Completion: name, area_of_life, vision_link, community_link
    - Admin: name, email, area_of_life, completed_at, admin_link, current_reality, why_important
*/

INSERT INTO email_templates (template_name, template_key, subject, content, variables, description)
VALUES
  (
    'Vision Builder Completion',
    'vision_builder_completion',
    'Your Vision is Ready + Next Steps',
    '<h1>Congratulations on Creating Your Vision!</h1>
<p>Hi {{name}},</p>
<p>Congratulations on creating your 1-year vision for <strong>{{area_of_life}}</strong>!</p>
<p>You can view and download your vision anytime at:<br>
<a href="{{vision_link}}" style="display: inline-block; padding: 12px 24px; background-color: #0f766e; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">View Your Vision</a></p>

<h2>Ready to Make It Real?</h2>
<p>Your vision is just the beginning. The real transformation happens when you take consistent action with support and accountability.</p>
<p>That''s why we created the Inner Edge Men''s Community—a place where men like you come together to grow, support each other, and become the best versions of themselves.</p>
<p><a href="{{community_link}}" style="display: inline-block; padding: 12px 24px; background-color: #0f766e; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">Join the Community</a></p>

<p>You''ve taken the first step by creating your vision. Now let''s make it happen together.</p>

<p>Best regards,<br>
The Inner Edge Team</p>',
    '["name", "area_of_life", "vision_link", "community_link"]'::jsonb,
    'Sent to users after they complete their Vision Builder and AI generates their vision'
  ),
  (
    'Vision Builder Admin Notification',
    'vision_builder_admin_notification',
    'New Vision Created - {{name}}',
    '<h2>New Vision Builder Submission</h2>

<p><strong>Name:</strong> {{name}}<br>
<strong>Email:</strong> {{email}}<br>
<strong>Area of Life:</strong> {{area_of_life}}<br>
<strong>Completed:</strong> {{completed_at}}</p>

<p><a href="{{admin_link}}" style="display: inline-block; padding: 10px 20px; background-color: #0f766e; color: white; text-decoration: none; border-radius: 6px; margin: 12px 0;">View in Admin</a></p>

<h3>Current Reality:</h3>
<p>{{current_reality}}</p>

<h3>Why Important:</h3>
<p>{{why_important}}</p>',
    '["name", "email", "area_of_life", "completed_at", "admin_link", "current_reality", "why_important"]'::jsonb,
    'Internal notification sent to admin when someone completes their Vision Builder'
  )
ON CONFLICT (template_key) DO NOTHING;
