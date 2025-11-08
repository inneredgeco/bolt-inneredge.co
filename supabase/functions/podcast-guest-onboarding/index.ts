import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3@3.922.0";
import { createClient } from "jsr:@supabase/supabase-js@2";

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
  youtube: string;
  profession: string;
  shortBio: string;
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

function formatYouTubeUrl(value: string): string {
  if (!value || !value.trim()) return '';

  let formatted = value.trim();

  if (formatted.startsWith('http://') || formatted.startsWith('https://')) {
    return formatted;
  }

  if (formatted.startsWith('@')) {
    return `https://www.youtube.com/${formatted}`;
  }

  if (formatted.includes('youtube.com/')) {
    formatted = formatted.replace(new RegExp(`^(www\\.)?youtube\\.com\\/`), '');
    return `https://www.youtube.com/${formatted}`;
  }

  if (formatted.includes('/c/') || formatted.includes('/channel/') || formatted.includes('/@')) {
    return `https://www.youtube.com${formatted.startsWith('/') ? '' : '/'}${formatted}`;
  }

  return `https://www.youtube.com/@${formatted}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log('=== ONBOARDING FORM SUBMISSION STARTED ===');
    const formData = await req.formData();

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const website = formData.get('website') as string;
    const facebook = formData.get('facebook') as string;
    const instagram = formData.get('instagram') as string;
    const linkedin = formData.get('linkedin') as string;
    const youtube = formData.get('youtube') as string;
    const profession = formData.get('profession') as string;
    const shortBio = formData.get('shortBio') as string;
    const headshotFile = formData.get('headshot') as File;

    console.log('Form data received:', {
      firstName,
      lastName,
      email,
      phone,
      profession,
      hasPhoto: !!headshotFile,
      photoSize: headshotFile?.size,
      photoType: headshotFile?.type
    });

    if (!firstName || !lastName || !email || !phone || !profession || !shortBio || !headshotFile) {
      console.error('Missing required fields:', {
        firstName: !!firstName,
        lastName: !!lastName,
        email: !!email,
        phone: !!phone,
        profession: !!profession,
        shortBio: !!shortBio,
        headshotFile: !!headshotFile
      });
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

    const bucketName = Deno.env.get("R2_BUCKET_NAME");
    const endpoint = Deno.env.get("R2_ENDPOINT");
    const accessKeyId = Deno.env.get("R2_ACCESS_KEY_ID");
    const secretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY");
    const publicUrl = Deno.env.get("R2_PUBLIC_URL");
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
      Key: `guests/headshots/${filename}`,
      Body: new Uint8Array(fileBuffer),
      ContentType: headshotFile.type,
    });

    await s3Client.send(command);

    const photoUrl = `${publicUrl}/guests/headshots/${filename}`;
    console.log("Photo uploaded successfully:", photoUrl);

    console.log("=== Step 2: Setting up Database Connection ===");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase configuration");
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

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("=== Step 3: Generating Unique Slug ===");

    // Generate base slug from name
    const baseSlug = `${firstName}-${lastName}`
      .toLowerCase()
      .replace(/[^a-z0-9\\s-]/g, '')
      .replace(/\\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    let slug = baseSlug;
    let counter = 1;

    // Check if slug exists and generate unique one if needed
    while (true) {
      const { data: existingSlug } = await supabase
        .from('podcast_guests')
        .select('slug')
        .eq('slug', slug)
        .maybeSingle();

      if (!existingSlug) {
        // Slug is unique, use it
        console.log('Unique slug generated:', slug);
        break;
      }

      // Slug exists, try with number
      counter++;
      slug = `${baseSlug}-${counter}`;
      console.log('Slug exists, trying:', slug);
    }

    console.log("=== Step 4: Saving to Database ===");

    const fullName = `${firstName} ${lastName}`;
    const guestData = {
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      email: email,
      phone: phone,
      website_url: normalizeUrl(website),
      facebook_url: formatSocialUrl(facebook, 'facebook'),
      instagram_url: formatSocialUrl(instagram, 'instagram'),
      linkedin_url: formatLinkedInUrl(linkedin),
      guest_youtube_url: formatYouTubeUrl(youtube),
      profession: profession,
      short_bio: shortBio,
      long_bio: '',
      slug: slug,
      photo_url: photoUrl,
      status: 'Draft',
      pitch: '',
      exercise_description: '',
      episode_title: null,
      episode_date: null,
      spotify_url: null,
      apple_podcast_url: null,
      podcast_youtube_url: null,
    };

    const { data: existingGuest, error: checkError } = await supabase
      .from('podcast_guests')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking for existing guest:", checkError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Database error. Please try again.",
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

    if (existingGuest) {
      console.log("Email already registered:", email);
      return new Response(
        JSON.stringify({
          success: false,
          error: "This email is already registered. Please contact us if you need to update your profile.",
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

    const { error: insertError } = await supabase
      .from('podcast_guests')
      .insert(guestData);

    if (insertError) {
      console.error('=== DATABASE INSERT ERROR ===');
      console.error('Error details:', insertError);
      console.error('Error message:', insertError.message);
      console.error('Error code:', insertError.code);
      console.error('Error hint:', insertError.hint);
      console.error('Guest data attempted:', JSON.stringify(guestData, null, 2));
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to save your profile: ${insertError.message || 'Database error'}`,
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

    console.log("Guest saved to database successfully");

    console.log("=== Step 5: Sending to Pabbly Webhook ===");

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
          youtube: formatYouTubeUrl(youtube),
          profession: profession,
          status: "Draft",
          slug: slug,
          photo_url: photoUrl,
          short_bio: shortBio,
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

    console.log("=== Step 6: Sending Confirmation Emails ===");

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
              <p><strong>BIO:</strong><br>${shortBio.replace(/\\n/g, '<br>')}</p>
              <p><strong>PHOTO:</strong> <a href="${photoUrl}">${photoUrl}</a></p>
              <p><strong>SOCIAL LINKS:</strong><br>
              Website: ${website ? `<a href="${normalizeUrl(website)}">${normalizeUrl(website)}</a>` : 'Not provided'}<br>
              Facebook: ${facebook ? `<a href="${formatSocialUrl(facebook, 'facebook')}">${formatSocialUrl(facebook, 'facebook')}</a>` : 'Not provided'}<br>
              Instagram: ${instagram ? `<a href="${formatSocialUrl(instagram, 'instagram')}">${formatSocialUrl(instagram, 'instagram')}</a>` : 'Not provided'}<br>
              LinkedIn: ${linkedin ? `<a href="${formatLinkedInUrl(linkedin)}">${formatLinkedInUrl(linkedin)}</a>` : 'Not provided'}<br>
              YouTube: ${youtube ? `<a href="${formatYouTubeUrl(youtube)}">${formatYouTubeUrl(youtube)}</a>` : 'Not provided'}</p>
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
    console.error('=== FATAL ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    console.error('Error stack:', error.stack);
    console.error('Full error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: `Error: ${error.message || 'An unexpected error occurred'}`,
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