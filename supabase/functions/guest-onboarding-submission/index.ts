import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3@3.621.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GuestOnboardingSubmission {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  profession: string;
  shortBio: string;
  longBio?: string;
  photoFile: string;
  photoFileName: string;
  photoFileType: string;
}

function generateSlug(firstName: string, lastName: string): string {
  const combined = `${firstName}-${lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  return combined;
}

function formatLinkedInUrl(input: string): string {
  if (!input || input.trim() === '') {
    return '';
  }

  const trimmed = input.trim();

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  if (trimmed.includes('/company/')) {
    const companyName = trimmed.split('/company/')[1] || trimmed.split('/company/')[0];
    return `https://www.linkedin.com/company/${companyName}`;
  }

  if (trimmed.includes('/in/')) {
    const profileName = trimmed.split('/in/')[1] || trimmed.split('/in/')[0];
    return `https://www.linkedin.com/in/${profileName}`;
  }

  if (trimmed.includes('linkedin.com/')) {
    return trimmed.startsWith('www.') ? 'https://' + trimmed : 'https://www.' + trimmed;
  }

  return `https://www.linkedin.com/in/${trimmed}`;
}

async function uploadToR2(
  fileData: Uint8Array,
  fileName: string,
  contentType: string
): Promise<string> {
  const accessKeyId = Deno.env.get("VITE_R2_GUESTS_ACCESS_KEY_ID");
  const secretAccessKey = Deno.env.get("VITE_R2_GUESTS_SECRET_ACCESS_KEY");
  const endpoint = Deno.env.get("VITE_R2_GUESTS_ENDPOINT");
  const bucketName = Deno.env.get("VITE_R2_GUESTS_BUCKET_NAME");
  const publicUrl = Deno.env.get("VITE_R2_GUESTS_PUBLIC_URL");

  if (!accessKeyId || !secretAccessKey || !endpoint || !bucketName || !publicUrl) {
    throw new Error("R2 credentials not configured");
  }

  const s3Client = new S3Client({
    region: "auto",
    endpoint: endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const key = `headshots/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileData,
    ContentType: contentType,
  });

  await s3Client.send(command);

  return `${publicUrl}/headshots/${fileName}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log("=== EDGE FUNCTION: Request Received ===");
    console.log("Method:", req.method);
    console.log("URL:", req.url);

    const formData: GuestOnboardingSubmission = await req.json();
    console.log("=== EDGE FUNCTION: Form Data Received ===");
    console.log("Name:", formData.firstName, formData.lastName);
    console.log("Email:", formData.email);

    console.log("=== EDGE FUNCTION: Environment Variables Check ===");
    const webhookUrl = Deno.env.get("VITE_PABBLY_WEBHOOK_URL_GUEST_ONBOARDING");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const r2AccessKeyId = Deno.env.get("VITE_R2_GUESTS_ACCESS_KEY_ID");
    const r2SecretAccessKey = Deno.env.get("VITE_R2_GUESTS_SECRET_ACCESS_KEY");
    const r2Endpoint = Deno.env.get("VITE_R2_GUESTS_ENDPOINT");
    const r2BucketName = Deno.env.get("VITE_R2_GUESTS_BUCKET_NAME");
    const r2PublicUrl = Deno.env.get("VITE_R2_GUESTS_PUBLIC_URL");

    console.log("Webhook URL:", webhookUrl ? "SET" : "NOT SET");
    console.log("Resend API Key:", resendApiKey ? "SET" : "NOT SET");
    console.log("R2 Access Key ID:", r2AccessKeyId ? "SET" : "NOT SET");
    console.log("R2 Secret Access Key:", r2SecretAccessKey ? "SET" : "NOT SET");
    console.log("R2 Endpoint:", r2Endpoint || "NOT SET");
    console.log("R2 Bucket Name:", r2BucketName || "NOT SET");
    console.log("R2 Public URL:", r2PublicUrl || "NOT SET");

    const submittedAt = new Date().toISOString();
    const slug = generateSlug(formData.firstName, formData.lastName);

    console.log("=== EDGE FUNCTION: Processing Photo ===");
    const photoBuffer = Uint8Array.from(atob(formData.photoFile), c => c.charCodeAt(0));
    console.log("Photo buffer size:", photoBuffer.length, "bytes");
    const timestamp = Date.now();
    const photoFileName = `${formData.firstName.toLowerCase()}-${formData.lastName.toLowerCase()}-${timestamp}.jpg`;
    console.log("Photo filename:", photoFileName);

    let photoUrl = '';
    try {
      console.log("=== EDGE FUNCTION: Uploading to R2 ===");
      photoUrl = await uploadToR2(photoBuffer, photoFileName, formData.photoFileType);
      console.log("=== EDGE FUNCTION: R2 Upload Successful ===");
      console.log("Photo URL:", photoUrl);
    } catch (error) {
      console.error("=== EDGE FUNCTION: R2 Upload Failed ===");
      console.error("Error:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      throw new Error(`Failed to upload photo: ${error.message}`);
    }

    const linkedinUrl = formatLinkedInUrl(formData.linkedin || '');

    const webhookPayload = {
      name: `${formData.firstName} ${formData.lastName}`,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      website: formData.website || '',
      facebook: formData.facebook || '',
      instagram: formData.instagram || '',
      linkedin: linkedinUrl,
      profession: formData.profession,
      status: "Draft",
      slug: slug,
      photo_url: photoUrl,
      short_bio: formData.shortBio,
      long_bio: formData.longBio || '',
      submitted_at: submittedAt,
    };

    console.log('Webhook payload:', JSON.stringify(webhookPayload, null, 2));

    let webhookSuccess = false;
    let confirmationEmailSuccess = false;
    let notificationEmailSuccess = false;
    const errors: string[] = [];

    if (webhookUrl) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookPayload),
        });

        if (webhookResponse.ok) {
          webhookSuccess = true;
          console.log("Webhook sent successfully");
        } else {
          const errorText = await webhookResponse.text();
          errors.push(`Webhook failed: ${webhookResponse.status} - ${errorText}`);
          console.error("Webhook error:", errorText);
        }
      } catch (error) {
        errors.push(`Webhook error: ${error.message}`);
        console.error("Webhook error:", error);
      }
    } else {
      errors.push("Webhook URL not configured");
      console.warn("VITE_PABBLY_WEBHOOK_URL_GUEST_ONBOARDING not set");
    }

    if (resendApiKey) {
      try {
        const confirmationResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Inner Edge Podcast <podcast@send.inneredge.co>",
            reply_to: "Inner Edge Podcast <podcast@inneredge.co>",
            to: formData.email,
            subject: "Profile Received - Inner Edge Podcast",
            html: `
              <p>Hi ${formData.firstName},</p>

              <p>Thank you for completing your guest profile! We've received all your information and your headshot looks great.</p>

              <p>We'll be in touch soon with recording details and episode scheduling.</p>

              <p>Looking forward to our conversation,<br>
              The Inner Edge Team</p>
            `,
          }),
        });

        if (confirmationResponse.ok) {
          confirmationEmailSuccess = true;
          console.log("Confirmation email sent successfully");
        } else {
          const errorText = await confirmationResponse.text();
          errors.push(`Confirmation email failed: ${confirmationResponse.status} - ${errorText}`);
          console.error("Confirmation email error:", errorText);
        }
      } catch (error) {
        errors.push(`Confirmation email error: ${error.message}`);
        console.error("Confirmation email error:", error);
      }

      try {
        const notificationResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Inner Edge Podcast <podcast@send.inneredge.co>",
            to: "podcast@inneredge.co",
            subject: `Guest Profile Completed - ${formData.firstName} ${formData.lastName}`,
            html: `
              <p><strong>Guest profile completed:</strong></p>

              <p><strong>NAME:</strong> ${formData.firstName} ${formData.lastName}<br>
              <strong>EMAIL:</strong> ${formData.email}<br>
              <strong>PHONE:</strong> ${formData.phone}<br>
              <strong>PROFESSION:</strong> ${formData.profession}</p>

              <p><strong>SHORT BIO:</strong><br>
              ${formData.shortBio}</p>

              ${formData.longBio ? `<p><strong>LONG BIO:</strong><br>${formData.longBio.replace(/\n/g, '<br>')}</p>` : ''}

              <p><strong>PHOTO:</strong> <a href="${photoUrl}">${photoUrl}</a></p>

              <p><strong>SOCIAL LINKS:</strong><br>
              Website: ${formData.website ? `<a href="${formData.website}">${formData.website}</a>` : 'Not provided'}<br>
              Facebook: ${formData.facebook ? `<a href="${formData.facebook}">${formData.facebook}</a>` : 'Not provided'}<br>
              Instagram: ${formData.instagram ? `<a href="${formData.instagram}">${formData.instagram}</a>` : 'Not provided'}<br>
              LinkedIn: ${linkedinUrl ? `<a href="${linkedinUrl}">${linkedinUrl}</a>` : 'Not provided'}</p>
            `,
          }),
        });

        if (notificationResponse.ok) {
          notificationEmailSuccess = true;
          console.log("Notification email sent successfully");
        } else {
          const errorText = await notificationResponse.text();
          errors.push(`Notification email failed: ${notificationResponse.status} - ${errorText}`);
          console.error("Notification email error:", errorText);
        }
      } catch (error) {
        errors.push(`Notification email error: ${error.message}`);
        console.error("Notification email error:", error);
      }
    } else {
      errors.push("Resend API key not configured");
      console.warn("RESEND_API_KEY not set");
    }

    console.log("=== EDGE FUNCTION: Preparing Response ===");
    console.log("Photo URL:", photoUrl);
    console.log("Webhook Success:", webhookSuccess);
    console.log("Confirmation Email Success:", confirmationEmailSuccess);
    console.log("Notification Email Success:", notificationEmailSuccess);
    console.log("Errors:", errors);

    return new Response(
      JSON.stringify({
        success: true,
        photoUrl,
        webhookSuccess,
        confirmationEmailSuccess,
        notificationEmailSuccess,
        errors: errors.length > 0 ? errors : undefined,
        message: "Guest profile submitted successfully",
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
    console.error("=== EDGE FUNCTION: Fatal Error ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error:", error);

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
