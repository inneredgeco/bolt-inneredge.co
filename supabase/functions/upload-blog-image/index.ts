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
    console.log("=== BLOG IMAGE UPLOAD STARTED ===");

    const formData = await req.formData();
    const imageFile = formData.get("file") as File;

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

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(imageFile.type)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid file type. Please upload a JPG, PNG, or WebP image.",
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

    const maxSize = 5 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Image file must be less than 5MB.",
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

    const endpoint = Deno.env.get("R2_ENDPOINT");
    const accessKeyId = Deno.env.get("R2_ACCESS_KEY_ID");
    const secretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY");
    const bucketName = Deno.env.get("R2_BUCKET_NAME");
    const publicUrl = Deno.env.get("R2_PUBLIC_URL");

    if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
      console.error("Missing R2 configuration");
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

    console.log("R2 Configuration loaded");

    const timestamp = Date.now();
    const sanitizedName = imageFile.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-z0-9]+/gi, '-')
      .toLowerCase();
    const fileExtension = imageFile.name.split('.').pop();
    const filename = `${timestamp}-${sanitizedName}.${fileExtension}`;

    const s3Client = new S3Client({
      endpoint,
      region: "auto",
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const uploadPath = `blog/featured-images/${filename}`;

    console.log("Upload path:", uploadPath);

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
    console.error("Error uploading blog image:", error);

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
