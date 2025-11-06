import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface FlodeskRequest {
  name: string;
  email: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log("=== ADD TO FLODESK VISION SEGMENT ===");

    const { name, email }: FlodeskRequest = await req.json();
    console.log("Name:", name);
    console.log("Email:", email);

    const flodeskApiKey = Deno.env.get("FLODESK_API_KEY");
    const flodeskSegmentId = Deno.env.get("FLODESK_VISION_BUILDER_SEGMENT_ID");

    if (!flodeskApiKey) {
      console.error("FLODESK_API_KEY not configured");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Flodesk not configured",
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

    if (!flodeskSegmentId) {
      console.error("FLODESK_VISION_BUILDER_SEGMENT_ID not configured");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Vision Builder segment not configured",
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

    console.log("Creating subscriber and adding to segment in single call");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Segment ID:", flodeskSegmentId);

    const subscriberResponse = await fetch(
      "https://api.flodesk.com/v1/subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic " + btoa(flodeskApiKey + ":"),
        },
        body: JSON.stringify({
          first_name: name.split(' ')[0],
          last_name: name.split(' ').slice(1).join(' ') || '',
          email: email,
          double_optin: true,
          segment_ids: [flodeskSegmentId],
        }),
      }
    );

    console.log("Subscriber API response status:", subscriberResponse.status);

    if (!subscriberResponse.ok) {
      const errorText = await subscriberResponse.text();
      console.log("Subscriber API error response:", errorText);

      try {
        const errorJson = JSON.parse(errorText);
        console.log("Parsed error:", errorJson);
      } catch (e) {
        console.log("Could not parse error as JSON");
      }

      console.error("Failed to create/update subscriber in Flodesk");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to create subscriber and add to segment",
          details: errorText,
          status: subscriberResponse.status,
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

    const subscriber = await subscriberResponse.json();
    console.log("✓ Subscriber created/updated and added to segment successfully");
    console.log("Subscriber data:", subscriber);
    console.log("=== FLODESK INTEGRATION COMPLETE ===");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully added to Flodesk Vision Builder segment",
        data: subscriber,
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
    console.error("=== ERROR IN FLODESK INTEGRATION ===");
    console.error("Error:", error);

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