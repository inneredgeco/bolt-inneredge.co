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

    const webhookPayload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      facebook: formData.facebook,
      instagram: formData.instagram,
      profession: formData.profession,
      why_guest: formData.why_guest,
      exercise: formData.exercise,
      submitted_at: submittedAt,
    };

    let webhookSuccess = false;
    let emailSuccess = false;
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
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "noreply@send.inneredge.co",
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

        if (emailResponse.ok) {
          emailSuccess = true;
          console.log("Confirmation email sent successfully");
        } else {
          const errorText = await emailResponse.text();
          errors.push(`Email failed: ${emailResponse.status} - ${errorText}`);
          console.error("Email error:", errorText);
        }
      } catch (error) {
        errors.push(`Email error: ${error.message}`);
        console.error("Email error:", error);
      }
    } else {
      errors.push("Resend API key not configured");
      console.warn("RESEND_API_KEY not set");
    }

    return new Response(
      JSON.stringify({
        success: true,
        webhookSuccess,
        emailSuccess,
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