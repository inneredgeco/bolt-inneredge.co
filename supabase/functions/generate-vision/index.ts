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

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function createVisionPrompt(data: VisionSubmissionData): string {
  const today = new Date();
  const oneYearFromNow = new Date(today);
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  const todayFormatted = formatDate(today);
  const futureFormatted = formatDate(oneYearFromNow);

  const beingWordsList = data.being_words.join(', ');
  const doingActionsList = data.doing_actions.map(action => `- ${action}`).join('\n');
  const havingOutcomesList = data.having_outcomes.map(outcome => `- ${outcome}`).join('\n');

  let prompt = `Create a personalized 1-year vision for ${data.name} focused on ${getAreaTitle(data.area_of_life)}.

Current Date: ${todayFormatted}
Vision Date: ${futureFormatted}

Being Words (who they're becoming): ${beingWordsList}

Doing Actions (what they're doing):
${doingActionsList}

Having Outcomes (what they have):
${havingOutcomesList}
`;

  if (data.current_reality) {
    prompt += `\nCurrent Reality: ${data.current_reality}`;
  }

  if (data.why_important) {
    prompt += `\nWhy This Matters: ${data.why_important}`;
  }

  prompt += `

Generate TWO documents:

DOCUMENT 1 - VISION NARRATIVE:
Write a compelling 400-600 word story in first person present tense set on ${futureFormatted}.

Structure:
- Opening: Set the scene with date, time, and initial feeling
- Being: Weave their being words into who they've become
- Doing: Integrate their actions as natural daily practices
- Having: Include their outcomes as experienced reality
- Why: Reference their stated importance emotionally
- Closing: Gratitude and reflection on the journey

Make it vivid, specific, and emotionally powerful. Use sensory details.

DOCUMENT 2 - 12-MONTH ACTION PLAN:
Create a reverse-engineered plan working backwards from their having outcomes to present day.

For each month (12 down to 1), provide:

MONTH [X]: [Inspiring Month Title]
SMART Goal: [Specific, Measurable, Achievable, Relevant, Time-bound goal for this month]

Weekly Breakdown:
- Week 1: [Specific action]
- Week 2: [Specific action]
- Week 3: [Specific action]
- Week 4: [Specific action]

Monthly Check-in: [One reflective question to assess progress]

Make Month 12 the achievement of their vision, Month 1 the first small steps.

Format both documents clearly separated with "=== DOCUMENT 1: VISION NARRATIVE ===" and "=== DOCUMENT 2: 12-MONTH ACTION PLAN ===" headers.`;

  return prompt;
}

function parseClaudeResponse(responseText: string): { narrative: string; actionPlan: string } {
  const doc1Marker = '=== DOCUMENT 1: VISION NARRATIVE ===';
  const doc2Marker = '=== DOCUMENT 2: 12-MONTH ACTION PLAN ===';

  let narrative = '';
  let actionPlan = '';

  const doc1Index = responseText.indexOf(doc1Marker);
  const doc2Index = responseText.indexOf(doc2Marker);

  if (doc1Index !== -1 && doc2Index !== -1) {
    narrative = responseText.substring(doc1Index + doc1Marker.length, doc2Index).trim();
    actionPlan = responseText.substring(doc2Index + doc2Marker.length).trim();
  } else {
    const parts = responseText.split(/DOCUMENT 2|12-MONTH ACTION PLAN/i);
    if (parts.length >= 2) {
      narrative = parts[0].replace(/DOCUMENT 1|VISION NARRATIVE/gi, '').trim();
      actionPlan = parts[1].trim();
    } else {
      const halfwayPoint = Math.floor(responseText.length / 2);
      narrative = responseText.substring(0, halfwayPoint).trim();
      actionPlan = responseText.substring(halfwayPoint).trim();
    }
  }

  return { narrative, actionPlan };
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

    const systemPrompt = `You are a vision creation expert helping someone design their ideal future. Create an inspiring, emotionally engaging vision narrative and practical action plan based on their inputs.

Rules:
1. Write in first person present tense as if it's one year from now (use actual date)
2. Be specific and vivid with sensory details
3. Make it feel real and achievable
4. Incorporate all their being words, doing actions, and having outcomes naturally
5. Connect to their stated 'why' emotionally
6. Make the action plan logical and progressive
7. Break down goals into clear, actionable weekly steps
8. Use SMART goal framework for each month
9. Keep tone positive, encouraging, and empowering
10. Make them feel excited to start`;

    const userPrompt = createVisionPrompt(submissionData);

    console.log("Calling Claude API...");

    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4000,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error("Claude API error:", errorText);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to generate vision content",
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

    const claudeData = await claudeResponse.json();
    console.log("Claude API response received");

    if (!claudeData.content || !claudeData.content[0] || !claudeData.content[0].text) {
      console.error("Invalid Claude response structure:", claudeData);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid response from AI service",
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

    const generatedText = claudeData.content[0].text;
    console.log("Generated text length:", generatedText.length);

    let narrative = '';
    let actionPlan = '';

    try {
      const parsed = parseClaudeResponse(generatedText);
      narrative = parsed.narrative;
      actionPlan = parsed.actionPlan;
      console.log("Successfully parsed narrative and action plan");
    } catch (parseError) {
      console.error("Error parsing Claude response:", parseError);
      narrative = generatedText;
      actionPlan = "Unable to parse action plan. Please contact support.";
    }

    console.log("Saving to database...");

    const { error: updateError } = await supabase
      .from("vision_submissions")
      .update({
        vision_narrative: narrative,
        action_plan: actionPlan,
        status: "completed",
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", submissionId);

    if (updateError) {
      console.error("Error saving to database:", updateError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to save generated vision",
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

    console.log("Vision generation completed successfully for submission:", submissionId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Vision generated successfully",
        vision_narrative: narrative,
        action_plan: actionPlan,
        submission_id: submissionId,
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
