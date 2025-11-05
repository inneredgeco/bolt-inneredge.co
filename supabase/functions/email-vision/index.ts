import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailVisionRequest {
  submissionId: string;
}

interface VisionData {
  name: string;
  email: string;
  area_of_life: string;
  vision_narrative: string;
  action_plan: string;
  created_at: string;
}

const AREA_TITLES: Record<string, string> = {
  'health-fitness': 'Health & Fitness',
  'career-business': 'Career & Business',
  'finances': 'Finances',
  'romantic-relationship': 'Romantic Relationship',
  'friendships-community': 'Friendships & Community',
  'personal-development': 'Personal Development',
  'family-relationships': 'Family Relationships',
  'spirituality': 'Spirituality',
  'fun-recreation': 'Fun & Recreation',
};

function getAreaTitle(areaId: string): string {
  return AREA_TITLES[areaId] || areaId;
}

function createEmailHTML(data: VisionData, resultsUrl: string): string {
  const areaTitle = getAreaTitle(data.area_of_life);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Vision - Inner Edge</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f5f5f4; color: #1c1917;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f4; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2d7471 0%, #1f5654 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Your Vision is Ready!</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">Hi ${data.name},</p>

              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
                Congratulations on creating your 1-year vision for <strong>${areaTitle}</strong>!
              </p>

              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
                Attached is your personalized vision package:
              </p>

              <ul style="margin: 0 0 30px; padding-left: 25px; font-size: 16px; line-height: 1.8;">
                <li><strong>Vision Narrative</strong> - Your inspiring story of who you'll become</li>
                <li><strong>12-Month Action Plan</strong> - Your step-by-step roadmap</li>
              </ul>

              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
                Review these regularly to stay connected to your vision and track your progress.
              </p>

              <!-- Tips Section -->
              <div style="background-color: #f0fdfa; border-left: 4px solid #2d7471; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h2 style="margin: 0 0 15px; font-size: 18px; color: #2d7471;">Tips for Success:</h2>
                <ul style="margin: 0; padding-left: 25px; font-size: 15px; line-height: 1.8; color: #1c1917;">
                  <li>Read your Vision Narrative daily or weekly</li>
                  <li>Post it somewhere visible</li>
                  <li>Follow your monthly action steps</li>
                  <li>Celebrate small wins along the way</li>
                  <li>Adjust as needed - your vision can evolve</li>
                </ul>
              </div>

              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
                You've taken the first step toward transformation. Now it's time to make it real.
              </p>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; font-weight: 600;">
                You've got this!
              </p>

              <p style="margin: 0 0 5px; font-size: 16px; line-height: 1.6;">
                The Inner Edge Team
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${resultsUrl}" style="display: inline-block; background-color: #2d7471; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">View Your Vision Online</a>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6; color: #78716c;">
                P.S. You can always access your vision at the link above.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f4; padding: 30px; text-align: center; border-top: 1px solid #e7e5e4;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #78716c;">
                <strong>Inner Edge</strong>
              </p>
              <p style="margin: 0; font-size: 12px; color: #a8a29e;">
                Transformational Leadership & Personal Development
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { submissionId }: EmailVisionRequest = await req.json();

    if (!submissionId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing submission ID",
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

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Database configuration error",
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

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: submission, error: fetchError } = await supabase
      .from("vision_submissions")
      .select("*")
      .eq("id", submissionId)
      .single();

    if (fetchError || !submission) {
      console.error("Error fetching submission:", fetchError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Submission not found",
        }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (submission.status !== "completed") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Vision is not yet completed",
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

    const visionData: VisionData = {
      name: submission.name,
      email: submission.email,
      area_of_life: submission.area_of_life,
      vision_narrative: submission.vision_narrative,
      action_plan: submission.action_plan,
      created_at: submission.created_at,
    };

    console.log("Preparing to send email to:", visionData.email);

    const resultsUrl = `https://inneredge.co/vision-builder/results/${submissionId}`;
    const emailHTML = createEmailHTML(visionData, resultsUrl);
    const areaTitle = getAreaTitle(visionData.area_of_life);

    const emailPayload = {
      from: "Inner Edge <vision@send.inneredge.co>",
      to: [visionData.email],
      subject: `Your ${areaTitle} Vision - Inner Edge`,
      html: emailHTML,
    };

    console.log("Sending email via Resend...");

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify(emailPayload),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend API error:", errorText);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to send email",
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

    const emailData = await emailResponse.json();
    console.log("Email sent successfully:", emailData);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
        email: visionData.email,
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
    console.error("Error sending email:", error);

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
