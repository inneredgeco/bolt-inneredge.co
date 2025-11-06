/**
 * Email helper functions for sending templated emails via Resend
 */

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

interface EmailTemplate {
  subject: string;
  content: string;
  from_email?: string;
  from_name?: string;
  reply_to_email?: string;
}

interface SendEmailOptions {
  to: string;
  template: EmailTemplate;
  variables: Record<string, string>;
}

/**
 * Replace template variables with actual values
 * Supports {{variable}} syntax
 */
export function replaceTemplateVariables(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value || '');
  }

  return result;
}

/**
 * Send an email using Resend API
 */
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const { to, template, variables } = options;

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return false;
  }

  try {
    const subject = replaceTemplateVariables(template.subject, variables);
    const html = replaceTemplateVariables(template.content, variables);

    const fromEmail = template.from_email || 'vision@send.inneredge.co';
    const fromName = template.from_name || 'Inner Edge';
    const replyTo = template.reply_to_email || 'info@inneredge.co';

    const from = `${fromName} <${fromEmail}>`;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from,
        reply_to: replyTo,
        to: to,
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend API error:', errorText);
      return false;
    }

    const data = await response.json();
    console.log('Email sent successfully:', data.id);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Fetch email template from database
 */
export async function getEmailTemplate(
  supabaseClient: any,
  templateKey: string
): Promise<EmailTemplate | null> {
  try {
    const { data, error } = await supabaseClient
      .from('email_templates')
      .select('subject, content, from_email, from_name, reply_to_email')
      .eq('template_key', templateKey)
      .single();

    if (error) {
      console.error('Error fetching template:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getEmailTemplate:', error);
    return null;
  }
}

/**
 * Send templated email by fetching template from database
 */
export async function sendTemplatedEmail(
  supabaseClient: any,
  templateKey: string,
  to: string,
  variables: Record<string, string>
): Promise<boolean> {
  const template = await getEmailTemplate(supabaseClient, templateKey);

  if (!template) {
    console.error(`Template not found: ${templateKey}`);
    return false;
  }

  return await sendEmail({ to, template, variables });
}