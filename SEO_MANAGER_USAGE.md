# SEO Manager - Code File Editor

## Overview

The SEO Manager has been converted from a database-driven system to a **code file editor** that updates component files directly during development in Bolt Cloud.

## How It Works

### Before (Database Approach - Had Issues)
- SEO values stored in `seo_meta` database table
- Pages queried database at runtime to load meta tags
- Database queries caused timing issues and complexity
- Values could be out of sync between deployments

### After (Code Editor Approach - Clean & Simple)
- SEO values are **hardcoded** in each page component
- SEO Manager provides a nice UI to edit these values
- When you click "Save", the component file is updated directly
- You then click "Deploy" in Bolt to publish the changes

## User Workflow

1. Navigate to `/admin/seo-manager` in your development environment
2. Click "Edit" on any page you want to update
3. Fill in the SEO fields (title, description, OG image, etc.)
4. Click "Save"
5. You'll see a confirmation: "✓ Updated HomePage.tsx - ready to deploy"
6. Click the "Deploy" button in Bolt Cloud
7. Your updated SEO values go live

## What Happens When You Save

When you save SEO changes for a page (e.g., HomePage), the system:

1. Identifies the component file (e.g., `src/components/HomePage.tsx`)
2. Finds the `<SEOHead>` component in that file
3. Updates the props with your new values
4. Shows you a success message with the file name
5. You can then deploy when ready

## Example

### Before Save (HomePage.tsx):
```tsx
<SEOHead
  title="Old Title"
  description="Old description"
  ogImage="https://old-image.jpg"
/>
```

### After Save (HomePage.tsx):
```tsx
<SEOHead
  title="Men's Life Coaching and Community, San Diego, CA."
  description="Transform your life from the inside out..."
  ogImage="https://cdn.inneredge.co/og-images/home-ie-open-graph.png"
/>
```

## Benefits

✅ **SEO values are hardcoded** = guaranteed to work
✅ **No database queries** = no timing issues
✅ **No complexity** = no bugs
✅ **Version controlled** = values deploy with code
✅ **Simple & reliable** = back to original approach that worked
✅ **Nice UI** = easier than manually editing files

## Technical Details

### SEOHead Component
The SEOHead component has been simplified:
- Removed all database fetching logic (no Supabase queries)
- Removed useState and useEffect hooks
- Props renamed: `fallbackTitle` → `title`, `fallbackDescription` → `description`, etc.
- No `pagePath` prop needed anymore
- Values come directly from props (no fallback logic)

### Available Props
- `title` - Page title for SEO and browser tab
- `description` - Meta description for search results
- `keywords` - SEO keywords (optional)
- `ogImage` - Open Graph image URL
- `canonical` - Canonical URL (optional)
- `ogUrl` - Open Graph URL (optional)
- `locality` - Geographic locality (default: "San Diego")
- `region` - Geographic region (default: "CA")

### Supported Pages
All main pages are supported:
- Home (`/`)
- About (`/about`)
- Blog (`/blog`)
- Podcast (`/podcast`)
- Contact (`/contact`)
- Booking (`/booking`)
- Vision Builder (`/vision-builder`)
- Podcast Guests (`/guests`)
- And more...

## Important Notes

⚠️ **This only works in Bolt Cloud development environment**
The file editing happens during development, then you deploy the changes.

⚠️ **Changes require deployment**
After saving, you must click "Deploy" in Bolt for changes to go live.

⚠️ **OG images still upload to CDN**
When you upload an Open Graph image, it's uploaded to your CDN and the URL is hardcoded in the component.

## Workflow Summary

```
Edit SEO in UI → Save → Component file updated → Deploy → Live
```

This is the correct approach for Bolt Cloud - SEO Manager acts as a specialized code editor during development.
