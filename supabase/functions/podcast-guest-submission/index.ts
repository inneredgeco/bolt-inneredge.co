import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PodcastGuestSubmission {
  name: string;
  email: string;
  phone: string;
  website: string;
  facebook: string;
  instagram: string;
  profession: string;
  why_guest: string;
  exercise: string;
}

function formatSocialUrl(input: string, platform: 'facebook' | 'instagram'): string {
  if (!input || input.trim() === '') {
    return 'Not provided';
  }

  const trimmed = input.trim();
  const baseUrl = platform === 'facebook' ? 'https://www.facebook.com/' : 'https://www.instagram.com/';
  
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  if (trimmed.startsWith('@')) {
    return baseUrl + trimmed.substring(1);
  }
  
  if (platform === 'facebook') {
    if (trimmed.includes('facebook.com/')) {
      return trimmed.startsWith('www.') ? 'https://' + trimmed : 'https://www.' + trimmed;
    }
  } else {
    if (trimmed.includes('instagram.com/')) {
      return trimmed.startsWith('www.') ? 'https://' + trimmed : 'https://www.' + trimmed;
    }
  }
  
  return baseUrl + trimmed;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const formData: PodcastGuestSubmission = await req.json();

    const webhookUrl = Deno.env.get("PABBLY_WEBHOOK_URL");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const submittedAt = new Date().toISOString();

    const webhookPayload: Record<string, string> = {};
    webhookPayload.name = formData.name || '';
    webhookPayload.email = formData.email || '';
    webhookPayload.phone = formData.phone || '';
    webhookPayload.website = formData.website || '';
    webhookPayload.facebook = formData.facebook || '';
    webhookPayload.instagram = formData.instagram || '';
    webhookPayload.profession = formData.profession || '';
    webhookPayload.why_guest = formData.why_guest || '';
    webhookPayload.exercise = formData.exercise || '';
    webhookPayload.submitted_at = submittedAt;

    console.log('Webhook payload order:', Object.keys(webhookPayload));
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
      console.warn("PABBLY_WEBHOOK_URL not set");
    }

    if (resendApiKey) {
      try {
        const confirmationResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Inner Edge Podcast <podcast@send.inneredge.co>",
            reply_to: "Inner Edge Podcast <podcast@inneredge.co>",
            to: formData.email,
            subject: "Thanks for Your Podcast Guest Application!",
            html: `
              <p>Hi ${formData.name},</p>
              
              <p>Thank you for your interest in being a guest on the Inner Edge Podcast! We've received your application and are excited to learn more about your work.</p>
              
              <p>We'll review your submission and get back to you within 3-5 business days.</p>
              
              <p>In the meantime, feel free to explore our podcast episodes at <a href="https://inneredge.co/podcast">inneredge.co/podcast</a>.</p>
              
              <p>Looking forward to connecting,<br>
              Inner Edge</p>
            `,
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
        const facebookUrl = formatSocialUrl(formData.facebook, 'facebook');
        const instagramUrl = formatSocialUrl(formData.instagram, 'instagram');

        const notificationResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Inner Edge Podcast <podcast@send.inneredge.co>",
            to: "podcast@inneredge.co",
            subject: `New Podcast Guest Application - ${formData.name}`,
            html: `
              <p>New podcast guest application received:</p>
              
              <p><strong>NAME:</strong> ${formData.name}<br>
              <strong>EMAIL:</strong> ${formData.email}<br>
              <strong>PHONE:</strong> ${formData.phone}<br>
              <strong>WEBSITE:</strong> <a href="${formData.website}">${formData.website}</a><br>
              <strong>FACEBOOK:</strong> ${facebookUrl !== 'Not provided' ? `<a href="${facebookUrl}">${facebookUrl}</a>` : facebookUrl}<br>
              <strong>INSTAGRAM:</strong> ${instagramUrl !== 'Not provided' ? `<a href="${instagramUrl}">${instagramUrl}</a>` : instagramUrl}</p>
              
              <p><strong>PROFESSION:</strong><br>
              ${formData.profession.replace(/\n/g, '<br>')}</p>
              
              <p><strong>WHY THEY'D BE A GREAT GUEST:</strong><br>
              ${formData.why_guest.replace(/\n/g, '<br>')}</p>
              
              <p><strong>PRACTICAL EXERCISE THEY'D LEAD:</strong><br>
              ${formData.exercise.replace(/\n/g, '<br>')}</p>
              
              <p><strong>SUBMITTED AT:</strong> ${submittedAt}</p>
              
              <hr>
            `,
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