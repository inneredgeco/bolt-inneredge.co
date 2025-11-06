import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { sendTemplatedEmail } from "./emailHelpers.ts";

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
Write a compelling 400-600 word story in first person present tense set in ${futureFormatted}.

IMPORTANT: When writing dates, ONLY use month and year format (e.g., "${futureFormatted}"). NEVER include specific days, times, or timestamps.

Structure:
- Opening: Set the scene with the month/year (${futureFormatted}) and initial feeling
- Being: Weave their being words into who they've become
- Doing: Integrate their actions as natural daily practices
- Having: Include their outcomes as experienced reality
- Why: Reference their stated importance emotionally
- Closing: Gratitude and reflection on the journey

Make it vivid, specific, and emotionally powerful. Use sensory details.

DOCUMENT 2 - 12-MONTH ACTION PLAN:
Create a REALISTIC and ACHIEVABLE chronological 12-month plan starting from TODAY (${todayFormatted}) and moving forward to the vision date (${futureFormatted}).

CRITICAL: Month 1 is the STARTING POINT (current month), Month 12 is the END GOAL (vision achievement).
Work FORWARD from where they are now to where they want to be.

IMPORTANT PRINCIPLES FOR REALISTIC ACTION PLANS:

1. START SMALL - Month 1 should have the EASIEST, most foundational actions
   - Focus on clarity, planning, and small first steps
   - No overwhelming tasks or large commitments
   - Build confidence with achievable wins

2. GRADUAL PROGRESSION - Each month builds naturally on the previous
   - Increase complexity slowly
   - Don't jump from 0 to 100
   - Respect learning curves and capacity
   - Month 2-3 should still be building foundations
   - Month 4-6 is early execution and learning
   - Month 7-9 is building momentum
   - Month 10-12 is optimization and achievement

3. REALISTIC TIMEFRAMES - Consider actual human capacity
   - Account for learning new skills (takes weeks/months, not days)
   - Allow time for systems to be built
   - Don't overload weekly breakdowns
   - Remember people have other life responsibilities
   - Building habits takes 2-3 months minimum

4. BALANCED WORKLOAD - Weekly actions should be doable
   - 2-4 actionable items per week maximum
   - Mix of big and small tasks
   - Include rest and reflection time
   - Build in buffer for life happening

5. CONTEXT-AWARE SCALING:
   - If starting from zero (like new business, podcast, fitness routine): Start with foundation work, not production
   - If building on existing (like current job, established routine): Focus on optimization and growth
   - Match intensity to their current reality and resources
   - Consider their current reality description to gauge starting point

MONTH 1 GUIDANCE - THE FOUNDATION MONTH:
Month 1 should focus ONLY on:
- Clarity and vision setting
- Planning and research
- Small foundational actions (not big outputs)
- Building basic systems and routines
- 1-2 simple, achievable outputs maximum
- Getting comfortable with the basics

EXAMPLES OF REALISTIC MONTH 1 PROGRESSION:

For someone starting a podcast:
✓ GOOD: Week 1: Research formats, Week 2: Buy equipment, Week 3: Practice recording, Week 4: Record first episode
✗ BAD: Week 4: Batch record 4 episodes (assumes mastery too quickly)

For someone starting fitness:
✓ GOOD: Week 1: Assessment and goal setting, Week 2: 2-3 workouts, Week 3: Build to 3-4 workouts, Week 4: Establish routine
✗ BAD: Week 1: Train 5 days/week (too aggressive for beginners)

For someone starting a business:
✓ GOOD: Week 1: Market research, Week 2: Define offering, Week 3: Build basic website, Week 4: Soft launch to friends
✗ BAD: Week 4: Launch marketing campaign to 1000 people (too fast)

Make the plan feel supportive and achievable, not overwhelming and intimidating.
The goal is for users to feel EXCITED and CONFIDENT, not anxious and overwhelmed.

For each month (1 through 12 in chronological order), provide:

MONTH 1: [First Steps Title]
${todayFormatted}

SMART Goal: [First actionable goal to begin transformation]

Weekly Breakdown:
- Week 1: [Specific first action]
- Week 2: [Specific action]
- Week 3: [Specific action]
- Week 4: [Specific action]

Monthly Check-in: [One reflective question to assess progress]

---

[Continue through all 12 months in order]

MONTH 12: [Achievement & Celebration Title]
${futureFormatted}

SMART Goal: [Final outcome achieved - their having outcomes realized]

Weekly Breakdown:
- Week 1: [Celebration and consolidation]
- Week 2: [Reflection and gratitude]
- Week 3: [Planning next chapter]
- Week 4: [Living the vision]

Monthly Check-in: [Reflection on full journey]

