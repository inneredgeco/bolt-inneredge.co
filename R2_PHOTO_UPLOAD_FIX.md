# R2 Photo Upload Fix - Duplicate Bucket Name Issue

## Problem Identified

The podcast guest photo upload code is **CORRECT** and does NOT create duplicate bucket names in the path.

However, the **environment variable configuration** needs to be verified.

## Current Code Status ✅

The edge function code is correct:

```typescript
// Line 200: Upload path WITHOUT bucket name
const uploadPath = `guests/headshots/${filename}`;

// Line 209-214: Correct S3 command structure
const command = new PutObjectCommand({
  Bucket: bucketName,        // "inneredge-cdn" (separate parameter)
  Key: uploadPath,           // "guests/headshots/file.jpg" (NO bucket name)
  Body: new Uint8Array(fileBuffer),
  ContentType: headshotFile.type,
});

// Line 218: Correct URL construction
const photoUrl = `${publicUrl}/${uploadPath}`;
```

This creates the correct structure:
- **R2 Path:** `guests/headshots/john-smith-123.jpg`
- **Public URL:** `https://cdn.inneredge.co/guests/headshots/john-smith-123.jpg`

## What Needs to Be Fixed

### 1. Verify Supabase Edge Function Environment Variables

In your Supabase Dashboard → Edge Functions → Secrets, ensure:

```bash
R2_BUCKET_NAME=inneredge-cdn
R2_PUBLIC_URL=https://cdn.inneredge.co
R2_ENDPOINT=https://[your-account-id].r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=[your-access-key]
R2_SECRET_ACCESS_KEY=[your-secret-key]
```

**CRITICAL:** Make sure `R2_PUBLIC_URL` is set to `https://cdn.inneredge.co` and NOT:
- ❌ `https://guests.inneredge.co` (old domain)
- ❌ `https://pub-xxxxx.r2.dev` (R2 default domain)
- ❌ `https://inneredge-cdn.r2.cloudflarestorage.com` (R2 storage endpoint)

### 2. Update Hardcoded Photo URL in PodcastPage

File: `src/components/PodcastPage.tsx` (Line 127)

**Current (incorrect):**
```typescript
src="https://guests.inneredge.co/headshots/soleiman-bolour-1762304576351.jpg"
```

**Fix to:**
```typescript
src="https://cdn.inneredge.co/guests/headshots/soleiman-bolour-1762304576351.jpg"
```

Note the path change:
- Old: `/headshots/` (missing `guests/` prefix)
- New: `/guests/headshots/` (correct organized structure)

## How to Verify the Fix

### Step 1: Check Edge Function Logs

When you submit the onboarding form, check the Supabase Edge Function logs. You should see:

```
R2 Configuration loaded:
- Bucket: inneredge-cdn
- Public URL: https://cdn.inneredge.co
- Endpoint: https://[account-id].r2.cloudflarestorage.com

Upload details:
- Bucket: inneredge-cdn
- Path (Key): guests/headshots/john-smith-1234567890.jpg
- Filename: john-smith-1234567890.jpg

Photo uploaded successfully!
- R2 Path: guests/headshots/john-smith-1234567890.jpg
- Public URL: https://cdn.inneredge.co/guests/headshots/john-smith-1234567890.jpg
- Expected format: https://cdn.inneredge.co/guests/headshots/[filename]
```

### Step 2: Check R2 Bucket Structure

In Cloudflare Dashboard → R2 → inneredge-cdn bucket, verify files are at:

```
inneredge-cdn/
└── guests/
    └── headshots/
        └── john-smith-1234567890.jpg
```

**NOT:**
```
inneredge-cdn/
└── inneredge-cdn/          ❌ WRONG
    └── guests/
        └── headshots/
```

### Step 3: Check Database

Query the database to see what URLs are being saved:

```sql
SELECT slug, photo_url
FROM podcast_guests
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC
LIMIT 5;
```

URLs should be: `https://cdn.inneredge.co/guests/headshots/[filename]`

## Common Causes of Duplicate Bucket Name

If you see `inneredge-cdn/inneredge-cdn/guests/headshots/` in R2, it means:

1. **Environment variable issue:** `R2_BUCKET_NAME` is being used in the Key path
   - **Solution:** The code is already fixed. Redeploy the edge function.

2. **Multiple edge functions:** Another function might be handling uploads
   - **Solution:** Only `podcast-guest-onboarding` handles R2 uploads (verified)

3. **Client-side upload:** Frontend code might be uploading directly
   - **Solution:** Frontend only sends FormData to edge function (verified)

4. **Cached deployment:** Old edge function code still running
   - **Solution:** Edge function has been redeployed with correct code

## Migration for Existing Photos

If you have existing photos at the old location, you can update them:

```sql
-- Update old domain to new domain
UPDATE podcast_guests
SET photo_url = REPLACE(photo_url, 'https://guests.inneredge.co/headshots/', 'https://cdn.inneredge.co/guests/headshots/')
WHERE photo_url LIKE 'https://guests.inneredge.co/headshots/%';
```

**Note:** This assumes the files have already been migrated in R2 from:
- Old: `headshots/filename.jpg`
- New: `guests/headshots/filename.jpg`

## Testing Checklist

- [ ] Environment variables verified in Supabase
- [ ] `R2_PUBLIC_URL=https://cdn.inneredge.co` confirmed
- [ ] Edge function redeployed (if needed)
- [ ] Test form submission with new photo
- [ ] Check edge function logs for correct paths
- [ ] Verify file in R2 at `guests/headshots/[filename]`
- [ ] Confirm database has CDN URL
- [ ] Update hardcoded URLs in PodcastPage.tsx
- [ ] Test that photos are accessible at CDN URL

## Summary

The code is correct. The issue is likely:
1. Wrong `R2_PUBLIC_URL` value in Supabase environment variables
2. Hardcoded old URL in PodcastPage.tsx needs updating
3. Old photos may need URL migration in database

The edge function will work correctly once the environment variables are set properly.
