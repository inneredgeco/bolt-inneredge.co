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
    const flodeskSegmentId = Deno.env.get("FLODESK_VISION_BUILDER_SEGMENT_ID") || "690b95e1446cc061a40e38e9";
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

    if (flodeskApiKey) {
      try {
        console.log("Adding to Flodesk - Step 1: Create/Update Subscriber");

        const subscriberResponse = await fetch(
          "https://api.flodesk.com/v1/subscribers",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Basic " + btoa(flodeskApiKey + ":"),
            },
            body: JSON.stringify({
              first_name: formData.name.split(' ')[0],
              last_name: formData.name.split(' ').slice(1).join(' ') || '',
              email: formData.email,
              double_optin: true,
            }),
          }
        );

        if (!subscriberResponse.ok) {
          const errorText = await subscriberResponse.text();
          console.error("Failed to create/update Flodesk subscriber:", errorText);
        } else {
          const subscriber = await subscriberResponse.json();
          const subscriberId = subscriber.id;
          console.log("Subscriber created/updated successfully:", subscriberId);

          console.log("Adding to Flodesk - Step 2: Add to Vision Builder Segment");
          const segmentResponse = await fetch(
            `https://api.flodesk.com/v1/segments/${flodeskSegmentId}/subscribers`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + btoa(flodeskApiKey + ":"),
              },
              body: JSON.stringify({
                subscriber_id: subscriberId,
              }),
            }
          );

          if (!segmentResponse.ok) {
            const errorText = await segmentResponse.text();
            console.error("Failed to add subscriber to Vision Builder segment:", errorText);
          } else {
            console.log("Successfully added to Vision Builder Flodesk segment");
          }
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

              <p>Your vision builder is ready and waiting for you. Complete it at your own pace - your progress is automatically saved as you go.</p>

              <p style="margin: 20px 0;">
                <a href="${baseUrl}/vision-builder" style="background-color: #2d7471; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Start Building Your Vision</a>
              </p>

              <p>Take your time with each step. There's no rush - come back whenever inspiration strikes and pick up right where you left off.</p>

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