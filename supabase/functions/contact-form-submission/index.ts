import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactFormSubmission {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  joinNewsletter: boolean;
  recaptchaResponse: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const formData: ContactFormSubmission = await req.json();

    const webhookUrl = Deno.env.get("PABBLY_WEBHOOK_URL_CONTACT_FORM");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const recaptchaSecretKey = Deno.env.get("RECAPTCHA_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const supabase = supabaseUrl && supabaseServiceKey
      ? createClient(supabaseUrl, supabaseServiceKey)
      : null;

    const submittedAt = new Date().toISOString();

    if (recaptchaSecretKey && formData.recaptchaResponse) {
      try {
        const recaptchaVerifyResponse = await fetch(
          `https://www.google.com/recaptcha/api/siteverify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `secret=${recaptchaSecretKey}&response=${formData.recaptchaResponse}`,
          }
        );

        const recaptchaResult = await recaptchaVerifyResponse.json();

        if (!recaptchaResult.success) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "reCAPTCHA verification failed",
            }),
            {
              status: 400,
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
              },
            }
          );
        }
      } catch (error) {
        console.error("reCAPTCHA verification error:", error);
      }
    }

    const webhookPayload = {
      first_name: formData.firstName || '',
      last_name: formData.lastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      message: formData.message || '',
      newsletter: formData.joinNewsletter || false,
      submitted_at: submittedAt,
    };

    console.log('Webhook payload:', JSON.stringify(webhookPayload, null, 2));

    let webhookSuccess = false;
    let confirmationEmailSuccess = false;
    let notificationEmailSuccess = false;
    const errors: string[] = [];

    if (webhookUrl) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookPayload),
        });

        if (webhookResponse.ok) {
          webhookSuccess = true;
          console.log("Webhook sent successfully");
        } else {
          const errorText = await webhookResponse.text();
          errors.push(`Webhook failed: ${webhookResponse.status} - ${errorText}`);
          console.error("Webhook error:", errorText);
        }
      } catch (error) {
        errors.push(`Webhook error: ${error.message}`);
        console.error("Webhook error:", error);
      }
    } else {
      errors.push("Webhook URL not configured");
      console.warn("PABBLY_WEBHOOK_URL_CONTACT_FORM not set");
    }

    if (resendApiKey && supabase) {
      try {
        const { data: confirmTemplate } = await supabase
          .from('email_templates')
          .select('subject, content, from_email, from_name, reply_to_email')
          .eq('template_key', 'contact_form_confirmation')
          .maybeSingle();

        const fromEmail = confirmTemplate?.from_email || 'contact@send.inneredge.co';
        const fromName = confirmTemplate?.from_name || 'Inner Edge';
        const replyTo = confirmTemplate?.reply_to_email || 'info@inneredge.co';
        const subject = confirmTemplate?.subject || 'Thanks for Reaching Out!';

        let html = confirmTemplate?.content || `
              <p>Hi {firstName},</p>

              <p>Thank you for contacting Inner Edge. We've received your message and will get back to you within 1-2 business days.</p>

              <p>In the meantime, feel free to explore our podcast at <a href="https://inneredge.co/podcast">inneredge.co/podcast</a> or learn more about our men's community at <a href="https://links.inneredge.co/menscommunity">https://links.inneredge.co/menscommunity</a></p>

              <p>Looking forward to connecting,<br>
              Inner Edge</p>
            `;

        const fullName = `${formData.firstName} ${formData.lastName}`.trim();

        html = html.replace(/{name}/g, fullName);
        html = html.replace(/{firstName}/g, formData.firstName);
        html = html.replace(/{lastName}/g, formData.lastName);
        html = html.replace(/{email}/g, formData.email);
        html = html.replace(/{phone}/g, formData.phone || 'Not provided');
        html = html.replace(/{subject}/g, 'Contact Form Inquiry');
        html = html.replace(/{message}/g, formData.message.replace(/\n/g, '<br>'));
        html = html.replace(/{newsletter}/g, formData.joinNewsletter ? 'Yes' : 'No');
        html = html.replace(/{submittedAt}/g, submittedAt);

        const confirmationResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: `${fromName} <${fromEmail}>`,
            reply_to: replyTo,
            to: formData.email,
            subject: subject,
            html: html,
          }),
        });

        if (confirmationResponse.ok) {
          confirmationEmailSuccess = true;
          console.log("Confirmation email sent successfully");
        } else {
          const errorText = await confirmationResponse.text();
          errors.push(`Confirmation email failed: ${confirmationResponse.status} - ${errorText}`);
          console.error("Confirmation email error:", errorText);
        }
      } catch (error) {
        errors.push(`Confirmation email error: ${error.message}`);
        console.error("Confirmation email error:", error);
      }

      try {
        const { data: notifTemplate } = await supabase
          .from('email_templates')
          .select('subject, content, from_email, from_name, reply_to_email')
          .eq('template_key', 'contact_form_notification')
          .maybeSingle();

        const notifFromEmail = notifTemplate?.from_email || 'contact@send.inneredge.co';
        const notifFromName = notifTemplate?.from_name || 'Inner Edge';
        const notifReplyTo = notifTemplate?.reply_to_email || 'info@inneredge.co';
        let notifSubject = notifTemplate?.subject || `New Contact Form Submission - {firstName} {lastName}`;
        let notifHtml = notifTemplate?.content || `
              <p>New contact form submission:</p>

              <p><strong>NAME:</strong> {firstName} {lastName}<br>
              <strong>EMAIL:</strong> {email}<br>
              <strong>PHONE:</strong> {phone}<br>
              <strong>NEWSLETTER:</strong> {newsletter}</p>

              <p><strong>MESSAGE:</strong><br>
              {message}</p>

              <p><strong>SUBMITTED AT:</strong> {submittedAt}</p>

              <hr>
            `;

        notifSubject = notifSubject.replace(/{firstName}/g, formData.firstName);
        notifSubject = notifSubject.replace(/{lastName}/g, formData.lastName);
        notifHtml = notifHtml.replace(/{firstName}/g, formData.firstName);
        notifHtml = notifHtml.replace(/{lastName}/g, formData.lastName);
        notifHtml = notifHtml.replace(/{email}/g, formData.email);
        notifHtml = notifHtml.replace(/{phone}/g, formData.phone || 'Not provided');
        notifHtml = notifHtml.replace(/{newsletter}/g, formData.joinNewsletter ? 'Yes' : 'No');
        notifHtml = notifHtml.replace(/{message}/g, formData.message.replace(/\n/g, '<br>'));
        notifHtml = notifHtml.replace(/{submittedAt}/g, submittedAt);

        const notificationResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: `${notifFromName} <${notifFromEmail}>`,
            reply_to: notifReplyTo,
            to: "contact@inneredge.co",
            subject: notifSubject,
            html: notifHtml,
          }),
        });

        if (notificationResponse.ok) {
          notificationEmailSuccess = true;
          console.log("Notification email sent successfully");
        } else {
          const errorText = await notificationResponse.text();
          errors.push(`Notification email failed: ${notificationResponse.status} - ${errorText}`);
          console.error("Notification email error:", errorText);
        }
      } catch (error) {
        errors.push(`Notification email error: ${error.message}`);
        console.error("Notification email error:", error);
      }
    } else {
      errors.push("Resend API key not configured");
      console.warn("RESEND_API_KEY not set");
    }

    return new Response(
      JSON.stringify({
        success: true,
        webhookSuccess,
        confirmationEmailSuccess,
        notificationEmailSuccess,
        errors: errors.length > 0 ? errors : undefined,
        message: "Form submission received",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing form submission:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});