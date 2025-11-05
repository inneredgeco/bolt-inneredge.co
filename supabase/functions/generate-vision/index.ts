import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GenerateVisionRequest {
  submissionId: string;
}

interface VisionSubmissionData {
  id: string;
  name: string;
  email: string;
  area_of_life: string;
  current_reality: string | null;
  why_important: string | null;
  being_words: string[];
  doing_actions: string[];
  having_outcomes: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { submissionId }: GenerateVisionRequest = await req.json();

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
    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");

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

    if (!anthropicApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "AI service not configured",
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

    const submissionData: VisionSubmissionData = {
      id: submission.id,
      name: submission.name,
      email: submission.email,
      area_of_life: submission.area_of_life,
      current_reality: submission.current_reality,
      why_important: submission.why_important,
      being_words: submission.being_words || [],
      doing_actions: submission.doing_actions || [],
      having_outcomes: submission.having_outcomes || [],
    };

    console.log("Fetched submission data for:", submissionData.name);
    console.log("Area of life:", submissionData.area_of_life);
    console.log("Being words count:", submissionData.being_words.length);
    console.log("Doing actions count:", submissionData.doing_actions.length);
    console.log("Having outcomes count:", submissionData.having_outcomes.length);

    // TODO: Call Claude API to generate vision narrative and action plan
    // This will be implemented in Part 2

    // For now, return a placeholder response
    const generatedVision = {
      narrative: "Your vision narrative will be generated here...",
      actionPlan: "Your action plan will be generated here...",
    };

    // TODO: Save generated content to database
    // This will be implemented in Part 2

    console.log("Vision generation completed for submission:", submissionId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Vision generated successfully",
        data: generatedVision,
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
    console.error("Error generating vision:", error);

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