IMPORTANT: Format each month with clear separation. Use "---" between months. Include the month/year date under each month header.

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
    console.log('=== VISION GENERATION STARTED ===');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);

    const { submissionId }: GenerateVisionRequest = await req.json();
    console.log('Submission ID received:', submissionId);

    if (!submissionId) {
      console.error('ERROR: Missing submission ID');
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

    console.log('Checking environment variables...');
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");

    console.log('Supabase URL:', supabaseUrl ? 'Present' : 'MISSING');
    console.log('Supabase Service Key:', supabaseServiceKey ? 'Present' : 'MISSING');
    console.log('Anthropic API Key:', anthropicApiKey ? 'Present' : 'MISSING');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('ERROR: Database configuration missing');
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
      console.error('ERROR: Anthropic API key not configured');
      return new Response(
        JSON.stringify({
          success: false,
          error: "AI service not configured - Anthropic API key is missing",
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

    console.log('Creating Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Fetching submission from database...');
    const { data: submission, error: fetchError } = await supabase
      .from("vision_submissions")
      .select("*")
      .eq("id", submissionId)
      .single();

    if (fetchError || !submission) {
      console.error("ERROR: Failed to fetch submission");
      console.error("Fetch error:", fetchError);
      console.error("Submission data:", submission);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Submission not found",
          details: fetchError?.message || "No submission data returned",
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

    console.log('✓ Submission fetched successfully');

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

    console.log("✓ Submission data parsed successfully");
    console.log("  Name:", submissionData.name);
    console.log("  Email:", submissionData.email);
    console.log("  Area of life:", submissionData.area_of_life);
    console.log("  Being words count:", submissionData.being_words.length);
    console.log("  Doing actions count:", submissionData.doing_actions.length);
    console.log("  Having outcomes count:", submissionData.having_outcomes.length);

    console.log('Creating Claude prompt...');

    const systemPrompt = `You are a vision creation expert helping someone design their ideal future. Create an inspiring, emotionally engaging vision narrative and practical action plan based on their inputs.

Rules:
1. Write in first person present tense as if it's one year from now (use actual date)
2. CRITICAL: Format all dates as "Month Year" ONLY (e.g., "November 2026"). NEVER include day numbers, times, or timestamps
3. Be specific and vivid with sensory details
4. Make it feel real and achievable
5. Incorporate all their being words, doing actions, and having outcomes naturally
6. Connect to their stated 'why' emotionally
7. CRITICAL: Create action plan in CHRONOLOGICAL order - Month 1 is START (today), Month 12 is END (vision date)
8. Make the action plan logical and progressive, building momentum month by month
9. Break down goals into clear, actionable weekly steps
10. Use SMART goal framework for each month
11. Keep tone positive, encouraging, and empowering
12. Make them feel excited to start`;

    const userPrompt = createVisionPrompt(submissionData);
    console.log('✓ Prompt created (length:', userPrompt.length, 'chars)');

    console.log("Calling Claude API...");
    console.log("  Model: claude-sonnet-4-5-20250929");
    console.log("  Max tokens: 4000");

    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
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
      console.error("ERROR: Claude API request failed");
      console.error("  Status:", claudeResponse.status, claudeResponse.statusText);
      console.error("  Response:", errorText);

      let errorMessage = "Failed to generate vision content";

      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
      } catch (e) {
        console.error("  Could not parse error response");
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: errorMessage,
          details: `API Status: ${claudeResponse.status}`,
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

    console.log("✓ Claude API call successful");
    const claudeData = await claudeResponse.json();
    console.log("✓ Response parsed");

    if (!claudeData.content || !claudeData.content[0] || !claudeData.content[0].text) {
      console.error("ERROR: Invalid Claude response structure");
      console.error("  Response data:", JSON.stringify(claudeData));
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid response from AI service",
          details: "Response structure was unexpected",
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
    console.log("✓ Generated text extracted (length:", generatedText.length, "chars)");

    let narrative = '';
    let actionPlan = '';

    console.log('Parsing Claude response...');
    try {
      const parsed = parseClaudeResponse(generatedText);
      narrative = parsed.narrative;
      actionPlan = parsed.actionPlan;
      console.log("✓ Successfully parsed narrative and action plan");
      console.log("  Narrative length:", narrative.length, "chars");
      console.log("  Action plan length:", actionPlan.length, "chars");
    } catch (parseError) {
      console.error("ERROR: Failed to parse Claude response:", parseError);
      narrative = generatedText;
      actionPlan = "Unable to parse action plan. Please contact support.";
      console.log("  Using fallback: entire response as narrative");
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
      console.error("ERROR: Failed to save to database");
      console.error("  Update error:", updateError);
      console.error("  Submission ID:", submissionId);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to save generated vision",
          details: updateError.message || "Database update failed",
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

    console.log("✓ Vision saved to database successfully");

    console.log("Sending completion email to user...");
    const visionLink = `https://inneredge.co/vision-builder/results/${submissionId}`;
    const communityLink = "https://inneredge.co/community";

    const userEmailSent = await sendTemplatedEmail(
      supabase,
      'vision_builder_completion',
      submissionData.email,
      {
        name: submissionData.name,
        area_of_life: getAreaTitle(submissionData.area_of_life),
        vision_link: visionLink,
        community_link: communityLink,
      }
    );

    if (userEmailSent) {
      console.log("✓ Completion email sent to user");
    } else {
      console.warn("⚠ Failed to send completion email to user (non-critical)");
    }

    console.log("Sending notification to admin...");
    const adminEmail = "info@inneredge.co";
    const adminLink = "https://inneredge.co/admin/vision-analytics";
    const completedAt = new Date().toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const adminEmailSent = await sendTemplatedEmail(
      supabase,
      'vision_builder_admin_notification',
      adminEmail,
      {
        name: submissionData.name,
        email: submissionData.email,
        area_of_life: getAreaTitle(submissionData.area_of_life),
        completed_at: completedAt,
        admin_link: adminLink,
        current_reality: submissionData.current_reality || 'Not provided',
        why_important: submissionData.why_important || 'Not provided',
      }
    );

    if (adminEmailSent) {
      console.log("✓ Admin notification sent");
    } else {
      console.warn("⚠ Failed to send admin notification (non-critical)");
    }

    console.log("=== VISION GENERATION COMPLETED SUCCESSFULLY ===");
    console.log("  Submission ID:", submissionId);

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
    console.error("=== UNEXPECTED ERROR OCCURRED ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unexpected error occurred",
        errorType: error.constructor.name,
        details: "Check edge function logs for more information",
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