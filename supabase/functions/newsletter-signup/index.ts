import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface NewsletterSignupRequest {
  firstName: string;
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
    const { firstName, email }: NewsletterSignupRequest = await req.json();

    if (!firstName || !email) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "First name and email are required",
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

    const flodeskApiKey = Deno.env.get("FLODESK_API_KEY");
    const flodeskSegmentId = Deno.env.get("FLODESK_MAIN_SEGMENT_ID") || "68d46512d9763da82ebac86d";

    if (!flodeskApiKey) {
      console.error("FLODESK_API_KEY not configured");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Newsletter service not configured",
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
            first_name: firstName,
            email: email,
            double_optin: true,
          }),
        }
      );

      if (!subscriberResponse.ok) {
        const errorText = await subscriberResponse.text();
        console.error("Failed to create/update Flodesk subscriber:", errorText);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Failed to subscribe. Please try again.",
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
      const subscriberId = subscriber.id;
      console.log("Subscriber created/updated successfully:", subscriberId);

      console.log("Adding to Flodesk - Step 2: Add to Main Segment");
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
        console.error("Failed to add subscriber to Main segment:", errorText);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Failed to subscribe. Please try again.",
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

      console.log("Successfully added to Main Flodesk segment");

      return new Response(
        JSON.stringify({
          success: true,
          message: "Successfully subscribed to newsletter",
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (flodeskError) {
      console.error("Error adding to Flodesk:", flodeskError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to subscribe. Please try again.",
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
    console.error("Error processing newsletter signup:", error);

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