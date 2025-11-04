import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3@3.922.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GuestOnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  website: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  profession: string;
  shortBio: string;
  longBio: string;
}

function normalizeUrl(url: string): string {
  if (!url) return url;
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function formatSocialUrl(value: string, platform: 'facebook' | 'instagram'): string {
  if (!value || !value.trim()) return '';

  let formatted = value.trim();
  formatted = formatted.replace(/^@/, '');

  if (!formatted.startsWith('http')) {
    const domain = platform === 'facebook' ? 'facebook.com' : 'instagram.com';
    formatted = formatted.replace(new RegExp(`^(www\\.)?${domain}\\/`), '');
    formatted = `https://www.${domain}/${formatted}`;
  }

  return formatted;
}

function formatLinkedInUrl(value: string): string {
  if (!value || !value.trim()) return '';

  let formatted = value.trim();

  if (formatted.startsWith('http://') || formatted.startsWith('https://')) {
    return formatted;
  }

  if (formatted.includes('/company/')) {
    const companyName = formatted.split('/company/')[1] || formatted.split('/company/')[0];
    return `https://www.linkedin.com/company/${companyName}`;
  }

  if (formatted.includes('/in/')) {
    const profileName = formatted.split('/in/')[1] || formatted.split('/in/')[0];
    return `https://www.linkedin.com/in/${profileName}`;
  }

  if (formatted.includes('linkedin.com/')) {
    formatted = formatted.replace(new RegExp(`^(www\\.)?linkedin\\.com\\/`), '');
    return `https://www.linkedin.com/in/${formatted}`;
  }

  return `https://www.linkedin.com/in/${formatted}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const formData = await req.formData();

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const website = formData.get('website') as string;
    const facebook = formData.get('facebook') as string;
    const instagram = formData.get('instagram') as string;
    const linkedin = formData.get('linkedin') as string;
    const profession = formData.get('profession') as string;
    const shortBio = formData.get('shortBio') as string;
    const longBio = formData.get('longBio') as string;
    const headshotFile = formData.get('headshot') as File;

    if (!firstName || !lastName || !email || !phone || !profession || !shortBio || !headshotFile) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields",
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

    const bucketName = Deno.env.get("R2_GUESTS_BUCKET_NAME");
    const endpoint = Deno.env.get("R2_GUESTS_ENDPOINT");
    const accessKeyId = Deno.env.get("R2_GUESTS_ACCESS_KEY_ID");
    const secretAccessKey = Deno.env.get("R2_GUESTS_SECRET_ACCESS_KEY");
    const publicUrl = Deno.env.get("R2_GUESTS_PUBLIC_URL");
    const webhookUrl = Deno.env.get("PABBLY_WEBHOOK_URL_GUEST_ONBOARDING");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!bucketName || !endpoint || !accessKeyId || !secretAccessKey || !publicUrl) {
      console.error("Missing R2 configuration");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Server configuration error",
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

    console.log("=== Step 1: Uploading Photo to R2 ===");

    const s3Client = new S3Client({
      region: "auto",
      endpoint: endpoint,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });

    const timestamp = Date.now();
    const filename = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${timestamp}.jpg`;

    const fileBuffer = await headshotFile.arrayBuffer();

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: `headshots/${filename}`,
      Body: new Uint8Array(fileBuffer),
      ContentType: headshotFile.type,
    });

    await s3Client.send(command);

    const photoUrl = `${publicUrl}/headshots/${filename}`;
    console.log("Photo uploaded successfully:", photoUrl);

    console.log("=== Step 2: Generating Slug ===");
    const slug = `${firstName}-${lastName}`
      .toLowerCase()
      .replace(/[^a-z0-9\\s-]/g, '')
      .replace(/\\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    console.log("=== Step 3: Sending to Pabbly Webhook ===");

    const errors: string[] = [];
    let webhookSuccess = false;
    let confirmationEmailSuccess = false;
    let notificationEmailSuccess = false;

    if (webhookUrl) {
      try {
        const webhookPayload = {
          name: `${firstName} ${lastName}`,
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          website: normalizeUrl(website),
          facebook: formatSocialUrl(facebook, 'facebook'),
          instagram: formatSocialUrl(instagram, 'instagram'),
          linkedin: formatLinkedInUrl(linkedin),
          profession: profession,
          status: "Draft",
          slug: slug,
          photo_url: photoUrl,
          short_bio: shortBio,
          long_bio: longBio || '',
          submitted_at: new Date().toISOString(),
        };

        const webhookResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
      console.warn("PABBLY_WEBHOOK_URL_GUEST_ONBOARDING not set");
    }

    console.log("=== Step 4: Sending Confirmation Emails ===");

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
            reply_to: "Inner Edge Podcast <podcast@send.inneredge.co>",
            to: email,
            subject: "Profile Received - Inner Edge Podcast",
            html: `
              <p>Hi ${firstName},</p>
              <p>Thank you for completing your guest profile! We've received all your information and your headshot looks great.</p>
              <p>We'll be in touch soon with recording details and episode scheduling.</p>
              <p>Looking forward to our conversation,<br>The Inner Edge Team</p>
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
            subject: `Guest Profile Completed - ${firstName} ${lastName}`,
            html: `
              <p><strong>Guest profile completed:</strong></p>
              <p><strong>NAME:</strong> ${firstName} ${lastName}<br>
              <strong>EMAIL:</strong> ${email}<br>
              <strong>PHONE:</strong> ${phone}<br>
              <strong>PROFESSION:</strong> ${profession}</p>
              <p><strong>SHORT BIO:</strong><br>${shortBio.replace(/\\n/g, '<br>')}</p>
              ${longBio ? `<p><strong>LONG BIO:</strong><br>${longBio.replace(/\\n/g, '<br>')}</p>` : ''}
              <p><strong>PHOTO:</strong> <a href="${photoUrl}">${photoUrl}</a></p>
              <p><strong>SOCIAL LINKS:</strong><br>
              Website: ${website ? `<a href="${normalizeUrl(website)}">${normalizeUrl(website)}</a>` : 'Not provided'}<br>
              Facebook: ${facebook ? `<a href="${formatSocialUrl(facebook, 'facebook')}">${formatSocialUrl(facebook, 'facebook')}</a>` : 'Not provided'}<br>
              Instagram: ${instagram ? `<a href="${formatSocialUrl(instagram, 'instagram')}">${formatSocialUrl(instagram, 'instagram')}</a>` : 'Not provided'}<br>
              LinkedIn: ${linkedin ? `<a href="${formatLinkedInUrl(linkedin)}">${formatLinkedInUrl(linkedin)}</a>` : 'Not provided'}</p>
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
      console.warn("RESEND_API_KEY not set");
    }

    console.log("=== Form Submitted Successfully ===");

    return new Response(
      JSON.stringify({
        success: true,
        webhookSuccess,
        confirmationEmailSuccess,
        notificationEmailSuccess,
        photoUrl,
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
    console.error("Error processing form submission:", error);

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