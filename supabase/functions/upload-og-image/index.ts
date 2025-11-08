import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3@3.922.0";

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
    console.log("=== OG IMAGE UPLOAD STARTED ===");

    const formData = await req.formData();
    const imageFile = formData.get("image") as File;
    const filename = formData.get("filename") as string;

    if (!imageFile) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No image file provided",
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

    if (!filename) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No filename provided",
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

    console.log("Image file:", imageFile.name, imageFile.type, imageFile.size, "bytes");
    console.log("Target filename:", filename);

    const endpoint = Deno.env.get("R2_ENDPOINT");
    const accessKeyId = Deno.env.get("R2_ACCESS_KEY_ID");
    const secretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY");
    const bucketName = Deno.env.get("R2_BUCKET_NAME");
    const publicUrl = Deno.env.get("R2_PUBLIC_URL");

    if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
      console.error("Missing R2 configuration:");
      console.error("R2_ENDPOINT:", endpoint || "MISSING");
      console.error("R2_ACCESS_KEY_ID:", accessKeyId ? "SET" : "MISSING");
      console.error("R2_SECRET_ACCESS_KEY:", secretAccessKey ? "SET" : "MISSING");
      console.error("R2_BUCKET_NAME:", bucketName || "MISSING");
      console.error("R2_PUBLIC_URL:", publicUrl || "MISSING");

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

    console.log("R2 Configuration loaded:");
    console.log("- Bucket Name:", bucketName);
    console.log("- Public URL:", publicUrl);
    console.log("- Endpoint:", endpoint);

    console.log("=== Step 1: Uploading Image to R2 ===");

    const s3Client = new S3Client({
      endpoint,
      region: "auto",
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const uploadPath = `og-images/${filename}`;

    console.log("=== Upload Configuration ===");
    console.log("Bucket parameter:", bucketName);
    console.log("Key parameter:", uploadPath);
    console.log("Filename:", filename);

    const fileBuffer = await imageFile.arrayBuffer();

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uploadPath,
      Body: new Uint8Array(fileBuffer),
      ContentType: imageFile.type,
    });

    console.log("Sending upload command to R2...");
    await s3Client.send(command);

    const imageUrl = `${publicUrl}/${uploadPath}`;
    console.log("=== Upload Success ===");
    console.log("R2 storage path:", uploadPath);
    console.log("Public URL:", imageUrl);

    return new Response(
      JSON.stringify({
        success: true,
        url: imageUrl,
        filename: filename,
        path: uploadPath,
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
    console.error("Error uploading OG image:", error);

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
