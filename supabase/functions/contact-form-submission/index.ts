import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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

    if (resendApiKey) {
      try {
        const confirmationResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Inner Edge <contact@send.inneredge.co>",
            reply_to: "Inner Edge <contact@inneredge.co>",
            to: formData.email,
            subject: "Thanks for Reaching Out!",
            html: `
              <p>Hi ${formData.firstName},</p>

              <p>Thank you for contacting Inner Edge. We've received your message and will get back to you within 1-2 business days.</p>

              <p>In the meantime, feel free to explore our podcast at <a href="https://inneredge.co/podcast">inneredge.co/podcast</a> or learn more about our men's community.</p>

              <p>Looking forward to connecting,<br>
              The Inner Edge Team</p>
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
        const notificationResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Inner Edge <contact@send.inneredge.co>",
            to: "contact@inneredge.co",
            subject: `New Contact Form Submission - ${formData.firstName} ${formData.lastName}`,
            html: `
              <p>New contact form submission:</p>

              <p><strong>NAME:</strong> ${formData.firstName} ${formData.lastName}<br>
              <strong>EMAIL:</strong> ${formData.email}<br>
              <strong>PHONE:</strong> ${formData.phone || 'Not provided'}<br>
              <strong>NEWSLETTER:</strong> ${formData.joinNewsletter ? 'Yes' : 'No'}</p>

              <p><strong>MESSAGE:</strong><br>
              ${formData.message.replace(/\n/g, '<br>')}</p>

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