import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { S3Client, ListObjectsV2Command } from "npm:@aws-sdk/client-s3@3.922.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const prefix = url.searchParams.get("prefix") || "";

    const endpoint = Deno.env.get("R2_ENDPOINT");
    const accessKeyId = Deno.env.get("R2_ACCESS_KEY_ID");
    const secretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY");
    const bucketName = Deno.env.get("R2_BUCKET_NAME");
    const publicUrl = Deno.env.get("R2_PUBLIC_URL");

    if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "R2 storage not configured properly",
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

    const s3Client = new S3Client({
      endpoint,
      region: "auto",
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
    });

    const response = await s3Client.send(command);

    const images = (response.Contents || [])
      .filter((obj) => {
        const key = obj.Key || "";
        return /\.(jpg|jpeg|png|webp|gif)$/i.test(key);
      })
      .map((obj) => {
        const key = obj.Key || "";
        const filename = key.split("/").pop() || key;

        return {
          key,
          filename,
          url: `${publicUrl}/${key}`,
          size: obj.Size || 0,
          lastModified: obj.LastModified?.toISOString() || new Date().toISOString(),
        };
      })
      .sort((a, b) => {
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      });

    return new Response(
      JSON.stringify({
        success: true,
        images,
        count: images.length,
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
    console.error("Error listing R2 images:", error);

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
