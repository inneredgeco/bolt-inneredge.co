import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface VisionBuilderSubmission {
  name: string;
  email: string;
  submissionId: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const formData: VisionBuilderSubmission = await req.json();

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const flodeskApiKey = Deno.env.get("FLODESK_API_KEY");
    const baseUrl = "https://www.inneredge.co";

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Email service not configured",
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

    const resumeUrl = `${baseUrl}/vision-builder/resume/${formData.submissionId}`;

    if (flodeskApiKey) {
      try {
        const flodeskResponse = await fetch(
          "https://api.flodesk.com/v1/subscribers",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Basic " + btoa(flodeskApiKey + ":"),
            },
            body: JSON.stringify({
              first_name: formData.name,
              email: formData.email,
              segment_ids: ["VISION_BUILDER_SEGMENT_ID"],
              double_optin: true,
            }),
          }
        );

        if (!flodeskResponse.ok) {
          console.error("Failed to add to Flodesk segment:", await flodeskResponse.text());
        } else {
          console.log("Successfully added to Vision Builder Flodesk segment");
        }
      } catch (flodeskError) {
        console.error("Error adding to Flodesk:", flodeskError);
      }
    }

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
          subject: "Your Vision Journey Begins",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2d7471;">Your Vision Journey Begins</h2>
              
              <p>Hi ${formData.name},</p>

              <p>We're excited to help you create your 1-year vision! This is your chance to design the life you want in the next 12 months.</p>

              <p><strong>You can continue your vision anytime at:</strong></p>
              
              <p style="margin: 20px 0;">
                <a href="${resumeUrl}" style="background-color: #2d7471; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Continue Your Vision</a>
              </p>

              <p style="color: #666; font-size: 14px;">Or copy this link: ${resumeUrl}</p>

              <p><strong>Save this email so you can return to complete your vision whenever you're ready.</strong></p>

              <p>Your progress is automatically saved as you complete each step, so you can take your time and come back whenever inspiration strikes.</p>

              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

              <p style="color: #666; font-size: 12px;">This vision builder is designed to help you gain clarity on what matters most and create a roadmap for meaningful transformation.</p>

              <p>Looking forward to supporting your journey,<br>
              Inner Edge</p>
            </div>
          `,
        }),
      });

      if (!confirmationResponse.ok) {
        const errorText = await confirmationResponse.text();
        console.error("Confirmation email error:", errorText);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Failed to send confirmation email",
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

      console.log("Confirmation email sent successfully to:", formData.email);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Confirmation email sent successfully",
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
      console.error("Email sending error:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message || "Failed to send email",
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
  } catch (error) {
    console.error("Error processing vision builder submission:", error);

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